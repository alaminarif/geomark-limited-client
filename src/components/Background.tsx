"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Background({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden web3-global-bg text-white">
      {/* Cursor Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),rgba(139,92,246,0.15),transparent_40%)]" />

      {/* Floating Blobs */}
      <motion.div
        animate={{ y: [0, -80, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="pointer-events-none fixed -top-40 -left-40 z-0 h-[700px] w-[700px] rounded-full bg-purple-600 opacity-30 blur-[160px]"
      />

      <motion.div
        animate={{ y: [0, 80, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
        className="pointer-events-none fixed bottom-0 right-0 z-0 h-[700px] w-[700px] rounded-full bg-blue-500 opacity-30 blur-[160px]"
      />

      <motion.div
        animate={{ x: [0, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="pointer-events-none fixed top-1/2 left-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 opacity-20 blur-[160px]"
      />

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
