"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SignInModal } from "./signin-modal";

interface AuthModalContextType {
  showSignInModal: () => void;
  hideSignInModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const showSignInModal = () => setIsSignInModalOpen(true);
  const hideSignInModal = () => setIsSignInModalOpen(false);

  return (
    <AuthModalContext.Provider value={{ showSignInModal, hideSignInModal }}>
      {children}
      <SignInModal isOpen={isSignInModalOpen} onClose={hideSignInModal} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}
