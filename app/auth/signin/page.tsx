"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProviders, signIn } from "next-auth/react";
import { Bangers, Kalam } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

const display = Bangers({ subsets: ["latin"], weight: "400" });
const body = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });

export default function SignIn() {
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

  return (
    <div className="min-h-screen w-full bg-[#97D4D5] text-[#1f1f1f]">
      {/* Header matching the main app */}
      <header className="border-b-4 border-[#2c2c2c] bg-[#97D4D5]/90 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#97D4D5]/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={cn(
                display.className,
                "text-4xl tracking-wide leading-none text-[#F2D5A3]"
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
            </Link>

            <Link
              href="/"
              className={cn(
                body.className,
                "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F2D5A3] px-4 py-2 text-lg font-bold shadow-[3px_3px_0_#2c2c2c] transition-transform hover:-translate-y-0.5"
              )}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={cn(body.className, "mx-auto max-w-2xl px-4 py-12")}>
        <div className="text-center mb-8">
          <h1
            className={cn(
              display.className,
              "text-6xl tracking-wide leading-none text-[#F2D5A3] mb-4"
            )}
            style={{
              textShadow: [
                "6px 6px 0 #2a7e84",
                "5px 5px 0 #2a7e84",
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
            WELCOME!
          </h1>
          <p
            className={cn(
              display.className,
              "text-2xl tracking-wider text-[#F2D5A3] mb-6"
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
            READY TO GET ROASTED?
          </p>
        </div>

        {/* Sign-in card */}
        <div className="border-[4px] border-[#2c2c2c] bg-[#EBDDBF] shadow-[6px_6px_0_#2c2c2c] rounded-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#2c2c2c] mb-3">
              Sign in to share your resume and get feedback from the community
            </h2>
            <p className="text-lg text-[#2c2c2c]/80">
              Join the fun and help others improve their resumes too!
            </p>
          </div>

          <div className="space-y-4">
            {providers &&
              Object.values(providers).map((provider: any) => (
                <Button
                  key={provider.name}
                  onClick={() => handleSignIn(provider.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 border-[3px] border-[#2c2c2c] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform text-xl rounded-full"
                >
                  Sign in with {provider.name}
                </Button>
              ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-[3px] border-[#2c2c2c] bg-[#F2D5A3] shadow-[3px_3px_0_#2c2c2c] rounded-lg p-4">
            <h3 className="font-bold text-[#2c2c2c] mb-2">
              💡 What is Roastume?
            </h3>
            <p className="text-sm text-[#2c2c2c]/80">
              A playful platform where you can get constructive feedback on your
              resume in a fun, comic-book style environment.
            </p>
          </div>

          <div className="border-[3px] border-[#2c2c2c] bg-[#F8E4C6] shadow-[3px_3px_0_#2c2c2c] rounded-lg p-4">
            <h3 className="font-bold text-[#2c2c2c] mb-2">🎯 How it works</h3>
            <p className="text-sm text-[#2c2c2c]/80">
              Upload your resume, get roasted (constructively!), and help others
              by giving feedback on their resumes too.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-8">
          <p className="text-sm text-[#2c2c2c]/60">
            By signing in, you agree to keep feedback constructive and fun.
            Let&apos;s build each other up! 🚀
          </p>
        </div>
      </main>
    </div>
  );
}
