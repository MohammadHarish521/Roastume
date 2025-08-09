import AuthButton from "@/components/auth-button";
import { RoastumeProvider } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Home, Upload, UserCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Bangers, Kalam } from "next/font/google";
import Link from "next/link";
import type React from "react";

const display = Bangers({ subsets: ["latin"], weight: "400" });
const body = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata: Metadata = {
  title: "Roastume - Roast Your Resume",
  description: "Upload your resume and let the internet roast it (playfully).",
};

export default function RoastumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoastumeProvider>
      <div className="min-h-screen w-full bg-[#97D4D5] text-[#1f1f1f]">
        <header className="border-b-4 border-[#2c2c2c] bg-[#97D4D5]/90 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#97D4D5]/80">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 text-center">
                <h1
                  className={cn(
                    display.className,
                    "text-[clamp(2.25rem,10vw,6rem)] tracking-wide leading-none text-[#F2D5A3]"
                  )}
                  style={{
                    // Layered teal extrusion + dark outline to match the reference
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
                  ROASTUME
                </h1>
                <p
                  className={cn(
                    display.className,
                    "mt-2 text-[clamp(1.1rem,3.8vw,2.25rem)] tracking-wider text-[#F2D5A3]"
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
                  ROAST YOUR RESUME
                </p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <Link
                  href="/profile"
                  className={cn(
                    body.className,
                    "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F2D5A3] px-4 py-2 text-lg font-bold shadow-[3px_3px_0_#2c2c2c] transition-transform hover:-translate-y-0.5"
                  )}
                  aria-label="Profile"
                >
                  <UserCircle2 className="h-6 w-6" />
                  Profile
                </Link>
                <AuthButton />
              </div>
            </div>

            <nav className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className={cn(
                  body.className,
                  "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EFD7B7] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
                )}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link
                href="/upload"
                className={cn(
                  body.className,
                  "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F8E4C6] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
                )}
              >
                <Upload className="h-5 w-5" />
                Upload Resume
              </Link>
            </nav>
          </div>
        </header>

        <main className={cn(body.className, "mx-auto max-w-6xl px-4 py-6")}>
          {children}
        </main>

        <footer className="mt-8 border-t-4 border-[#2c2c2c] bg-[#97D4D5]">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm font-semibold">
            Built for fun. Keep it kind.
          </div>
        </footer>
      </div>
    </RoastumeProvider>
  );
}
