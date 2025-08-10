import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/resumes - Fetch all resumes with user profiles
export async function GET() {
  try {
    const { data: resumes, error } = await supabase
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resumes:", error);
      return NextResponse.json(
        { error: "Failed to fetch resumes" },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const transformedResumes =
      resumes?.map((resume) => ({
        id: resume.id,
        name: resume.name,
        blurb: resume.blurb,
        likes: resume.likes_count,
        comments: [], // Will be loaded separately
        fileUrl: resume.file_url,
        fileType: resume.file_type,
        ownerId: resume.user_id,
        createdAt: new Date(resume.created_at).getTime(),
        avatar: resume.profiles?.avatar_url || "/cartoon-avatar-user.png",
      })) || [];

    return NextResponse.json({ resumes: transformedResumes });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/resumes - Create new resume
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, blurb, fileUrl, fileType } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data: resume, error } = await supabase
      .from("resumes")
      .insert({
        user_id: session.user.id,
        name: name.toUpperCase(),
        blurb: blurb || null,
        file_url: fileUrl || null,
        file_type: fileType || null,
        likes_count: 0,
        comments_count: 0,
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

    if (error) {
      console.error("Error creating resume:", error);
      return NextResponse.json(
        { error: "Failed to create resume" },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const transformedResume = {
      id: resume.id,
      name: resume.name,
      blurb: resume.blurb,
      likes: resume.likes_count,
      comments: [],
      fileUrl: resume.file_url,
      fileType: resume.file_type,
      ownerId: resume.user_id,
      createdAt: new Date(resume.created_at).getTime(),
      avatar:
        resume.profiles?.avatar_url ||
        session.user.image ||
        "/cartoon-avatar-user.png",
    };

    return NextResponse.json({ resume: transformedResume }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
