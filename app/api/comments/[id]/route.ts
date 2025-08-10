import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/comments/[id] - Get specific comment with replies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: comment, error } = await supabase
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
      .eq("id", id)
      .single();

    if (error || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Transform comment to match frontend format
    const transformedComment = {
      id: comment.id,
      author: comment.profiles?.name || "Anonymous",
      avatar: comment.profiles?.avatar_url || "/cartoon-avatar-user.png",
      text: comment.text,
      upvotes: comment.upvotes_count,
      downvotes: comment.downvotes_count,
      createdAt: new Date(comment.created_at).getTime(),
      replies:
        comment.replies?.map((reply: any) => ({
          id: reply.id,
          author: reply.profiles?.name || "Anonymous",
          avatar: reply.profiles?.avatar_url || "/cartoon-avatar-user.png",
          text: reply.text,
          upvotes: reply.upvotes_count,
          downvotes: reply.downvotes_count,
          createdAt: new Date(reply.created_at).getTime(),
        })) || [],
    };

    return NextResponse.json({ comment: transformedComment });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/comments/[id] - Update comment
export async function PUT(
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

    // Check if comment exists and user owns it
    const { data: existingComment, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own comments" },
        { status: 403 }
      );
    }

    // Update the comment
    const { data: updatedComment, error: updateError } = await supabase
      .from("comments")
      .update({
        text: text.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
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

    if (updateError) {
      console.error("Error updating comment:", updateError);
      return NextResponse.json(
        { error: "Failed to update comment" },
        { status: 500 }
      );
    }

    // Transform comment to match frontend format
    const transformedComment = {
      id: updatedComment.id,
      author: updatedComment.profiles?.name || "Anonymous",
      avatar: updatedComment.profiles?.avatar_url || "/cartoon-avatar-user.png",
      text: updatedComment.text,
      upvotes: updatedComment.upvotes_count,
      downvotes: updatedComment.downvotes_count,
      createdAt: new Date(updatedComment.created_at).getTime(),
    };

    return NextResponse.json({ comment: transformedComment });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Delete comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // Check if comment exists and user owns it
    const { data: existingComment, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Delete the comment (this will cascade delete replies and votes due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting comment:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
