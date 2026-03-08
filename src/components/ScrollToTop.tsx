"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop — 滚动超过 400px 后显示的回到顶部按钮
 * 终端风格，带渐入渐出动画
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer group"
          style={{
            borderColor: "var(--card-border)",
            background: "var(--card-bg)",
            color: "var(--muted)",
          }}
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ArrowUp
            size={18}
            className="transition-all group-hover:text-[var(--accent)] group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
