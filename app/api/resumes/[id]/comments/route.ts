import { authOptions } from "@/lib/auth";
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
        resume_id: id,
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
    const { data: resume } = await supabase
      .from("resumes")
      .select("comments_count")
      .eq("id", id)
      .single();

    const { error: updateError } = await supabase
      .from("resumes")
      .update({ comments_count: (resume?.comments_count || 0) + 1 })
      .eq("id", id);

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
      upvotes: comment.upvotes_count || 0,
      downvotes: comment.downvotes_count || 0,
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

// GET /api/resumes/[id]/comments - Fetch comments for a resume (with replies)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch top-level comments for the resume including profiles and nested replies
    const { data: comments, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        ),
        replies:comments!parent_id (
          *,
          profiles:user_id (
            id,
            name,
            avatar_url
          )
        )
      `
      )
      .eq("resume_id", id)
      .is("parent_id", null)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    const transformed =
      comments?.map((c: any) => ({
        id: c.id,
        author: c.profiles?.name || "Anonymous",
        avatar: c.profiles?.avatar_url || "/cartoon-avatar-user.png",
        text: c.text,
        upvotes: c.upvotes_count || 0,
        downvotes: c.downvotes_count || 0,
        createdAt: new Date(c.created_at).getTime(),
        replies:
          c.replies?.map((r: any) => ({
            id: r.id,
            author: r.profiles?.name || "Anonymous",
            avatar: r.profiles?.avatar_url || "/cartoon-avatar-user.png",
            text: r.text,
            upvotes: r.upvotes_count || 0,
            downvotes: r.downvotes_count || 0,
            createdAt: new Date(r.created_at).getTime(),
          })) || [],
      })) || [];

    return NextResponse.json({ comments: transformed });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
