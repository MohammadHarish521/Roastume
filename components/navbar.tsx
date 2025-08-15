"use client";

import { display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import {
  FaBars,
  FaEllipsisV,
  FaHome,
  FaTimes,
  FaUpload,
  FaUserCircle,
} from "react-icons/fa";
import AuthButton from "./auth-button";
import { NotificationsBell } from "./notifications";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="border-b-4 border-[#2c2c2c] bg-[#97D4D5]/90 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#97D4D5]/80">
      <div className="mx-auto max-w-6xl px-4 py-4">
        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-3 items-center gap-4">
          {/* Left side - Navigation Links */}
          <div className="flex items-center gap-3 justify-start">
            <Link
              href="/"
              className={cn(
                display.className,
                "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EFD7B7] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <FaHome className="h-5 w-5" />
              Home
            </Link>
            <Link
              href="/upload"
              className={cn(
                display.className,
                "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F8E4C6] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <FaUpload className="h-5 w-5" />
              Upload Resume
            </Link>
          </div>

          {/* Center - Brand Logo */}
          <div className="text-center">
            <Link href="/">
              <h1
                className={cn(
                  display.className,
                  "text-[clamp(2.25rem,8vw,4rem)] tracking-wide leading-none text-[#F2D5A3] hover:-translate-y-0.5 transition-transform cursor-pointer"
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
              <p
                className={cn(
                  display.className,
                  "mt-1 text-[clamp(0.8rem,2.5vw,1.5rem)] tracking-wider text-[#F2D5A3]"
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
                ROAST YOUR RESUME
              </p>
            </Link>
          </div>

          {/* Right side - User Actions */}
          <div className="flex items-center gap-3 justify-end">
            <NotificationsBell />
            <Link
              href="/profile"
              className={cn(
                display.className,
                "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F2D5A3] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] transition-transform hover:-translate-y-0.5"
              )}
              aria-label="Profile"
            >
              <FaUserCircle className="h-5 w-5" />
              Profile
            </Link>
            <AuthButton />
          </div>
        </div>

        {/* Mobile Layout - Visible on mobile */}
        <div className="md:hidden flex items-center justify-between">
          {/* Left - Navigation Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNavOpen(!isNavOpen);
                setIsProfileOpen(false);
              }}
              className={cn(
                display.className,
                "flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-[#2c2c2c] bg-[#EFD7B7] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
              aria-label="Navigation menu"
            >
              {isNavOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>

            {/* Navigation Dropdown */}
            {isNavOpen && (
              <div className="absolute left-0 top-14 w-48 bg-[#97D4D5] border-[3px] border-[#2c2c2c] rounded-2xl shadow-[4px_4px_0_#2c2c2c] overflow-hidden z-50">
                <div className="py-2">
                  <Link
                    href="/"
                    onClick={() => setIsNavOpen(false)}
                    className={cn(
                      display.className,
                      "flex items-center gap-3 px-4 py-3 text-base font-bold text-[#2c2c2c] hover:bg-[#EFD7B7] transition-colors border-b border-[#2c2c2c]/20"
                    )}
                  >
                    <FaHome className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    href="/upload"
                    onClick={() => setIsNavOpen(false)}
                    className={cn(
                      display.className,
                      "flex items-center gap-3 px-4 py-3 text-base font-bold text-[#2c2c2c] hover:bg-[#F8E4C6] transition-colors"
                    )}
                  >
                    <FaUpload className="h-4 w-4" />
                    Upload Resume
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Center - Brand Logo */}
          <div className="text-center">
            <Link href="/">
              <h1
                className={cn(
                  display.className,
                  "text-2xl sm:text-3xl tracking-wide leading-none text-[#F2D5A3] hover:-translate-y-0.5 transition-transform cursor-pointer"
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
                ROASTUME
              </h1>
            </Link>
          </div>

          {/* Right - Profile Dropdown */}
          <div className="relative">
            <NotificationsBell />
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNavOpen(false);
              }}
              className={cn(
                display.className,
                "flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-[#2c2c2c] bg-[#F2D5A3] shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
              aria-label="Profile menu"
            >
              {isProfileOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaEllipsisV className="h-5 w-5" />
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-14 w-48 bg-[#97D4D5] border-[3px] border-[#2c2c2c] rounded-2xl shadow-[4px_4px_0_#2c2c2c] overflow-hidden z-50">
                <div className="py-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className={cn(
                      display.className,
                      "flex items-center gap-3 px-4 py-3 text-base font-bold text-[#2c2c2c] hover:bg-[#F2D5A3] transition-colors border-b border-[#2c2c2c]/20"
                    )}
                  >
                    <FaUserCircle className="h-4 w-4" />
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

      {/* Mobile Menu Overlay - Close menus when clicking outside */}
      {(isNavOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden"
          onClick={() => {
            setIsNavOpen(false);
            setIsProfileOpen(false);
          }}
          style={{ zIndex: -1 }}
        />
      )}
    </header>
  );
}
