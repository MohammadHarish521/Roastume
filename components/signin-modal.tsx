"use client";

import { body, display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    try {
      await signIn(providerId, {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#97D4D5] border-[4px] border-[#2c2c2c] shadow-[8px_8px_0_#2c2c2c] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#2c2c2c]/20">
          <h1
            className={cn(
              display.className,
              "text-3xl tracking-wide text-[#F2D5A3]"
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
            WELCOME!
          </h1>
          <button
            onClick={onClose}
            className="p-2 rounded-full border-[2px] border-[#2c2c2c] bg-red-400 hover:bg-red-500 text-[#2c2c2c] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all"
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
                "text-xl tracking-wider text-[#F2D5A3] mb-4"
              )}
              style={{
                textShadow: [
                  "2px 2px 0 #2a7e84",
                  "-1px -1px 0 #2c2c2c",
                  "1px -1px 0 #2c2c2c",
                  "-1px 1px 0 #2c2c2c",
                  "1px 1px 0 #2c2c2c",
                ].join(", "),
              }}
            >
              READY TO GET ROASTED?
            </p>
          </div>

          {/* Sign-in card */}
          <div className="border-[3px] border-[#2c2c2c] bg-[#EBDDBF] shadow-[4px_4px_0_#2c2c2c] rounded-lg p-6 mb-4">
            <div className="text-center mb-4">
              <h2
                className={cn(
                  display.className,
                  "text-lg font-bold text-[#2c2c2c] mb-2"
                )}
              >
                Sign in to share your resume and get feedback from the community
              </h2>
              <p className={cn(body.className, "text-sm text-[#2c2c2c]/80")}>
                Join the fun and help others improve their resumes too!
              </p>
            </div>

            <div className="space-y-3">
              {providers &&
                Object.values(providers).map((provider: any) => (
                  <button
                    key={provider.name}
                    onClick={() => handleSignIn(provider.id)}
                    className={cn(
                      display.className,
                      "w-full bg-red-400 hover:bg-red-600 text-black font-bold py-3 px-4 border-[3px] border-[#2c2c2c] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform text-lg rounded-full"
                    )}
                  >
                    Sign in with {provider.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Info cards */}
          <div className="grid gap-3 sm:grid-cols-2 mb-4">
            <div className="border-[2px] border-[#2c2c2c] bg-[#F2D5A3] shadow-[2px_2px_0_#2c2c2c] rounded-lg p-3">
              <h3
                className={cn(
                  display.className,
                  "font-bold text-[#2c2c2c] mb-1 text-sm flex"
                )}
              >
                What is Roastume?
              </h3>
              <p className={cn(body.className, "text-xs text-[#2c2c2c]/80")}>
                A playful platform where you can get constructive feedback on
                your resume in a fun, comic-book style environment.
              </p>
            </div>

            <div className="border-[2px] border-[#2c2c2c] bg-[#F8E4C6] shadow-[2px_2px_0_#2c2c2c] rounded-lg p-3">
              <h3
                className={cn(
                  display.className,
                  "font-bold text-[#2c2c2c] mb-1 text-sm flex"
                )}
              >
                How it works
              </h3>
              <p className={cn(body.className, "text-xs text-[#2c2c2c]/80")}>
                Upload your resume, get roasted (constructively!), and help
                others by giving feedback on their resumes too.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center">
            <p className={cn(body.className, "text-xs text-[#2c2c2c]/60")}>
              By signing in, you agree to keep feedback constructive and fun.
              Let&apos;s build each other up! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
