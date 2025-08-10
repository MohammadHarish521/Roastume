import {
  addComment as apiAddComment,
  addReply as apiAddReply,
  deleteComment as apiDeleteComment,
  updateComment as apiUpdateComment,
  voteOnComment as apiVoteOnComment,
  fetchResumeComments,
} from "../api";
import type { Resume } from "./types";

export function createCommentActions(
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>
) {
  const loadComments = async (resumeId: string) => {
    try {
      const comments = await fetchResumeComments(resumeId);
      setResumes((prev) =>
        prev.map((r) =>
          r.id === resumeId
            ? {
                ...r,
                comments: comments.map((c) => ({
                  id: c.id,
                  author: c.author,
                  avatar: c.avatar,
                  text: c.text,
                  upvotes: c.upvotes,
                  downvotes: c.downvotes,
                  createdAt: c.createdAt,
                  replies:
                    c.replies?.map((reply) => ({
                      id: reply.id,
                      author: reply.author,
                      avatar: reply.avatar,
                      text: reply.text,
                      upvotes: reply.upvotes,
                      downvotes: reply.downvotes,
                      createdAt: reply.createdAt,
                    })) || [],
                })),
              }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to load comments:", err);
      throw new Error("Failed to load comments");
    }
  };

  const addComment = async (id: string, text: string) => {
    try {
      const newComment = await apiAddComment(id, text);
      setResumes((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                comments: [
                  ...r.comments,
                  {
                    id: newComment.id,
                    author: newComment.author,
                    avatar: newComment.avatar,
                    text: newComment.text,
                    upvotes: newComment.upvotes,
                    downvotes: newComment.downvotes,
                    createdAt: newComment.createdAt,
                    replies: [],
                  },
                ],
              }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
      throw new Error("Failed to add comment");
    }
  };

  const updateComment = async (commentId: string, text: string) => {
    try {
      const updatedComment = await apiUpdateComment(commentId, text);
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          comments: r.comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  text: updatedComment.text,
                }
              : {
                  ...c,
                  replies:
                    c.replies?.map((reply) =>
                      reply.id === commentId
                        ? { ...reply, text: updatedComment.text }
                        : reply
                    ) || [],
                }
          ),
        }))
      );
    } catch (err) {
      console.error("Failed to update comment:", err);
      throw new Error("Failed to update comment");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await apiDeleteComment(commentId);
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          comments: r.comments
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies:
                c.replies?.filter((reply) => reply.id !== commentId) || [],
            })),
        }))
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
      throw new Error("Failed to delete comment");
    }
  };

  const voteOnComment = async (
    commentId: string,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      const result = await apiVoteOnComment(commentId, voteType);
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          comments: r.comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  upvotes: result.upvotes,
                  downvotes: result.downvotes,
                }
              : {
                  ...c,
                  replies:
                    c.replies?.map((reply) =>
                      reply.id === commentId
                        ? {
                            ...reply,
                            upvotes: result.upvotes,
                            downvotes: result.downvotes,
                          }
                        : reply
                    ) || [],
                }
          ),
        }))
      );
    } catch (err) {
      console.error("Failed to vote on comment:", err);
      throw new Error("Failed to vote on comment");
    }
  };

  const addReply = async (commentId: string, text: string) => {
    try {
      const newReply = await apiAddReply(commentId, text);
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          comments: r.comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  replies: [
                    ...(c.replies || []),
                    {
                      id: newReply.id,
                      author: newReply.author,
                      avatar: newReply.avatar,
                      text: newReply.text,
                      upvotes: newReply.upvotes,
                      downvotes: newReply.downvotes,
                      createdAt: newReply.createdAt,
                    },
                  ],
                }
              : c
          ),
        }))
      );
    } catch (err) {
      console.error("Failed to add reply:", err);
      throw new Error("Failed to add reply");
    }
  };

  return {
    loadComments,
    addComment,
    updateComment,
    deleteComment,
    voteOnComment,
    addReply,
  };
}
