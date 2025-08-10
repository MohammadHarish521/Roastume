import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/profiles - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    // If profile doesn't exist, create it
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.name,
          avatar_url: session.user.image,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return NextResponse.json(
          { error: "Failed to create profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({ profile: newProfile });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/profiles - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatar_url } = body;

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        name,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
