"use client";

import { useSession } from "next-auth/react";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createCommentActions } from "./comment-actions";
import { createResumeActions } from "./resume-actions";
import type { Resume, Store } from "./types";

const StoreCtx = createContext<Store | null>(null);

export function RoastumeProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [totalResumes, setTotalResumes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const currentUser = useMemo(
    () => ({
      id: session?.user?.id || "anonymous",
      name: session?.user?.name || "Anonymous",
      avatar: session?.user?.image || "/cartoon-avatar-user.png",
    }),
    [session]
  );

  // Create action handlers
  const resumeActions = useMemo(
    () =>
      createResumeActions(setResumes, setLoading, setError, setTotalResumes),
    [setResumes, setLoading, setError, setTotalResumes]
  );
  const commentActions = useMemo(
    () => createCommentActions(setResumes),
    [setResumes]
  );

  // Load resumes on mount
  useEffect(() => {
    resumeActions.refreshResumes(1, 9);
  }, []);

  // Utility functions
  const find = (id: string) => resumes.find((r) => r.id === id);
  const byOwner = (ownerId: string) =>
    resumes.filter((r) => r.ownerId === ownerId);

  const value: Store = {
    currentUser,
    resumes,
    totalResumes,
    loading,
    error,
    ...resumeActions,
    ...commentActions,
    find,
    byOwner,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useRoastume() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useRoastume must be used within RoastumeProvider");
  return ctx;
}

// Re-export types for convenience
export type { Comment, Resume } from "./types";
