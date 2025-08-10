import type { ApiResume } from "../api";
import type { Resume } from "./types";

// Transform API resume to local resume format
export function transformApiResume(apiResume: ApiResume): Resume {
  return {
    id: apiResume.id,
    name: apiResume.name,
    avatar: apiResume.avatar,
    blurb: apiResume.blurb || "",
    likes: apiResume.likes,
    comments: apiResume.comments.map((c) => ({
      id: c.id,
      author: c.author,
      avatar: c.avatar,
      text: c.text,
      upvotes: c.upvotes,
      downvotes: c.downvotes,
      createdAt: c.createdAt,
      replies:
        c.replies?.map((r) => ({
          id: r.id,
          author: r.author,
          avatar: r.avatar,
          text: r.text,
          upvotes: r.upvotes,
          downvotes: r.downvotes,
          createdAt: r.createdAt,
        })) || [],
    })),
    fileUrl: apiResume.fileUrl || undefined,
    fileType: apiResume.fileType || undefined,
    ownerId: apiResume.ownerId,
    createdAt: apiResume.createdAt,
  };
}
