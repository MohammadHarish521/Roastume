"use client";

import Link from "next/link";
import AuthButton from "./auth-button";

export default function Navbar() {
  return (
    <nav className="border-b-[3px] border-[#2c2c2c] bg-[#EBDDBF] shadow-[0_3px_0_#2c2c2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-[#2c2c2c] hover:-translate-y-0.5 transition-transform"
          >
            ROASTUME
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-[#2c2c2c] hover:text-red-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/profile"
              className="text-[#2c2c2c] hover:text-red-600 font-medium transition-colors"
            >
              Profile
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
