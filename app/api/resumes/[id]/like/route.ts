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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already liked this resume
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("id")
      .eq("resume_id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking like:", checkError);
      return NextResponse.json(
        { error: "Failed to check like status" },
        { status: 500 }
      );
    }

    let newLikesCount: number;

    if (existingLike) {
      // Unlike: Remove like and decrement counter
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

      // Decrement likes count
      const { data: updatedResume, error: updateError } = await supabase
        .from("resumes")
        .update({ likes_count: supabase.sql`likes_count - 1` })
        .eq("id", params.id)
        .select("likes_count")
        .single();

      if (updateError) {
        console.error("Error updating likes count:", updateError);
        return NextResponse.json(
          { error: "Failed to update likes count" },
          { status: 500 }
        );
      }

      newLikesCount = updatedResume.likes_count;
    } else {
      // Like: Add like and increment counter
      const { error: insertError } = await supabase.from("likes").insert({
        resume_id: params.id,
        user_id: session.user.id,
      });

      if (insertError) {
        console.error("Error adding like:", insertError);
        return NextResponse.json(
          { error: "Failed to add like" },
          { status: 500 }
        );
      }

      // Increment likes count
      const { data: updatedResume, error: updateError } = await supabase
        .from("resumes")
        .update({ likes_count: supabase.sql`likes_count + 1` })
        .eq("id", params.id)
        .select("likes_count")
        .single();

      if (updateError) {
        console.error("Error updating likes count:", updateError);
        return NextResponse.json(
          { error: "Failed to update likes count" },
          { status: 500 }
        );
      }

      newLikesCount = updatedResume.likes_count;
    }

    return NextResponse.json({
      liked: !existingLike,
      likesCount: newLikesCount,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
