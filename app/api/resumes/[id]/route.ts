import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/resumes/[id] - Get single resume with comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch resume with user profile
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
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
      .eq("id", params.id)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Fetch comments with user profiles
    const { data: comments, error: commentsError } = await supabase
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
      .eq("resume_id", params.id)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const transformedResume = {
      id: resume.id,
      name: resume.name,
      blurb: resume.blurb,
      likes: resume.likes_count,
      comments:
        comments?.map((comment) => ({
          id: comment.id,
          author: comment.profiles?.name || "Anonymous",
          avatar: comment.profiles?.avatar_url || "/cartoon-avatar-user.png",
          text: comment.text,
          createdAt: new Date(comment.created_at).getTime(),
        })) || [],
      fileUrl: resume.file_url,
      fileType: resume.file_type,
      ownerId: resume.user_id,
      createdAt: new Date(resume.created_at).getTime(),
      avatar: resume.profiles?.avatar_url || "/cartoon-avatar-user.png",
    };

    return NextResponse.json({ resume: transformedResume });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
