"use client";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Bangers, Kalam } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlineUpload,
  AiOutlineUser,
} from "react-icons/ai";
import AuthButton from "./auth-button";

const display = Bangers({ subsets: ["latin"], weight: "400" });
const body = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="border-b-4 border-[#2c2c2c] bg-[#97D4D5] shadow-[0_4px_0_#2c2c2c] sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#97D4D5]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo (always visible) */}
          <Link
            href="/"
            className={cn(
              display.className,
              "text-2xl sm:text-3xl tracking-wide leading-none text-[#F2D5A3] hover:-translate-y-0.5 transition-transform"
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

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/"
              className={cn(
                body.className,
                "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#EFD7B7] px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <AiOutlineHome className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/upload"
              className={cn(
                body.className,
                "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#F8E4C6] px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <AiOutlineUpload className="h-4 w-4" />
              Upload
            </Link>
            <Link
              href="/profile"
              className={cn(
                body.className,
                "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#F2D5A3] px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <AiOutlineUser className="h-4 w-4" />
              Profile
            </Link>
            <AuthButton />
          </div>

          {/* Mobile Menu Button - Visible on mobile */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                body.className,
                "flex items-center justify-center w-10 h-10 rounded-full border-[2px] border-[#2c2c2c] bg-[#F2D5A3] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <AiOutlineClose className="h-5 w-5" />
              ) : (
                <AiOutlineMenu className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#97D4D5] border-[3px] border-[#2c2c2c] rounded-2xl shadow-[4px_4px_0_#2c2c2c] overflow-hidden">
                <div className="py-2">
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      body.className,
                      "flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#2c2c2c] hover:bg-[#EFD7B7] transition-colors border-b border-[#2c2c2c]/20"
                    )}
                  >
                    <AiOutlineHome className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    href="/upload"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      body.className,
                      "flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#2c2c2c] hover:bg-[#F8E4C6] transition-colors border-b border-[#2c2c2c]/20"
                    )}
                  >
                    <AiOutlineUpload className="h-4 w-4" />
                    Upload Resume
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      body.className,
                      "flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#2c2c2c] hover:bg-[#F2D5A3] transition-colors border-b border-[#2c2c2c]/20"
                    )}
                  >
                    <AiOutlineUser className="h-4 w-4" />
                    My Profile
                  </Link>
                  <div className="px-4 py-3">
                    <AuthButton />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Close menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          style={{ zIndex: -1 }}
        />
      )}
    </nav>
  );
}
