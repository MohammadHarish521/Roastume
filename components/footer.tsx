"use client";

import { body, display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AiOutlineHome, AiOutlineUpload, AiOutlineUser } from "react-icons/ai";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-8 border-t-4 border-[#2c2c2c] bg-[#97D4D5]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-2 justify-between items-center">
          {/* Brand section */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className={cn(
                display.className,
                "text-3xl tracking-wide leading-none text-[#F2D5A3] hover:-translate-y-0.5 transition-transform inline-block"
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
            <p className={cn(body.className, "mt-2 text-sm text-[#2c2c2c]/80")}>
              Get your resume roasted in a fun, constructive way!
            </p>
          </div>

          {/* Community section */}
          <div className="text-center md:text-right">
            <h3
              className={cn(display.className, "font-bold text-[#F2D5A3] mb-3")}
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
              Community
            </h3>
            <div className="flex justify-center md:justify-end gap-3 mb-4">
              <button className="p-2 rounded-full comic-border-2 bg-[#EBDDBF] comic-shadow-2 hover:-translate-y-0.5 transition-transform">
                <a
                  href="https://github.com/mdharish72"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow MohammadHarish52 on Github"
                >
                  <FaGithub className="h-4 w-4 text-[#2c2c2c]" />
                </a>
              </button>
              <button className="p-2 rounded-full comic-border-2 bg-[#EBDDBF] comic-shadow-2 hover:-translate-y-0.5 transition-transform">
                <a
                  href="https://x.com/Mdharish76"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Haarish_52 on X"
                >
                  <FaTwitter className="h-4 w-4 text-[#2c2c2c]" />
                </a>
              </button>
            </div>
            <p className={cn(body.className, "text-sm text-[#2c2c2c]/80")}>
              Built for the community
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t-2 border-[#2c2c2c]/20">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p
              className={cn(
                body.className,
                "text-sm text-[#2c2c2c]/70 flex-wrap flex items-center gap-2"
              )}
            >
              © 2025 Roastume. Built for fun. Keep it kind!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
