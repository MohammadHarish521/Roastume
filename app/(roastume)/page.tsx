"use client";

import { ComicCard } from "@/components/comic-card";
import { ResumeCard } from "@/components/resume-card";
import { useRoastume } from "@/lib/store";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const { resumes, currentUser, loading, error } = useRoastume();

  if (loading) {
    return (
      <div className="grid gap-6">
        <ComicCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c2c2c] mx-auto mb-4"></div>
          <p className="text-lg font-bold">Loading resumes...</p>
        </ComicCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6">
        <ComicCard className="p-6 text-center border-red-500 bg-red-50">
          <h2 className="text-xl font-bold text-red-700 mb-2">
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
      {session && (
        <ComicCard className="p-4 bg-gradient-to-r from-[#F2D5A3] to-[#F8E4C6]">
          <h2
            className="text-xl font-extrabold tracking-wide mb-2"
            style={{ textShadow: "1px 1px 0 #2c2c2c" }}
          >
            Welcome back, {currentUser.name}! 👋
          </h2>
          <p className="text-sm opacity-80">
            Ready to get your resume roasted? Check out the latest submissions
            below or upload your own!
          </p>
        </ComicCard>
      )}

      {resumes.length === 0 ? (
        <ComicCard className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No Resumes Yet!</h2>
          <p className="text-sm opacity-80 mb-4">
            Be the first to upload your resume and get some feedback!
          </p>
          {session && (
            <a
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-green-400 hover:bg-green-500 px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
            >
              Upload Resume
            </a>
          )}
        </ComicCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <ResumeCard key={r.id} resume={r} />
          ))}
        </div>
      )}
    </div>
  );
}
