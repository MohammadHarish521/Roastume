export type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  upvotes: number;
  downvotes: number;
  createdAt: number;
  replies?: Comment[];
};

export type Resume = {
  id: string;
  name: string;
  avatar: string;
  blurb: string;
  likes: number;
  comments: Comment[];
  commentsCount?: number;
  fileUrl?: string;
  fileType?: "image" | "pdf";
  ownerId?: string;
  createdAt: number;
};

export type Store = {
  currentUser: { id: string; name: string; avatar: string };
  resumes: Resume[];
  loading: boolean;
  error: string | null;
  addResume: (
    input: Omit<Resume, "id" | "likes" | "comments" | "createdAt" | "ownerId">
  ) => Promise<Resume>;
  updateResume: (
    id: string,
    input: Omit<Resume, "id" | "likes" | "comments" | "createdAt" | "ownerId">
  ) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  like: (id: string) => Promise<boolean>;
  addComment: (id: string, text: string) => Promise<void>;
  updateComment: (commentId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  voteOnComment: (
    commentId: string,
    voteType: "upvote" | "downvote"
  ) => Promise<void>;
  addReply: (commentId: string, text: string) => Promise<void>;
  loadComments: (resumeId: string) => Promise<void>;
  find: (id: string) => Resume | undefined;
  byOwner: (ownerId: string) => Resume[];
  refreshResumes: (
    page?: number,
    pageSize?: number,
    searchQuery?: string
  ) => Promise<void>;
  fetchMyResumes: () => Promise<Resume[]>;
};
