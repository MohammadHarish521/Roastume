"use client";

import { useRoastume, type Comment } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Bangers, Kalam } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaEllipsisV,
  FaReply,
  FaThumbsDown,
  FaThumbsUp,
  FaTrash,
} from "react-icons/fa";
import { ComicCard } from "./comic-card";

const body = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });
const display = Bangers({ subsets: ["latin"], weight: "400" });

interface EnhancedCommentProps {
  comment: Comment;
  isReply?: boolean;
}

export function EnhancedComment({
  comment,
  isReply = false,
}: EnhancedCommentProps) {
  const { data: session } = useSession();
  const { currentUser, voteOnComment, addReply, updateComment, deleteComment } =
    useRoastume();

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = session?.user?.id && comment.author === currentUser.name;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleVote = async (voteType: "upvote" | "downvote") => {
    try {
      await voteOnComment(comment.id, voteType);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setIsSubmitting(true);
      await addReply(comment.id, replyText.trim());
      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      setIsSubmitting(true);
      await updateComment(comment.id, editText.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(comment.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className={cn("space-y-3", isReply && "ml-8")}>
      <ComicCard className="p-4 border-[3px] border-[#2c2c2c] rounded-xl bg-white/80">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-[2px] border-[#2c2c2c] bg-white">
            <Image
              src={comment.avatar}
              alt={`${comment.author} avatar`}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(body.className, "font-bold text-[#2c2c2c]")}
                >
                  {comment.author}
                </span>
                <span className="text-xs text-[#2c2c2c]/60">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Menu for owner */}
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FaEllipsisV className="h-3 w-3 text-[#2c2c2c]/60" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-8 bg-white border-[2px] border-[#2c2c2c] rounded-lg shadow-[3px_3px_0_#2c2c2c] z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-blue-100 flex items-center gap-2 border-b border-gray-200"
                      >
                        <FaEdit className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-red-100 flex items-center gap-2 text-red-600"
                      >
                        <FaTrash className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment text or edit form */}
            {isEditing ? (
              <form onSubmit={handleEdit} className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={cn(
                    body.className,
                    "w-full p-2 border-[2px] border-[#2c2c2c] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  )}
                  rows={3}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      display.className,
                      "px-3 py-1 bg-green-400 hover:bg-green-500 border-[2px] border-[#2c2c2c] rounded-lg shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50"
                    )}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.text);
                    }}
                    className={cn(
                      display.className,
                      "px-3 py-1 bg-gray-400 hover:bg-gray-500 border-[2px] border-[#2c2c2c] rounded-lg shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all text-sm"
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className={cn(body.className, "text-[#2c2c2c] mb-3")}>
                {comment.text}
              </p>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-4">
                {/* Voting */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote("upvote")}
                    className="flex items-center gap-1 px-2 py-1 rounded-full border-[2px] border-[#2c2c2c] bg-green-200 hover:bg-green-300 shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all"
                  >
                    <FaThumbsUp className="h-3 w-3" />
                    <span className="text-xs font-bold">{comment.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote("downvote")}
                    className="flex items-center gap-1 px-2 py-1 rounded-full border-[2px] border-[#2c2c2c] bg-red-200 hover:bg-red-300 shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all"
                  >
                    <FaThumbsDown className="h-3 w-3" />
                    <span className="text-xs font-bold">
                      {comment.downvotes}
                    </span>
                  </button>
                </div>

                {/* Reply button */}
                {!isReply && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full border-[2px] border-[#2c2c2c] bg-blue-200 hover:bg-blue-300 shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all"
                  >
                    <FaReply className="h-3 w-3" />
                    <span className="text-xs font-bold">Reply</span>
                  </button>
                )}

                {/* Show replies toggle */}
                {hasReplies && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full border-[2px] border-[#2c2c2c] bg-yellow-200 hover:bg-yellow-300 shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all"
                  >
                    {showReplies ? (
                      <FaChevronUp className="h-3 w-3" />
                    ) : (
                      <FaChevronDown className="h-3 w-3" />
                    )}
                    <span className="text-xs font-bold">
                      {comment.replies?.length}{" "}
                      {comment.replies?.length === 1 ? "reply" : "replies"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <form onSubmit={handleReply} className="mt-4 ml-13 space-y-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className={cn(
                body.className,
                "w-full p-2 border-[2px] border-[#2c2c2c] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              )}
              rows={2}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  display.className,
                  "px-3 py-1 bg-blue-400 hover:bg-blue-500 border-[2px] border-[#2c2c2c] rounded-lg shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50"
                )}
              >
                {isSubmitting ? "Posting..." : "Post Reply"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText("");
                }}
                className={cn(
                  display.className,
                  "px-3 py-1 bg-gray-400 hover:bg-gray-500 border-[2px] border-[#2c2c2c] rounded-lg shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all text-sm"
                )}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </ComicCard>

      {/* Replies */}
      {showReplies && hasReplies && (
        <div className="space-y-3">
          {comment.replies?.map((reply) => (
            <EnhancedComment key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );
}
