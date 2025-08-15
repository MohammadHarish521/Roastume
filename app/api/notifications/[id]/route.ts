import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PUT /api/notifications/[id] - Mark a notification as read
export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", params.id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
