import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/notifications - List current user's notifications (newest first)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasSrv = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    if (!hasUrl || !hasSrv) {
      console.error("/api/notifications env missing", { hasUrl, hasSrv });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("/api/notifications select error", error);
      return NextResponse.json(
        {
          error: "Failed to fetch notifications",
          details: String(error?.message ?? error),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ notifications: data ?? [] });
  } catch (err: any) {
    console.error("/api/notifications unexpected", err);
    return NextResponse.json(
      { error: "Internal server error", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
