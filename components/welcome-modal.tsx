"use client";

import { body, display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAuthModal } from "./auth-modal-provider";

export function WelcomeModal() {
  const { data: session } = useSession();
  const { showSignInModal } = useAuthModal();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show welcome modal for non-authenticated users on first visit
    if (!session) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (!hasSeenWelcome) {
        setIsOpen(true);
        localStorage.setItem("hasSeenWelcome", "true");
      }
    }
  }, [session]);

  const handleSignInClick = () => {
    setIsOpen(false);
    showSignInModal();
  };

  if (!isOpen || session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#97D4D5] border-[4px] border-[#2c2c2c] shadow-[8px_8px_0_#2c2c2c] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#2c2c2c]/20">
          <h1
            className={cn(
              display.className,
              "text-4xl tracking-wide text-[#F2D5A3]"
            )}
            style={{
              textShadow: [
                "4px 4px 0 #2a7e84",
                "3px 3px 0 #2a7e84",
                "2px 2px 0 #2a7e84",
                "-1px -1px 0 #2c2c2c",
                "1px -1px 0 #2c2c2c",
                "-1px 1px 0 #2c2c2c",
                "1px 1px 0 #2c2c2c",
              ].join(", "),
            }}
          >
            ROASTUME
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full border-[2px] border-[#2c2c2c] bg-green-400 hover:bg-green-500 text-[#2c2c2c] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p
              className={cn(
                display.className,
                "text-2xl tracking-wider text-[#F2D5A3] mb-4"
              )}
              style={{
                textShadow: [
                  "3px 3px 0 #2a7e84",
                  "2px 2px 0 #2a7e84",
                  "-1px -1px 0 #2c2c2c",
                  "1px -1px 0 #2c2c2c",
                  "-1px 1px 0 #2c2c2c",
                  "1px 1px 0 #2c2c2c",
                ].join(", "),
              }}
            >
              WELCOME TO THE ROAST!
            </p>
            <p className={cn(body.className, "text-lg text-[#2c2c2c] mb-6")}>
              Get your resume roasted (constructively!) by our amazing
              community. Ready to level up your career game?
            </p>
          </div>

          {/* Info cards */}
          <div className="grid gap-4 mb-6">
            <div className="border-[3px] border-[#2c2c2c] bg-[#F2D5A3] shadow-[3px_3px_0_#2c2c2c] rounded-lg p-4">
              <h3
                className={cn(
                  display.className,
                  "font-bold text-[#2c2c2c] mb-2"
                )}
              >
                What is Roastume?
              </h3>
              <p className={cn(body.className, "text-sm text-[#2c2c2c]/80")}>
                A playful platform where you can get constructive feedback on
                your resume in a fun, comic-book style environment.
              </p>
            </div>

            <div className="border-[3px] border-[#2c2c2c] bg-[#F8E4C6] shadow-[3px_3px_0_#2c2c2c] rounded-lg p-4">
              <h3
                className={cn(
                  display.className,
                  "font-bold text-[#2c2c2c] mb-2"
                )}
              >
                How it works
              </h3>
              <p className={cn(body.className, "text-sm text-[#2c2c2c]/80")}>
                Upload your resume, get roasted (constructively!), and help
                others by giving feedback on their resumes too.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignInClick}
              className={cn(
                display.className,
                "w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 border-[3px] border-[#2c2c2c] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform text-lg rounded-full"
              )}
            >
              Get Started - Sign In
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                display.className,
                "w-full bg-[#EBDDBF] hover:bg-[#EBDDBF]/80 text-[#2c2c2c] font-bold py-2 px-4 border-[2px] border-[#2c2c2c] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform rounded-full"
              )}
            >
              Browse Resumes First
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center mt-4">
            <p className={cn(display.className, "text-xs text-[#2c2c2c]/60")}>
              By signing in, you agree to keep feedback constructive and fun.
              Let&apos;s build each other up! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
