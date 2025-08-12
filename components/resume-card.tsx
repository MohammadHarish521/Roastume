"use client";

import { body, display } from "@/lib/fonts";
import { useRoastume, type Resume } from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiFillFire, AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import { FaCalendar } from "react-icons/fa";
import { ComicCard } from "./comic-card";

export function ResumeCard({ resume }: { resume: Resume }) {
  const { like } = useRoastume();
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/resume/${resume.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/resume/${resume.id}`);
        }
      }}
      className="cursor-pointer"
    >
      <ComicCard
        variant="cream"
        fontStyle="none"
        shadow="large"
        className="grid grid-rows-[auto_1fr_auto] gap-3 sm:gap-4 border-[3px] sm:border-[4px] border-[#2c2c2c] rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full min-h-[250px]"
      >
        {/* Header section with avatar and info */}
        <div className="flex items-start gap-3 sm:gap-4 mb-2">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-full border-[3px] sm:border-[4px] border-[#2c2c2c] bg-white">
            <Image
              src={
                resume.avatar ||
                "/placeholder.svg?height=64&width=64&query=avatar"
              }
              alt={`${resume.name} avatar`}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                display.className,
                "text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-[#2c2c2c] mb-1 sm:mb-2 leading-tight"
              )}
              style={{
                textShadow: "2px 2px 0 rgba(44, 44, 44, 0.2)",
                transform: "rotate(-1deg)",
              }}
            >
              {resume.name}
            </h3>
            <p
              className={cn(
                body.className,
                "text-sm sm:text-base leading-relaxed text-[#2c2c2c] italic line-clamp-2"
              )}
            >
              {resume.blurb || "No description provided."}
            </p>
            {resume.blurb && resume.blurb.length > 140 && (
              <span className="mt-1 inline-block text-xs text-[#2c2c2c]/70">
                …
              </span>
            )}
            <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#2c2c2c]/70">
              <span className="flex items-center">
                <FaCalendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />{" "}
                <span className="hidden sm:inline">
                  {new Date(resume.createdAt).toLocaleDateString()}
                </span>
                <span className="sm:hidden">
                  {new Date(resume.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-auto pt-2 sm:pt-3 border-t-2 border-[#2c2c2c]/20">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await like(resume.id);
              } catch (error) {
                console.error("Failed to like resume:", error);
              }
            }}
            className={cn(
              display.className,
              "flex items-center gap-1 sm:gap-2 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-green-400 hover:bg-green-500 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c]"
            )}
            aria-label="Like this resume"
          >
            <AiOutlineLike className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="rounded-full border-[1px] sm:border-[2px] border-[#2c2c2c] bg-[#F2D5A3] px-1.5 sm:px-2 py-0.5 text-xs font-normal">
              {resume.likes}
            </span>
          </button>

          <Link
            href={`/resume/${resume.id}#comments`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              display.className,
              "flex items-center gap-1 sm:gap-2 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-cyan-400 hover:bg-cyan-500 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c]"
            )}
          >
            <AiOutlineComment className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="rounded-full border-[1px] sm:border-[2px] border-[#2c2c2c] bg-[#F2D5A3] px-1.5 sm:px-2 py-0.5 text-xs font-normal">
              {resume.comments.length}
            </span>
          </Link>

          <Link
            href={`/resume/${resume.id}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              display.className,
              "flex items-center gap-1 sm:gap-2 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-orange-400 hover:bg-orange-500 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c] ml-auto"
            )}
            aria-label="Roast this resume"
          >
            <AiFillFire className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Roast!</span>
            <span className="sm:hidden">🔥</span>
          </Link>
        </div>
      </ComicCard>
    </div>
  );
}
