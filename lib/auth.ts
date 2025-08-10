import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Derive a stable provider user id for NextAuth without an adapter
      const providerUserId =
        (account as any)?.providerAccountId || (profile as any)?.sub || user.id;

      if (account?.provider === "google" && providerUserId) {
        try {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", providerUserId)
            .single();

          if (!existingProfile) {
            await supabase.from("profiles").insert({
              id: providerUserId,
              email: user.email || "",
              name: user.name || null,
              avatar_url: user.image || null,
            });
          }
        } catch (error) {
          console.error("Error creating profile:", error);
          // Don't block sign-in if profile creation fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        const providerUserId =
          (account as any)?.providerAccountId ||
          (profile as any)?.sub ||
          user.id ||
          token.sub;
        if (providerUserId) token.sub = providerUserId as string;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};
