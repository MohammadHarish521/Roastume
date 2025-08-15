import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/resumes/[id]/like - Toggle like on resume
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user already liked this resume
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("id")
      .eq("resume_id", id)
      .eq("user_id", session.user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking like:", checkError);
      return NextResponse.json(
        { error: "Failed to check like status" },
        { status: 500 }
      );
    }

    if (existingLike) {
      // Unlike: Remove like
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return NextResponse.json(
          { error: "Failed to remove like" },
          { status: 500 }
        );
      }

      // Return current count based on likes table
      const { count } = await supabase
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("resume_id", params.id);

      return NextResponse.json({ liked: false, likesCount: count || 0 });
    } else {
      // Like: Add like
      const { error: insertError } = await supabase.from("likes").insert({
        resume_id: id,
        user_id: session.user.id,
      });

      if (insertError) {
        console.error("Error adding like:", insertError);
        return NextResponse.json(
          { error: "Failed to add like" },
          { status: 500 }
        );
      }

      // Return current count based on likes table
      const { count } = await supabase
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("resume_id", id);

      // Create notification for resume owner
      const { data: resumeOwner, error: resumeOwnerErr } = await supabase
        .from("resumes")
        .select("user_id, name")
        .eq("id", id)
        .single();

      if (resumeOwnerErr) {
        console.error("lookup resume owner failed", resumeOwnerErr);
      }

      if (resumeOwner && resumeOwner.user_id !== session.user.id) {
        const actorName = session.user.name || "Someone";
        const message = `${actorName} liked your resume${
          resumeOwner.name ? ` "${resumeOwner.name}"` : ""
        }`;
        const { error: notifErr } = await supabase
          .from("notifications")
          .insert({
            user_id: resumeOwner.user_id,
            type: "like",
            resume_id: id,
            actor_id: session.user.id,
            message,
          });
        if (notifErr) {
          console.error("insert notification (like) failed", notifErr);
        }
      }

      return NextResponse.json({ liked: true, likesCount: count || 0 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
