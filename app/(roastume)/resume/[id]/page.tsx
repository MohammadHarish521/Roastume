"use client";

import { ComicCard } from "@/components/comic-card";
import { CommentList } from "@/components/comment-list";
import { body, display } from "@/lib/fonts";
import { useRoastume } from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaThumbsUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuthModal } from "@/components/auth-modal-provider";

export default function ResumeDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { find, like } = useRoastume();
  const resume = find(id);
  const pdfUrl =
    resume?.fileType === "pdf" && resume.fileUrl
      ? `${resume.fileUrl}${
          resume.fileUrl.includes("#") ? "&" : "#"
        }view=FitH&zoom=page-width&toolbar=0&navpanes=0&statusbar=0`
      : undefined;

  if (!resume) {
    return (
      <div className="grid gap-4">
        <p>Resume not found.</p>
        <button
          onClick={() => router.push("/")}
          className={cn(
            display.className,
            "w-fit rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] text-lg"
          )}
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
          className={cn(
            display.className,
            "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-3 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] text-lg"
          )}
          aria-label="Back"
        >
          <FaArrowLeft className="h-5 w-5" /> Back
        </button>
        <h2
          className={cn(
            display.className,
            "ml-2 text-3xl font-extrabold tracking-wide text-[#F2D5A3]"
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
          {resume.name}
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] items-start">
        <ComicCard className="grid gap-3">
          <div className="rounded-lg sm:rounded-xl border-[2px] sm:border-[3px] border-[#2c2c2c] bg-white p-0 sm:p-2 shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] overflow-hidden">
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
              <div className="relative w-full aspect-[85/110] sm:aspect-auto sm:h-[600px] lg:h-[700px] overflow-hidden rounded-none sm:rounded-lg bg-white">
                <iframe
                  src={pdfUrl ?? resume.fileUrl}
                  title={`${resume.name} resume PDF`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                />
              </div>
            )}
          </div>
          <p
            className={cn(body.className, "text-sm leading-snug px-2 sm:px-0")}
          >
            {resume.blurb}
          </p>
        </ComicCard>

        <div className="grid gap-3">
          <LikeButton resumeId={resume.id} likes={resume.likes} />

          <ComicCard className="p-3 sm:p-4">
            <CommentList resumeId={resume.id} />
          </ComicCard>
        </div>
      </div>
    </div>
  );
}

function LikeButton({ resumeId, likes }: { resumeId: string; likes: number }) {
  const { find, like } = useRoastume();
  const resume = find(resumeId);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { showSignInModal } = useAuthModal();

  useEffect(() => {
    // naive heuristic: if user likes increased compared to initial render, keep state; otherwise start as not liked
    setIsLiked(false);
  }, [resumeId]);

  return (
    <div className="flex items-center">
      <button
        onClick={async () => {
          if (isLiking) return;
          try {
            setIsLiking(true);
            const liked = await like(resumeId);
            setIsLiked(liked);
          } catch (error: any) {
            if (error?.status === 401) {
              showSignInModal();
            } else {
              console.error("Failed to like resume:", error);
            }
          } finally {
            setIsLiking(false);
          }
        }}
        aria-pressed={isLiked}
        className={cn(
          "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] px-3 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform",
          isLiked ? "bg-green-500" : "bg-green-400"
        )}
        disabled={isLiking}
      >
        <FaThumbsUp className="h-5 w-5" />
        {isLiked ? "Liked" : "Like"}
        <span className="ml-1 rounded-full border-[2px] border-[#2c2c2c] bg-white px-2 py-0.5 text-xs">
          {resume?.likes ?? likes}
        </span>
      </button>
    </div>
  );
}
