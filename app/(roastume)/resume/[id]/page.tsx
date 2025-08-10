"use client";

import { ComicCard } from "@/components/comic-card";
import { CommentList } from "@/components/comment-list";
import { useRoastume } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FaArrowLeft, FaThumbsUp } from "react-icons/fa";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function ResumeDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { find, like } = useRoastume();
  const resume = find(id);

  if (!resume) {
    return (
      <div className="grid gap-4">
        <p>Resume not found.</p>
        <button
          onClick={() => router.push("/")}
          className="w-fit rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c]"
        >
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-3 py-2 font-bold shadow-[3px_3px_0_#2c2c2c]"
          aria-label="Back"
        >
          <FaArrowLeft className="h-5 w-5" /> Back
        </button>
        <h2
          className={cn("ml-2 text-3xl font-extrabold tracking-wide")}
          style={{ textShadow: "1px 1px 0 #2c2c2c" }}
        >
          {resume.name}
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <ComicCard className="grid gap-3">
          <div className="rounded-xl border-[3px] border-[#2c2c2c] bg-white p-2 shadow-[3px_3px_0_#2c2c2c]">
            {resume.fileType === "image" ? (
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-white">
                <Image
                  src={
                    resume.fileUrl ||
                    "/placeholder.svg?height=1200&width=900&query=resume"
                  }
                  alt={`${resume.name} resume`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <iframe
                src={resume.fileUrl}
                title={`${resume.name} resume PDF`}
                className="h-[700px] w-full rounded-lg"
              />
            )}
          </div>
          <p className="text-sm leading-snug">{resume.blurb}</p>
        </ComicCard>

        <div className="grid gap-4">
          <ComicCard>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  try {
                    await like(resume.id);
                  } catch (error) {
                    console.error("Failed to like resume:", error);
                  }
                }}
                className="flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-3 py-2 font-bold shadow-[3px_3px_0_#2c2c2c]"
              >
                <FaThumbsUp className="h-5 w-5" />
                Like
                <span className="ml-1 rounded-full border-[2px] border-[#2c2c2c] bg-white px-2 py-0.5 text-xs">
                  {resume.likes}
                </span>
              </button>
            </div>
          </ComicCard>

          <CommentList resumeId={resume.id} />
        </div>
      </div>
    </div>
  );
}
