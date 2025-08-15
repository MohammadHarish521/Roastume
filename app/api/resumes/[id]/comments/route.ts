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

    // Count is handled by DB trigger; no manual update here

    // Notification for resume owner
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
      const message = `${actorName} commented on your resume${
        resumeOwner.name ? ` "${resumeOwner.name}"` : ""
      }`;
      const { error: notifErr } = await supabase.from("notifications").insert({
        user_id: resumeOwner.user_id,
        type: "comment",
        resume_id: id,
        actor_id: session.user.id,
        message,
      });
      if (notifErr) {
        console.error("insert notification (comment) failed", notifErr);
      }
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

    // Try fetching top-level comments (parent_id null). If column missing, fallback without filter
    let repliesSupported = true as boolean;
    let comments: any[] | null = null;

    const topLevelQuery = await supabase
      .from("comments")
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
      .eq("resume_id", id)
      .is("parent_id", null)
      .order("created_at", { ascending: true });

    if (topLevelQuery.error) {
      if ((topLevelQuery.error as any)?.code === "42703") {
        // parent_id column missing; fetch all comments flat and disable replies
        repliesSupported = false;
        const flatQuery = await supabase
          .from("comments")
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
          .eq("resume_id", id)
          .order("created_at", { ascending: true });

        if (flatQuery.error) {
          console.error("Error fetching comments (flat):", flatQuery.error);
          return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
          );
        }
        comments = flatQuery.data ?? [];
      } else {
        console.error("Error fetching comments:", topLevelQuery.error);
        return NextResponse.json(
          { error: "Failed to fetch comments" },
          { status: 500 }
        );
      }
    } else {
      comments = topLevelQuery.data ?? [];
    }

    // Build transformed list; fetch replies only if supported
    const transformed: any[] = [];
    for (const c of comments) {
      let replies: any[] | null = null;
      if (repliesSupported) {
        const repliesQuery = await supabase
          .from("comments")
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
          .eq("parent_id", c.id)
          .order("created_at", { ascending: true });

        if (repliesQuery.error) {
          if ((repliesQuery.error as any)?.code === "42703") {
            replies = [];
          } else {
            console.error("Error fetching replies:", repliesQuery.error);
            return NextResponse.json(
              { error: "Failed to fetch comments" },
              { status: 500 }
            );
          }
        } else {
          replies = repliesQuery.data ?? [];
        }
      } else {
        replies = [];
      }

      transformed.push({
        id: c.id,
        author: c.profiles?.name || "Anonymous",
        avatar: c.profiles?.avatar_url || "/cartoon-avatar-user.png",
        text: c.text,
        upvotes: c.upvotes_count || 0,
        downvotes: c.downvotes_count || 0,
        createdAt: new Date(c.created_at).getTime(),
        replies:
          replies?.map((r: any) => ({
            id: r.id,
            author: r.profiles?.name || "Anonymous",
            avatar: r.profiles?.avatar_url || "/cartoon-avatar-user.png",
            text: r.text,
            upvotes: r.upvotes_count || 0,
            downvotes: r.downvotes_count || 0,
            createdAt: new Date(r.created_at).getTime(),
          })) || [],
      });
    }

    return NextResponse.json({ comments: transformed });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
