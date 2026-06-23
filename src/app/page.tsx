"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import LandingPage from "@/components/smart-parking/LandingPage";
import LoginPage from "@/components/smart-parking/LoginPage";
import DashboardPage from "@/components/smart-parking/DashboardPage";
import ProfilePage from "@/components/smart-parking/ProfilePage";
import AppHeader from "@/components/smart-parking/AppHeader";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function Home() {
  const { view, isLoading, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </motion.div>
          <p className="text-sm text-muted-foreground">Loading Smart Parking...</p>
        </motion.div>
      </div>
    );
  }

  const isAuthView = isAuthenticated && (view === "dashboard" || view === "profile");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnimatePresence mode="wait">
        {isAuthView && <AppHeader key="header" />}
      </AnimatePresence>

      {isAuthView ? (
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <AnimatePresence mode="wait">
            {view === "dashboard" && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <DashboardPage />
              </motion.div>
            )}
            {view === "profile" && (
              <motion.div
                key="profile"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ProfilePage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      ) : (
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div
              key="landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1"
            >
              <LandingPage />
            </motion.div>
          )}
          {view === "login" && (
            <motion.div
              key="login"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1"
            >
              <LoginPage />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Sticky footer for auth views */}
      {isAuthView && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t px-4 py-4 mt-auto"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Smart Parking</span>
            <span>IoT-Integrated Parking Management</span>
          </div>
        </motion.footer>
      )}
    </div>
  );
}