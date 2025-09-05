"use client";

import { ComicCard } from "@/components/comic-card";
import { ResumeCard } from "@/components/resume-card";
import { SearchBar } from "@/components/search-bar";
import { WelcomeModal } from "@/components/welcome-modal";
import { body, display } from "@/lib/fonts";
import { useRoastume } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FaTrophy } from "react-icons/fa";
import { fetchProfile } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function Page() {
  const { data: session } = useSession();
  const { resumes, currentUser, loading, error, refreshResumes } =
    useRoastume();
  const [searchQuery, setSearchQuery] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Filter resumes based on search query
  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes;

    const query = searchQuery.toLowerCase();
    return resumes.filter(
      (resume) =>
        resume.name.toLowerCase().includes(query) ||
        resume.blurb.toLowerCase().includes(query)
    );
  }, [resumes, searchQuery]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <ComicCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c2c2c] mx-auto mb-4"></div>
          <p className={cn(body.className, "text-lg font-bold")}>
            Loading resumes...
          </p>
        </ComicCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6">
        <ComicCard className="p-6 text-center border-red-500 bg-red-50">
          <h2
            className={cn(
              display.className,
              "text-xl font-bold text-red-700 mb-2"
            )}
          >
            Error Loading Resumes
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
          >
            Try Again
          </button>
        </ComicCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Congrats toast on high like count */}
      <PageCongratsToast />
      {session && showWelcome && (
        <ComicCard className="p-4 bg-gradient-to-r from-[#F2D5A3] to-[#F8E4C6] relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Close button clicked");
              setShowWelcome(false);
            }}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-black/10 transition-colors z-10 border-2 border-transparent hover:border-[#2c2c2c]"
            aria-label="Close welcome message"
            type="button"
          >
            <FaTimes className="w-4 h-4 text-[#2c2c2c]" />
          </button>
          <h2
            className={cn(
              display.className,
              "text-xl font-extrabold tracking-wide mb-2 pr-8"
            )}
            style={{
              textShadow: "2px 2px 0 rgba(44, 44, 44, 0.2)",
              transform: "rotate(-1deg)",
            }}
          >
            Welcome back, {currentUser.name}! 👋
          </h2>
          <p className={cn(body.className, "text-sm opacity-80")}>
            Ready to get your resume roasted? Check out the latest submissions
            below or upload your own!
          </p>
        </ComicCard>
      )}

      {/* Search Bar */}
      {resumes.length > 0 && (
        <ComicCard className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar
                onSearch={(q) => {
                  setSearchQuery(q);
                  const next = 1;
                  setPage(next);
                  refreshResumes(next, pageSize, q);
                }}
                placeholder="Search resumes by title or description..."
                className="w-full"
              />
            </div>
          </div>
        </ComicCard>
      )}

      {resumes.length === 0 ? (
        <ComicCard className="p-8 text-center">
          <h2 className={cn(display.className, "text-xl font-bold mb-2")}>
            No Resumes Yet!
          </h2>
          <p className={cn(body.className, "text-sm opacity-80 mb-4")}>
            Be the first to upload your resume and get some feedback!
          </p>
          {session && (
            <a
              href="/upload"
              className={cn(
                display.className,
                "inline-flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-green-400 hover:bg-green-500 px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              Upload Resume
            </a>
          )}
        </ComicCard>
      ) : filteredResumes.length === 0 && searchQuery ? (
        <ComicCard className="p-8 text-center">
          <h2 className={cn(display.className, "text-xl font-bold mb-2")}>
            No Resumes Found
          </h2>
          <p className={cn(body.className, "text-sm opacity-80 mb-4")}>
            No resumes match your search for "{searchQuery}". Try a different
            search term!
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className={cn(
              body.className,
              "rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
            )}
          >
            Clear Search
          </button>
        </ComicCard>
      ) : (
        <div className="grid gap-4">
          <h3
            className={cn(
              display.className,
              "text-lg sm:text-2xl lg:text-3xl font-normal tracking-wide text-[#F2D5A3] mb-1 sm:mb-2 break-words"
            )}
            style={{
              textShadow: [
                "4px 4px 0 #2a7e84",
                "3px 3px 0 #2a7e84",
                "2px 2px 0 #2a7e84",
                "-1px -1px 0 #2c2c2c",
                "1px -1px 0 #2c2c2c",
                "-1px 1px 0 #2c2c2c",
                "1px 1px 0 #2c2c2c",
              ].join(", "),
            }}
          >
            Resumes
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResumes.map((r) => (
              <ResumeCard key={r.id} resume={r} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              className={cn(
                body.className,
                "px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] shadow-[3px_3px_0_#2c2c2c] disabled:opacity-50"
              )}
              disabled={page <= 1}
              onClick={async () => {
                const next = Math.max(1, page - 1);
                setPage(next);
                await refreshResumes(next, pageSize);
              }}
            >
              Prev
            </button>
            <span className={cn(body.className, "text-sm px-2")}>
              Page {page}
            </span>
            <button
              className={cn(
                body.className,
                "px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] shadow-[3px_3px_0_#2c2c2c]"
              )}
              onClick={async () => {
                const next = page + 1;
                setPage(next);
                await refreshResumes(next, pageSize);
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <WelcomeModal />
    </div>
  );
}

function PageCongratsToast() {
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const run = async () => {
      try {
        const { count, error } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true });
        if (error) return;
        const totalUsers = count ?? 0;
        if (totalUsers >= 100) {
          setTimeout(() => {
            toast.custom(
              () => (
                <div className="pointer-events-auto max-w-sm w-full rounded-2xl comic-border bg-[#F2D5A3] comic-shadow-4 p-3 flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#97D4D5] border-2 border-[#2c2c2c]">
                    <FaTrophy className="h-4 w-4 text-[#2c2c2c]" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        display.className,
                        "text-sm font-black leading-tight"
                      )}
                    >
                      We hit 100+ users!
                    </p>
                    <p
                      className={cn(
                        body.className,
                        "text-xs font-medium opacity-80"
                      )}
                    >
                      Community size: {totalUsers}
                    </p>
                  </div>
                </div>
              ),
              { duration: 6000 }
            );
          }, 250);
        }
      } catch {}
    };
    run();
  }, [supabase]);

  return null;
}
