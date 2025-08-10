import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/resumes/my - Get current user's resumes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user resumes:", error);
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
        comments: [], // Will be loaded separately if needed
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
