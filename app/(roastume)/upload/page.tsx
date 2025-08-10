"use client";

import { ComicCard } from "@/components/comic-card";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/api";
import { useRoastume } from "@/lib/store";
import { FileText, Image as ImageIcon, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function UploadPage() {
  const { data: session } = useSession();
  const { addResume } = useRoastume();
  const router = useRouter();
  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          "Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed."
        );
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File too large. Maximum size is 5MB.");
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setUploadError(null);

    try {
      let fileUrl: string | undefined;
      let fileType: "image" | "pdf" | undefined;

      // Upload file if selected
      if (selectedFile) {
        const uploadResult = await uploadFile(selectedFile);
        fileUrl = uploadResult.fileUrl;
        fileType = uploadResult.fileType;
      }

      const resume = await addResume({
        name: name.trim(),
        blurb: blurb.trim(),
        avatar: session?.user?.image || "/cartoon-avatar-user.png",
        fileUrl,
        fileType,
      });

      router.push(`/resume/${resume.id}`);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload resume"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="grid gap-6">
        <ComicCard className="p-6 text-center">
          <h2
            className="text-2xl font-extrabold tracking-wide mb-4"
            style={{ textShadow: "1px 1px 0 #2c2c2c" }}
          >
            Sign In Required
          </h2>
          <p className="text-lg mb-4">
            You need to sign in to upload your resume for roasting!
          </p>
          <Button
            onClick={() => router.push("/auth/signin")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold border-[3px] border-[#2c2c2c] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform px-6 py-3"
          >
            Sign In to Upload
          </Button>
        </ComicCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-2xl mx-auto">
      <ComicCard className="p-6">
        <h2
          className="text-3xl font-extrabold tracking-wide mb-2"
          style={{ textShadow: "1px 1px 0 #2c2c2c" }}
        >
          Upload Your Resume
        </h2>
        <p className="text-lg opacity-80 mb-6">
          Ready to get roasted? Upload your resume and let the community give
          you feedback!
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border-[3px] border-[#2c2c2c] rounded-lg shadow-[3px_3px_0_#2c2c2c] bg-[#F2D5A3] focus:outline-none focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="blurb">
              Description (Optional)
            </label>
            <textarea
              id="blurb"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="Tell us about your background, experience, or what kind of feedback you're looking for..."
              rows={4}
              className="w-full p-3 border-[3px] border-[#2c2c2c] rounded-lg shadow-[3px_3px_0_#2c2c2c] bg-[#F2D5A3] focus:outline-none focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="border-[3px] border-dashed border-[#2c2c2c] rounded-lg p-8 text-center bg-[#F8E4C6]">
            {!selectedFile ? (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-[#2c2c2c]" />
                <p className="text-lg font-bold mb-2">Upload Your Resume</p>
                <p className="text-sm opacity-80 mb-4">
                  Choose a PDF or image file (JPEG, PNG, WebP) up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </label>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    PDF Support
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ImageIcon className="h-4 w-4" />
                    Image Support
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  {selectedFile.type.startsWith("image/") ? (
                    <ImageIcon className="h-8 w-8 text-[#2c2c2c]" />
                  ) : (
                    <FileText className="h-8 w-8 text-[#2c2c2c]" />
                  )}
                  <div className="text-left">
                    <p className="font-bold">{selectedFile.name}</p>
                    <p className="text-sm opacity-80">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-auto p-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-red-600" />
                  </button>
                </div>
                <p className="text-sm text-green-600 font-medium">
                  ✓ File ready to upload
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-3 border-[3px] border-red-500 rounded-lg bg-red-50 text-red-700">
              <p className="font-bold">Upload Error:</p>
              <p className="text-sm">{uploadError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold border-[3px] border-[#2c2c2c] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Uploading..." : "Upload Resume for Roasting! 🔥"}
          </Button>
        </form>
      </ComicCard>

      <ComicCard className="p-4 bg-yellow-100">
        <h3 className="font-bold mb-2">💡 Tips for Getting Great Feedback:</h3>
        <ul className="text-sm space-y-1 opacity-80">
          <li>• Be specific about what kind of feedback you want</li>
          <li>• Mention your target industry or role</li>
          <li>• Keep it fun - this is a playful roasting environment!</li>
          <li>• Remember to give constructive feedback to others too</li>
        </ul>
      </ComicCard>
    </div>
  );
}
