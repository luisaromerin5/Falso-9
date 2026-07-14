"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import WelcomeScreen from "./WelcomeScreen";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    // If user is logged in, skip welcome
    if (user) {
      setShowWelcome(false);
      setChecked(true);
      return;
    }

    // Check if user already skipped before (session storage)
    const skipped = sessionStorage.getItem("falso9_skipped");
    if (skipped) {
      setShowWelcome(false);
    }
    setChecked(true);
  }, [user, loading]);

  // Still checking auth
  if (!checked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Show welcome screen
  if (showWelcome && !user) {
    return (
      <WelcomeScreen
        onSkip={() => {
          sessionStorage.setItem("falso9_skipped", "true");
          setShowWelcome(false);
        }}
      />
    );
  }

  // Main app
  return (
    <>
      <main className="max-w-lg mx-auto pb-20 px-4">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
