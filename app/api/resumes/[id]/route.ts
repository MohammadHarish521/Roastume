import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/resumes/[id] - Get specific resume
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: resume, error } = await supabase
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
      .eq("id", id)
      .single();

    if (error || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Transform data to match frontend format
    const transformedResume = {
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

// PUT /api/resumes/[id] - Update resume
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
    const { name, blurb, fileUrl, fileType } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check if resume exists and user owns it
    const { data: existingResume, error: fetchError } = await supabase
      .from("resumes")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existingResume.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own resumes" },
        { status: 403 }
      );
    }

    // Update the resume
    const { data: updatedResume, error: updateError } = await supabase
      .from("resumes")
      .update({
        name: name.toUpperCase(),
        blurb: blurb || null,
        file_url: fileUrl || null,
        file_type: fileType || null,
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
      console.error("Error updating resume:", updateError);
      return NextResponse.json(
        { error: "Failed to update resume" },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const transformedResume = {
      id: updatedResume.id,
      name: updatedResume.name,
      blurb: updatedResume.blurb,
      likes: updatedResume.likes_count,
      comments: [], // Will be loaded separately
      fileUrl: updatedResume.file_url,
      fileType: updatedResume.file_type,
      ownerId: updatedResume.user_id,
      createdAt: new Date(updatedResume.created_at).getTime(),
      avatar: updatedResume.profiles?.avatar_url || "/cartoon-avatar-user.png",
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

// DELETE /api/resumes/[id] - Delete resume
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
    // Check if resume exists and user owns it
    const { data: existingResume, error: fetchError } = await supabase
      .from("resumes")
      .select("user_id, file_url")
      .eq("id", id)
      .single();

    if (fetchError || !existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existingResume.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own resumes" },
        { status: 403 }
      );
    }

    // Delete the resume (this will cascade delete comments and likes due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from("resumes")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting resume:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete resume" },
        { status: 500 }
      );
    }

    // TODO: If you want to delete the file from storage as well, uncomment below
    // if (existingResume.file_url) {
    //   const fileName = existingResume.file_url.split('/').pop();
    //   if (fileName) {
    //     await supabase.storage.from('resumes').remove([fileName]);
    //   }
    // }

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
