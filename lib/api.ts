// API client functions for Roastume backend

export interface ApiResume {
  id: string;
  name: string;
  blurb: string | null;
  likes: number;
  comments: ApiComment[];
  commentsCount?: number;
  fileUrl: string | null;
  fileType: "image" | "pdf" | null;
  ownerId: string;
  createdAt: number;
  avatar: string;
}

export interface ApiComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  upvotes: number;
  downvotes: number;
  createdAt: number;
  replies?: ApiComment[];
}

export interface ApiProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type NotificationType = "like" | "comment" | "reply";

export interface ApiNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  resume_id: string | null;
  actor_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Resume API functions
export async function fetchResumes(
  page: number = 1,
  pageSize: number = 15,
  query?: string
): Promise<{ resumes: ApiResume[]; total: number }> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (query && query.trim()) params.set("q", query.trim());
  const response = await fetch(`/api/resumes?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch resumes");
  }
  const data = await response.json();
  return { resumes: data.resumes, total: data.total ?? data.resumes.length };
}

export async function fetchHotResumes(
  limit: number = 3
): Promise<{ resumes: ApiResume[] }> {
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(`/api/resumes/hot?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch hot resumes");
  }
  const data = await response.json();
  return { resumes: (data.resumes ?? []) as ApiResume[] };
}

export async function fetchResume(id: string): Promise<ApiResume> {
  const response = await fetch(`/api/resumes/${id}`);
  if (!response.ok) {
    let message = "Failed to fetch resume";
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {}
    const error: any = new Error(message);
    (error as any).status = response.status;
    throw error;
  }
  const data = await response.json();
  return data.resume;
}

export async function fetchResumeComments(
  resumeId: string
): Promise<ApiComment[]> {
  const response = await fetch(`/api/resumes/${resumeId}/comments`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  const data = await response.json();
  return data.comments;
}

export async function createResume(resume: {
  name: string;
  blurb?: string;
  fileUrl?: string;
  fileType?: "image" | "pdf";
}): Promise<ApiResume> {
  const response = await fetch("/api/resumes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resume),
  });

  if (!response.ok) {
    throw new Error("Failed to create resume");
  }

  const data = await response.json();
  return data.resume;
}

export async function likeResume(
  id: string
): Promise<{ liked: boolean; likesCount: number }> {
  const response = await fetch(`/api/resumes/${id}/like`, {
    method: "POST",
  });

  if (!response.ok) {
    let message = "Failed to like resume";
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {}
    const error: any = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}

export async function fetchNotifications(): Promise<ApiNotification[]> {
  const response = await fetch("/api/notifications");
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }
  const data = await response.json();
  return data.notifications as ApiNotification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  const response = await fetch(`/api/notifications/${id}`, { method: "PUT" });
  if (!response.ok) {
    throw new Error("Failed to update notification");
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const response = await fetch(`/api/notifications/mark-all-read`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to mark all notifications read");
  }
}

export async function addComment(
  resumeId: string,
  text: string
): Promise<ApiComment> {
  const response = await fetch(`/api/resumes/${resumeId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let message = "Failed to add comment";
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {}
    const error: any = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.comment;
}

export async function updateResume(
  id: string,
  resume: {
    name: string;
    blurb?: string;
    fileUrl?: string;
    fileType?: "image" | "pdf";
  }
): Promise<ApiResume> {
  const response = await fetch(`/api/resumes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resume),
  });

  if (!response.ok) {
    throw new Error("Failed to update resume");
  }

  const data = await response.json();
  return data.resume;
}

export async function deleteResume(id: string): Promise<void> {
  const response = await fetch(`/api/resumes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete resume");
  }
}

export async function fetchMyResumes(): Promise<ApiResume[]> {
  const response = await fetch("/api/resumes/my");
  if (!response.ok) {
    throw new Error("Failed to fetch user resumes");
  }
  const data = await response.json();
  return data.resumes;
}

// Comment management functions
export async function updateComment(
  id: string,
  text: string
): Promise<ApiComment> {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let message = "Failed to update comment";
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {}
    const error: any = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.comment;
}

export async function deleteComment(id: string): Promise<void> {
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = "Failed to delete comment";
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {}
    const error: any = new Error(message);
    (error as any).status = response.status;
    throw error;
  }
}

export async function voteOnComment(
  id: string,
  voteType: "upvote" | "downvote"
): Promise<{
  voted: boolean;
  voteType: "upvote" | "downvote" | null;
  upvotes: number;
  downvotes: number;
}> {
  const response = await fetch(`/api/comments/${id}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ voteType }),
  });

  if (!response.ok) {
    let message = "Failed to vote on comment";
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {}
    const error: any = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}

export async function addReply(
  commentId: string,
  text: string
): Promise<ApiComment> {
  const response = await fetch(`/api/comments/${commentId}/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let message = "Failed to add reply";
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {}
    const error: any = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.reply;
}

export async function fetchReplies(commentId: string): Promise<ApiComment[]> {
  const response = await fetch(`/api/comments/${commentId}/replies`);
  if (!response.ok) {
    throw new Error("Failed to fetch replies");
  }
  const data = await response.json();
  return data.replies;
}

// File upload function
export async function uploadFile(file: File): Promise<{
  fileUrl: string;
  fileType: "image" | "pdf";
  fileName: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload file");
  }

  return response.json();
}

// Profile API functions
export async function fetchProfile(): Promise<ApiProfile> {
  const response = await fetch("/api/profiles");
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  const data = await response.json();
  return data.profile;
}

export async function updateProfile(profile: {
  name?: string;
  avatar_url?: string;
}): Promise<ApiProfile> {
  const response = await fetch("/api/profiles", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const data = await response.json();
  return data.profile;
}
