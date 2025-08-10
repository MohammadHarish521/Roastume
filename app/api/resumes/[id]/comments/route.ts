import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/resumes/[id]/comments - Add comment to resume
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    // Add comment
    const { data: comment, error: commentError } = await supabase
      .from("comments")
      .insert({
        resume_id: params.id,
        user_id: session.user.id,
        text: text.trim(),
      })
      .select(
        `
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `
      )
      .single();

    if (commentError) {
      console.error("Error adding comment:", commentError);
      return NextResponse.json(
        { error: "Failed to add comment" },
        { status: 500 }
      );
    }

    // Increment comments count
    const { error: updateError } = await supabase
      .from("resumes")
      .update({ comments_count: supabase.sql`comments_count + 1` })
      .eq("id", params.id);

    if (updateError) {
      console.error("Error updating comments count:", updateError);
      // Don't fail the request, just log the error
    }

    // Transform comment to match frontend format
    const transformedComment = {
      id: comment.id,
      author: comment.profiles?.name || session.user.name || "Anonymous",
      avatar:
        comment.profiles?.avatar_url ||
        session.user.image ||
        "/cartoon-avatar-user.png",
      text: comment.text,
      createdAt: new Date(comment.created_at).getTime(),
    };

    return NextResponse.json({ comment: transformedComment }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
