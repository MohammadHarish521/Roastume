"use client";

import { uploadFile } from "@/lib/api";
import { body, display } from "@/lib/fonts";
import { useRoastume, type Resume } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { ComicCard } from "./comic-card";

interface EditResumeModalProps {
  resume: Resume;
  isOpen: boolean;
  onClose: () => void;
}

export function EditResumeModal({
  resume,
  isOpen,
  onClose,
}: EditResumeModalProps) {
  const { updateResume } = useRoastume();
  const [formData, setFormData] = useState({
    name: resume.name,
    blurb: resume.blurb,
    fileUrl: resume.fileUrl,
    fileType: resume.fileType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload an image (JPEG, PNG, GIF) or PDF file.");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        fileUrl: result.fileUrl,
        fileType: result.fileType,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a resume name.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateResume(resume.id, {
        name: formData.name.trim(),
        blurb: formData.blurb.trim(),
        fileUrl: formData.fileUrl,
        fileType: formData.fileType,
        avatar: resume.avatar,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update resume:", error);
      alert("Failed to update resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <ComicCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2
            className={cn(
              display.className,
              "text-3xl font-normal tracking-wide text-[#2c2c2c]"
            )}
            style={{ textShadow: "1px 1px 0 rgba(44, 44, 44, 0.2)" }}
          >
            Edit Resume
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full border-[3px] border-[#2c2c2c] bg-red-400 hover:bg-red-500 shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all"
          >
            <FaTimes className="h-4 w-4 text-[#2c2c2c]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={cn(
                display.className,
                "block text-lg font-bold text-[#2c2c2c] mb-2"
              )}
            >
              Resume Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={cn(
                body.className,
                "w-full p-3 border-[3px] border-[#2c2c2c] rounded-lg shadow-[3px_3px_0_#2c2c2c] focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              )}
              placeholder="Enter resume name..."
              required
            />
          </div>

          <div>
            <label
              className={cn(
                display.className,
                "block text-lg font-bold text-[#2c2c2c] mb-2"
              )}
            >
              Description
            </label>
            <textarea
              value={formData.blurb}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, blurb: e.target.value }))
              }
              className={cn(
                body.className,
                "w-full p-3 border-[3px] border-[#2c2c2c] rounded-lg shadow-[3px_3px_0_#2c2c2c] focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg resize-none"
              )}
              placeholder="Tell us about this resume..."
              rows={3}
            />
          </div>

          <div>
            <label
              className={cn(
                display.className,
                "block text-lg font-bold text-[#2c2c2c] mb-2"
              )}
            >
              Resume File
            </label>
            <div className="space-y-3">
              {formData.fileUrl && (
                <div className="p-3 bg-green-100 border-[3px] border-green-400 rounded-lg">
                  <p className={cn(body.className, "text-sm text-green-800")}>
                    File uploaded:{" "}
                    {formData.fileType === "pdf" ? "PDF" : "Image"}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={cn(
                  display.className,
                  "w-full flex items-center justify-center gap-3 p-4 border-[3px] border-[#2c2c2c] rounded-lg bg-blue-400 hover:bg-blue-500 shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <FaUpload className="h-5 w-5" />
                {isUploading ? "Uploading..." : "Upload New File"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p
                className={cn(
                  body.className,
                  "text-sm text-[#2c2c2c]/70 text-center"
                )}
              >
                Supported: Images (JPEG, PNG, GIF) and PDF files up to 10MB
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                display.className,
                "flex-1 p-3 border-[3px] border-[#2c2c2c] rounded-lg bg-gray-400 hover:bg-gray-500 shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c] text-lg"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={cn(
                display.className,
                "flex-1 p-3 border-[3px] border-[#2c2c2c] rounded-lg bg-green-400 hover:bg-green-500 shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-1 transition-all text-[#2c2c2c] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Updating..." : "Update Resume"}
            </button>
          </div>
        </form>
      </ComicCard>
    </div>
  );
}
