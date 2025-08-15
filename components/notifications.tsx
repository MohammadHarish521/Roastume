"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  markAllNotificationsRead,
  markNotificationRead,
  fetchNotifications,
  type ApiNotification,
} from "@/lib/api";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { display } from "@/lib/fonts";
import { FaBell, FaCheck, FaBellSlash, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

export function NotificationsBell({ compact = false }: { compact?: boolean }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ApiNotification[]>([]);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.is_read).length,
    [items]
  );

  useEffect(() => {
    if (!session?.user?.id) return;

    // initial load
    const load = async () => {
      try {
        setLoading(true);
        const list = await fetchNotifications();
        setItems(list);
      } catch (e) {
        // no-op
      } finally {
        setLoading(false);
      }
    };
    load();

    // realtime subscription
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("notifications-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const n = payload.new as unknown as ApiNotification;
          setItems((prev) => [n, ...prev]);
          toast.info(n.message, { duration: Infinity });
        }
      )
      .subscribe();

    // polling fallback (in case realtime is disabled)
    const interval = setInterval(() => {
      fetchNotifications()
        .then((list) => setItems(list))
        .catch(() => {});
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [session?.user?.id]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          display.className,
          compact
            ? "relative flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-[#2c2c2c] bg-[#F8E4C6] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
            : "relative flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F8E4C6] px-3 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
        )}
        aria-label="Notifications"
      >
        <FaBell className={compact ? "h-5 w-5" : "h-4 w-4"} />
        {!compact && unreadCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white border-2 border-[#2c2c2c]">
            {unreadCount}
          </span>
        )}
        {compact && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-[6px] text-xs font-black text-white border-2 border-[#2c2c2c]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-[60vh] overflow-auto bg-[#97D4D5] border-[3px] border-[#2c2c2c] rounded-2xl shadow-[4px_4px_0_#2c2c2c] z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#2c2c2c]/20">
            <span className={cn(display.className, "text-sm font-bold")}>
              Notifications
            </span>
            <button
              onClick={handleMarkAllRead}
              className={cn(
                display.className,
                "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#F2D5A3] px-2 py-1 text-xs font-bold shadow-[2px_2px_0_#2c2c2c]"
              )}
            >
              <FaCheck className="h-3 w-3" /> Mark all read
            </button>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="flex items-center gap-2 p-3 text-sm">
                <FaSpinner className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : items.length === 0 ? (
              <div className="flex items-center gap-2 p-4 text-sm">
                <FaBellSlash className="h-4 w-4" /> No notifications yet
              </div>
            ) : (
              <ul className="space-y-2">
                {items.map((n) => (
                  <li
                    key={n.id}
                    className={cn(
                      "flex items-start gap-2 rounded-xl border-[2px] border-[#2c2c2c] bg-[#F8E4C6] p-3 shadow-[2px_2px_0_#2c2c2c]",
                      !n.is_read && "bg-[#F2D5A3]"
                    )}
                  >
                    <div className="mt-0.5">
                      {n.type === "like" ? (
                        <FaBell className="h-4 w-4" />
                      ) : n.type === "comment" ? (
                        <FaBell className="h-4 w-4" />
                      ) : (
                        <FaBell className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          display.className,
                          "text-xs font-bold leading-snug"
                        )}
                      >
                        {n.message}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {!n.is_read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className={cn(
                              display.className,
                              "rounded-full border-[2px] border-[#2c2c2c] bg-white/70 px-2 py-0.5 text-[10px] font-bold shadow-[1px_1px_0_#2c2c2c]"
                            )}
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
