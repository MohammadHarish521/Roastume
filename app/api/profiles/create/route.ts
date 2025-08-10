import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/profiles/create - Force create user profile
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", session.user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({
        message: "Profile already exists",
        profile: existingProfile,
      });
    }

    // Create profile
    const { data: newProfile, error } = await supabase
      .from("profiles")
      .insert({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || null,
        avatar_url: session.user.image || null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
