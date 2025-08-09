"use client";

import { ComicCard } from "@/components/comic-card";
import { ResumeCard } from "@/components/resume-card";
import { useRoastume } from "@/lib/store";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const { resumes, currentUser } = useRoastume();

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((r) => (
          <ResumeCard key={r.id} resume={r} />
        ))}
      </div>
    </div>
  );
}
