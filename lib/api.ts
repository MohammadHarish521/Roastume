// API client functions for Roastume backend

export interface ApiResume {
  id: string;
  name: string;
  blurb: string | null;
  likes: number;
  comments: ApiComment[];
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
  createdAt: number;
}

export interface ApiProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Resume API functions
export async function fetchResumes(): Promise<ApiResume[]> {
  const response = await fetch("/api/resumes");
  if (!response.ok) {
    throw new Error("Failed to fetch resumes");
  }
  const data = await response.json();
  return data.resumes;
}

export async function fetchResume(id: string): Promise<ApiResume> {
  const response = await fetch(`/api/resumes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch resume");
  }
  const data = await response.json();
  return data.resume;
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
    throw new Error("Failed to like resume");
  }

  return response.json();
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
    throw new Error("Failed to add comment");
  }

  const data = await response.json();
  return data.comment;
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
