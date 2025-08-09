"use client";

import { ComicCard } from "@/components/comic-card";
import { Button } from "@/components/ui/button";
import { useRoastume } from "@/lib/store";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadPage() {
  const { data: session } = useSession();
  const { addResume } = useRoastume();
  const router = useRouter();
  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      // For now, we'll use a placeholder image
      // In a real app, you'd handle file upload here
      const resume = addResume({
        name: name.trim(),
        blurb: blurb.trim(),
        avatar: session?.user?.image || "/cartoon-avatar-user.png",
        fileUrl: "/resume-mock-page.png",
        fileType: "image",
      });

      router.push(`/resume/${resume.id}`);
    } catch (error) {
      console.error("Error uploading resume:", error);
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
            <Upload className="h-12 w-12 mx-auto mb-4 text-[#2c2c2c]" />
            <p className="text-lg font-bold mb-2">File Upload Coming Soon!</p>
            <p className="text-sm opacity-80">
              For now, we&apos;ll use a placeholder resume image. File upload
              functionality will be added in a future update.
            </p>
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
          </div>

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
