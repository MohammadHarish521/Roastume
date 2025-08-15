import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/comments/[id]/replies - Add reply to comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Reply text is required" },
        { status: 400 }
      );
    }

    // Check if parent comment exists and get resume_id
    const { data: parentComment, error: parentError } = await supabase
      .from("comments")
      .select("id, resume_id")
      .eq("id", id)
      .single();

    if (parentError || !parentComment) {
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    // Add reply (fallback if parent_id missing)
    let reply: any = null;
    let replyError: any = null;
    const insertAttempt = await supabase
      .from("comments")
      .insert({
        resume_id: parentComment.resume_id,
        user_id: session.user.id,
        parent_id: id,
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

    if (insertAttempt.error && insertAttempt.error.code === "PGRST204") {
      // parent_id missing; create a flat comment instead of a nested reply
      const flatInsert = await supabase
        .from("comments")
        .insert({
          resume_id: parentComment.resume_id,
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

      reply = flatInsert.data;
      replyError = flatInsert.error;
    } else {
      reply = insertAttempt.data;
      replyError = insertAttempt.error;
    }

    if (replyError) {
      console.error("Error adding reply:", replyError);
      return NextResponse.json(
        { error: "Failed to add reply" },
        { status: 500 }
      );
    }

    // Notification for resume owner (and optionally parent comment author in future)
    const { data: parentWithResume } = await supabase
      .from("comments")
      .select("resume_id")
      .eq("id", id)
      .single();

    if (parentWithResume?.resume_id) {
      const resumeId = parentWithResume.resume_id as string;
      const { data: resumeOwner } = await supabase
        .from("resumes")
        .select("user_id, name")
        .eq("id", resumeId)
        .single();

      if (resumeOwner && resumeOwner.user_id !== session.user.id) {
        const actorName = session.user.name || "Someone";
        const message = `${actorName} replied on your resume${
          resumeOwner.name ? ` "${resumeOwner.name}"` : ""
        }`;
        await supabase.from("notifications").insert({
          user_id: resumeOwner.user_id,
          type: "reply",
          resume_id: resumeId,
          actor_id: session.user.id,
          message,
        });
      }
    }

    // Transform reply to match frontend format
    const transformedReply = {
      id: reply.id,
      author: reply.profiles?.name || session.user.name || "Anonymous",
      avatar:
        reply.profiles?.avatar_url ||
        session.user.image ||
        "/cartoon-avatar-user.png",
      text: reply.text,
      upvotes: reply.upvotes_count,
      downvotes: reply.downvotes_count,
      createdAt: new Date(reply.created_at).getTime(),
    };

    return NextResponse.json({ reply: transformedReply }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/comments/[id]/replies - Get replies for a comment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // If parent_id column missing, return empty array
    const { data: replies, error } = await supabase
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
      .eq("parent_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      if (
        (error as any)?.code === "PGRST204" ||
        (error as any)?.code === "42703"
      ) {
        return NextResponse.json({ replies: [] });
      }
      console.error("Error fetching replies:", error);
      return NextResponse.json(
        { error: "Failed to fetch replies" },
        { status: 500 }
      );
    }

    // Transform replies to match frontend format
    const transformedReplies =
      replies?.map((reply) => ({
        id: reply.id,
        author: reply.profiles?.name || "Anonymous",
        avatar: reply.profiles?.avatar_url || "/cartoon-avatar-user.png",
        text: reply.text,
        upvotes: reply.upvotes_count,
        downvotes: reply.downvotes_count,
        createdAt: new Date(reply.created_at).getTime(),
      })) || [];

    return NextResponse.json({ replies: transformedReplies });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
