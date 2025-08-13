import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/resumes - Fetch all resumes with user profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.max(
      1,
      Math.min(50, Number(searchParams.get("pageSize") || 9))
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const q = (searchParams.get("q") || "").trim();
    let query = supabase.from("resumes").select(
      `
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `,
      { count: "exact", head: false }
    );

    if (q) {
      // Search by name or blurb
      query = query.or(
        `name.ilike.%${q
          .replaceAll("%", "")
          .replaceAll("_", "_")}%,blurb.ilike.%${q
          .replaceAll("%", "")
          .replaceAll("_", "_")}%`
      );
    }

    const ranged = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (ranged.error) {
      console.error("Error fetching resumes:", ranged.error);
      return NextResponse.json(
        { error: "Failed to fetch resumes" },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const transformedResumes =
      ranged.data?.map((resume) => ({
        id: resume.id,
        name: resume.name,
        blurb: resume.blurb,
        likes: resume.likes_count,
        comments: [], // Will be loaded separately
        commentsCount: resume.comments_count,
        fileUrl: resume.file_url,
        fileType: resume.file_type,
        ownerId: resume.user_id,
        createdAt: new Date(resume.created_at).getTime(),
        avatar: resume.profiles?.avatar_url || "/cartoon-avatar-user.png",
      })) || [];

    const total = ranged.count ?? transformedResumes.length;
    return NextResponse.json({ resumes: transformedResumes, total });
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, blurb, fileUrl, fileType } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // First, ensure the user profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", session.user.id)
      .single();

    if (!existingProfile) {
      // Create profile if it doesn't exist
      await supabase.from("profiles").insert({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || null,
        avatar_url: session.user.image || null,
      });
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
      .select("*")
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
      commentsCount: resume.comments_count,
      fileUrl: resume.file_url,
      fileType: resume.file_type,
      ownerId: resume.user_id,
      createdAt: new Date(resume.created_at).getTime(),
      avatar: session.user.image || "/cartoon-avatar-user.png",
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
