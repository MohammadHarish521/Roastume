import { AuthModalProvider } from "@/components/auth-modal-provider";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { body } from "@/lib/fonts";
import { RoastumeProvider } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import type React from "react";

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
      <AuthModalProvider>
        <div className="min-h-screen w-full bg-[#97D4D5] text-[#1f1f1f]">
          <Navbar />

          <main className={cn(body.className, "mx-auto max-w-6xl px-4 py-6")}>
            {children}
          </main>

          <Footer />
        </div>
      </AuthModalProvider>
    </RoastumeProvider>
  );
}
