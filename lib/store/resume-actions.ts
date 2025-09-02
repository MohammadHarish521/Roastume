import {
  deleteResume as apiDeleteResume,
  fetchMyResumes as apiFetchMyResumes,
  updateResume as apiUpdateResume,
  createResume,
  fetchResumes,
  likeResume,
  fetchResume as apiFetchResume,
} from "../api";
import { transformApiResume } from "./transforms";
import type { Resume } from "./types";

export function createResumeActions(
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setTotalResumes: React.Dispatch<React.SetStateAction<number>>
) {
  const refreshResumes = async (
    page: number = 1,
    pageSize: number = 9,
    searchQuery?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const { resumes: apiResumes, total } = await fetchResumes(
        page,
        pageSize,
        searchQuery
      );
      const transformedResumes = apiResumes.map(transformApiResume);
      setResumes(transformedResumes);
      if (typeof total === "number") {
        setTotalResumes(total);
      }
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setError("Failed to load resumes");
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const addResume = async (
    input: Omit<Resume, "id" | "likes" | "comments" | "createdAt" | "ownerId">
  ): Promise<Resume> => {
    try {
      const apiResume = await createResume({
        name: input.name,
        blurb: input.blurb,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
      });
      const newResume = transformApiResume(apiResume);
      setResumes((prev) => [newResume, ...prev]);
      setTotalResumes((prev) => prev + 1);
      return newResume;
    } catch (err) {
      console.error("Failed to create resume:", err);
      throw new Error("Failed to create resume");
    }
  };

  const updateResume = async (
    id: string,
    input: Omit<Resume, "id" | "likes" | "comments" | "createdAt" | "ownerId">
  ): Promise<Resume> => {
    try {
      const apiResume = await apiUpdateResume(id, {
        name: input.name,
        blurb: input.blurb,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
      });
      const updatedResume = transformApiResume(apiResume);
      setResumes((prev) => prev.map((r) => (r.id === id ? updatedResume : r)));
      return updatedResume;
    } catch (err) {
      console.error("Failed to update resume:", err);
      throw new Error("Failed to update resume");
    }
  };

  const deleteResume = async (id: string) => {
    try {
      await apiDeleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      setTotalResumes((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to delete resume:", err);
      throw new Error("Failed to delete resume");
    }
  };

  const like = async (id: string): Promise<boolean> => {
    try {
      const result = await likeResume(id);
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: result.likesCount } : r))
      );
      return result.liked;
    } catch (err) {
      console.error("Failed to like resume:", err);
      throw err as any;
    }
  };

  const fetchResumeById = async (id: string): Promise<Resume | null> => {
    try {
      setLoading(true);
      setError(null);
      const apiResume = await apiFetchResume(id);
      const transformed = transformApiResume(apiResume);
      setResumes((prev) => {
        const exists = prev.some((r) => r.id === id);
        if (exists) {
          return prev.map((r) => (r.id === id ? transformed : r));
        }
        return [transformed, ...prev];
      });
      return transformed;
    } catch (err: any) {
      // If 404, return null but don't throw to allow page to render not found
      if (err && typeof err === "object" && (err as any).status === 404) {
        setError(null);
        return null;
      }
      console.error("Failed to fetch resume by id:", err);
      setError("Failed to load resume");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyResumes = async (): Promise<Resume[]> => {
    try {
      const apiResumes = await apiFetchMyResumes();
      const transformedResumes = apiResumes.map(transformApiResume);
      return transformedResumes;
    } catch (err) {
      console.error("Failed to fetch user resumes:", err);
      throw new Error("Failed to fetch user resumes");
    }
  };

  return {
    refreshResumes,
    addResume,
    updateResume,
    deleteResume,
    like,
    fetchResumeById,
    fetchMyResumes,
  };
}
