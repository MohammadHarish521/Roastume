"use client";

import { useSession } from "next-auth/react";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { uid } from "./id";

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: number;
};

export type Resume = {
  id: string;
  name: string;
  avatar: string;
  blurb: string;
  likes: number;
  comments: Comment[];
  fileUrl?: string;
  fileType?: "image" | "pdf";
  ownerId?: string;
  createdAt: number;
};

type Store = {
  currentUser: { id: string; name: string; avatar: string };
  resumes: Resume[];
  addResume: (
    input: Omit<Resume, "id" | "likes" | "comments" | "createdAt" | "ownerId">
  ) => Resume;
  like: (id: string) => void;
  addComment: (id: string, text: string) => void;
  find: (id: string) => Resume | undefined;
  byOwner: (ownerId: string) => Resume[];
};

const StoreCtx = createContext<Store | null>(null);
const KEY = "roastume_state_v1";

function seed(): Resume[] {
  const now = Date.now();
  return [
    {
      id: uid("r"),
      name: "TARIQ",
      avatar: "/cartoon-avatar-male.png",
      blurb:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...",
      likes: 9,
      comments: [],
      fileUrl: "/resume-mock-page.png",
      fileType: "image",
      createdAt: now - 1000 * 60 * 60,
      ownerId: "seed",
    },
    {
      id: uid("r"),
      name: "ROHAN",
      avatar: "/cartoon-avatar-man-glasses.png",
      blurb:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do elusmod.",
      likes: 10,
      comments: [],
      fileUrl: "/resume-mock-page.png",
      fileType: "image",
      createdAt: now - 1000 * 60 * 30,
      ownerId: "seed",
    },
    {
      id: uid("r"),
      name: "CATHERINE",
      avatar: "/cartoon-avatar-woman.png",
      blurb:
        "Lorem ipsum dolor sit met, consectetur adipiscing elit, sed do elusmod.",
      likes: 3,
      comments: [],
      fileUrl: "/resume-mock-page.png",
      fileType: "image",
      createdAt: now - 1000 * 60 * 10,
      ownerId: "seed",
    },
  ];
}

export function RoastumeProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const { data: session } = useSession();

  const currentUser = useMemo(
    () => ({
      id: session?.user?.id || "anonymous",
      name: session?.user?.name || "Anonymous",
      avatar: session?.user?.image || "/cartoon-avatar-user.png",
    }),
    [session]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Resume[];
        setResumes(parsed);
      } else {
        const seeded = seed();
        setResumes(seeded);
        localStorage.setItem(KEY, JSON.stringify(seeded));
      }
    } catch {
      setResumes(seed());
    }
  }, []);

  useEffect(() => {
    try {
      if (resumes.length) {
        localStorage.setItem(KEY, JSON.stringify(resumes));
      }
    } catch {}
  }, [resumes]);

  const addResume: Store["addResume"] = (input) => {
    const r: Resume = {
      id: uid("r"),
      name: input.name.toUpperCase(),
      avatar: input.avatar || "/cartoon-avatar.png",
      blurb: input.blurb || "",
      likes: 0,
      comments: [],
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      createdAt: Date.now(),
      ownerId: currentUser.id,
    };
    setResumes((prev) => [r, ...prev]);
    return r;
  };

  const like = (id: string) => {
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const addComment = (id: string, text: string) => {
    setResumes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              comments: [
                ...r.comments,
                {
                  id: uid("c"),
                  author: currentUser.name,
                  avatar: currentUser.avatar,
                  text,
                  createdAt: Date.now(),
                },
              ],
            }
          : r
      )
    );
  };

  const find = (id: string) => resumes.find((r) => r.id === id);
  const byOwner = (ownerId: string) =>
    resumes.filter((r) => r.ownerId === ownerId);

  const value: Store = {
    currentUser,
    resumes,
    addResume,
    like,
    addComment,
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
