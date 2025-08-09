"use client";

import { ComicCard } from "@/components/comic-card";
import { ResumeCard } from "@/components/resume-card";
import { useRoastume } from "@/lib/store";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { currentUser, byOwner } = useRoastume();
  const myResumes = byOwner(currentUser.id);

  return (
    <div className="grid gap-6">
      {!session && status !== "loading" && (
        <ComicCard className="p-6 text-center">
          <h2
            className="text-2xl font-extrabold tracking-wide mb-4"
            style={{ textShadow: "1px 1px 0 #2c2c2c" }}
          >
            Sign In Required
          </h2>
          <p className="text-lg mb-4">
            You need to sign in to view your profile and manage your resumes.
          </p>
          <button
            onClick={() => signIn()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold border-[3px] border-[#2c2c2c] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform px-6 py-3 rounded-full"
          >
            🚀 Sign In Now
          </button>
        </ComicCard>
      )}

      <ComicCard className="flex items-center gap-4 p-6">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-[4px] border-[#2c2c2c] bg-white shadow-[4px_4px_0_#2c2c2c]">
          <Image
            src={currentUser.avatar || "/placeholder.svg"}
            alt="Your avatar"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2
            className="text-3xl font-extrabold tracking-wide"
            style={{ textShadow: "1px 1px 0 #2c2c2c" }}
          >
            {currentUser.name}
          </h2>
          {session?.user?.email && (
            <p className="text-sm opacity-70 mt-1">{session.user.email}</p>
          )}
          <p className="opacity-80 mt-2">Your uploaded resumes and activity</p>
          {session && (
            <div className="mt-3 flex gap-4 text-sm flex-wrap">
              <span className="bg-[#F2D5A3] px-3 py-1 rounded-full border-[2px] border-[#2c2c2c] shadow-[2px_2px_0_#2c2c2c] font-bold">
                📄 {myResumes.length} Resume{myResumes.length !== 1 ? "s" : ""}
              </span>
              <span className="bg-[#F8E4C6] px-3 py-1 rounded-full border-[2px] border-[#2c2c2c] shadow-[2px_2px_0_#2c2c2c] font-bold">
                ✅ Authenticated
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full border-[2px] border-[#2c2c2c] shadow-[2px_2px_0_#2c2c2c] font-bold hover:-translate-y-0.5 transition-transform"
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </ComicCard>

      <ComicCard className="grid gap-4">
        <h3 className="text-xl font-extrabold tracking-wide">Your Resumes</h3>
        {myResumes.length === 0 ? (
          <p className="text-sm opacity-80">
            You haven&apos;t uploaded anything yet. Try uploading one.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myResumes.map((r) => (
              <ResumeCard key={r.id} resume={r} />
            ))}
          </div>
        )}
      </ComicCard>
    </div>
  );
}
