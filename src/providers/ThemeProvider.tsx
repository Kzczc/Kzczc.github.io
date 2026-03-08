"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

/**
 * ThemeProvider — 包裹整个应用，提供暗色/浅色主题切换
 * - attribute="class" → 通过 .dark class 切换
 * - defaultTheme="dark" → 默认暗色
 * - enableSystem → 支持跟随系统偏好
 * - 用户偏好自动存入 localStorage
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
