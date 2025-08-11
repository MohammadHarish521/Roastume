"use client";

import { body, display } from "@/lib/fonts";
import { useRoastume } from "@/lib/store";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { EnhancedComment } from "./enhanced-comment";

export function CommentList({ resumeId }: { resumeId: string }) {
  const { find, addComment, loadComments } = useRoastume();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const resume = find(resumeId);

  if (!resume) return null;

  useEffect(() => {
    // Load comments for this resume
    const loadCommentsForResume = async () => {
      try {
        await loadComments(resumeId);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadCommentsForResume();
  }, [resumeId, loadComments]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setIsSubmitting(true);
      await addComment(resumeId, text.trim());
      setText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="comments" className="grid gap-6">
      <h3
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
        Comments
      </h3>

      <form onSubmit={onSubmit} className="flex items-start gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Drop your best roast (be kind) ..."
          className="min-h-[70px] flex-1 rounded-2xl border-[3px] border-[#2c2c2c] bg-[#F2D5A3] p-3 shadow-[4px_4px_0_#2c2c2c] focus:outline-none focus:shadow-[6px_6px_0_#2c2c2c] transition-all"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="h-fit rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="space-y-4">
        {isLoadingComments ? (
          <p
            className={cn(
              body.className,
              "text-sm opacity-80 text-center py-8"
            )}
          >
            Loading comments...
          </p>
        ) : resume.comments.length === 0 ? (
          <p
            className={cn(
              body.className,
              "text-sm opacity-80 text-center py-8"
            )}
          >
            No comments yet. Be the first to roast! 🔥
          </p>
        ) : (
          resume.comments.map((c) => <EnhancedComment key={c.id} comment={c} />)
        )}
      </div>
    </div>
  );
}
