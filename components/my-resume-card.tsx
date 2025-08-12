"use client";

import { body, display } from "@/lib/fonts";
import { useRoastume, type Resume } from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiFillFire, AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import { FaCalendar, FaEdit, FaTrash } from "react-icons/fa";
import { ComicCard } from "./comic-card";
import ConfirmModal from "./confirm-modal";

interface MyResumeCardProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
}

export function MyResumeCard({ resume, onEdit }: MyResumeCardProps) {
  const { like, deleteResume } = useRoastume();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteResume(resume.id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to delete resume:", error);
      alert("Failed to delete resume. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ComicCard
        variant="cream"
        fontStyle="none"
        shadow="large"
        className="flex flex-col gap-4 border-[4px] border-[#2c2c2c] rounded-2xl p-4 sm:p-6 w-full"
      >
        {/* Header section with avatar and info */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full border-[3px] sm:border-[4px] border-[#2c2c2c] bg-white">
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
                "text-lg sm:text-2xl lg:text-3xl font-normal tracking-wide text-[#2c2c2c] mb-1 sm:mb-2 break-words"
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
            <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-[#2c2c2c]/70">
              <span className="flex items-center">
                <FaCalendar className="mr-1 w-3 h-3" />
                {new Date(resume.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-3 border-t-2 border-[#2c2c2c]/20">
          {/* First row - Like, Comments, Edit */}
          <div className="flex items-center justify-between  sm:gap-2 mb-2">
            <button
              onClick={async () => {
                try {
                  await like(resume.id);
                } catch (error) {
                  console.error("Failed to like resume:", error);
                }
              }}
              className={cn(
                display.className,
                "flex items-center gap-1 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-green-400 hover:bg-green-500 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c]"
              )}
              aria-label="Like this resume"
            >
              <AiOutlineLike className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="rounded-full border-[1px] sm:border-[2px] border-[#2c2c2c] bg-[#F2D5A3] px-1 sm:px-1.5 py-0.5 text-xs font-normal">
                {resume.likes}
              </span>
            </button>

            <Link
              href={`/resume/${resume.id}#comments`}
              className={cn(
                display.className,
                "flex items-center gap-1 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-cyan-400 hover:bg-cyan-500 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c]"
              )}
            >
              <AiOutlineComment className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="rounded-full border-[1px] sm:border-[2px] border-[#2c2c2c] bg-[#F2D5A3] px-1 sm:px-1.5 py-0.5 text-xs font-normal">
                {resume.comments.length}
              </span>
            </Link>

            <button
              onClick={() => onEdit(resume)}
              className={cn(
                display.className,
                "flex items-center gap-1 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-blue-400 hover:bg-blue-500 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c]"
              )}
              aria-label="Edit this resume"
            >
              <FaEdit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

          {/* Second row - Delete and View */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting}
              className={cn(
                display.className,
                "flex items-center gap-1 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-red-400 hover:bg-red-500 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c] disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Delete this resume"
            >
              <FaTrash className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">
                {isDeleting ? "..." : "Delete"}
              </span>
            </button>

            <Link
              href={`/resume/${resume.id}`}
              className={cn(
                display.className,
                "flex items-center gap-1 rounded-full border-[2px] sm:border-[3px] border-[#2c2c2c] bg-orange-400 hover:bg-orange-500 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-normal shadow-[2px_2px_0_#2c2c2c] sm:shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c]"
              )}
              aria-label="View this resume"
            >
              <AiFillFire className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">View</span>
              <span className="sm:hidden">👁️</span>
            </Link>
          </div>
        </div>
      </ComicCard>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete resume?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        isConfirming={isDeleting}
      />
    </>
  );
}
