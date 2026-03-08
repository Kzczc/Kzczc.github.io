"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingScreen — 终端风格的启动动画
 * 仅首次访问时显示（sessionStorage 控制）
 */
const bootLines = [
  { text: "[  OK  ] Initializing Kc. Terminal...", color: "#a6e3a1", delay: 0 },
  { text: "[  OK  ] Loading research modules...", color: "#89b4fa", delay: 400 },
  { text: "[  OK  ] Connecting to HKUST(GZ)...", color: "#cba6f7", delay: 800 },
  { text: "[  OK  ] Brewing matcha latte ☕", color: "#f9e2af", delay: 1100 },
  { text: "[READY ] System online. Welcome, visitor.", color: "#a6e3a1", delay: 1500 },
];

export default function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    /* 仅首次访问时显示 */
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("kc-loaded");
      if (!hasVisited) {
        setShow(true);
        sessionStorage.setItem("kc-loaded", "1");
      }
    }
  }, []);

  /* 逐行显示 boot lines */
  useEffect(() => {
    if (!show) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    bootLines.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });

    /* 全部显示后 700ms 退出 */
    timers.push(
      setTimeout(() => setShow(false), bootLines[bootLines.length - 1].delay + 700)
    );

    return () => timers.forEach(clearTimeout);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "#0a0a0a" }}
        >
          <div className="w-full max-w-lg px-8">
            {/* 彩虹顶部条 */}
            <div className="h-[2px] w-full rainbow-bar mb-6 rounded-full" />

            {/* 终端行 */}
            <div className="font-mono text-[13px] space-y-2">
              {bootLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: line.color }}
                >
                  {line.text}
                </motion.div>
              ))}
              {/* 闪烁光标 */}
              <span className="animate-blink inline-block" style={{ color: "#89b4fa" }}>
                █
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
