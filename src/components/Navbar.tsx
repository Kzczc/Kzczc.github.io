"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Moon, Sun, Menu, X,
  Mail, Github, Linkedin, GraduationCap, FileText,
} from "lucide-react";
import { navLinks, socialLinks } from "@/data/profile";
import EmailContact from "@/components/EmailContact";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Mail, Github, Linkedin, GraduationCap, FileText,
};

/* ── Section IDs for IntersectionObserver ── */
const sectionIds = ["home", "publications", "journey", "awards"];

const subscribe = () => () => {};

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");

  /* ── Mount guard (避免 SSR 水合不匹配) ── */
  useEffect(() => {
    if (!mobileOpen) return;
    const wideScreen = window.matchMedia("(min-width: 1024px)");
    const closeOnResize = () => { if (wideScreen.matches) setMobileOpen(false); };
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    wideScreen.addEventListener("change", closeOnResize);
    document.addEventListener("keydown", onKey);
    return () => {
      wideScreen.removeEventListener("change", closeOnResize);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── IntersectionObserver: 自动高亮当前 section ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${id}`);
          }
        },
        {
          /* rootMargin: 上方偏移 navbar 高度，下方缩小触发区域 */
          rootMargin: "-80px 0px -50% 0px",
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Toggle dark mode ── */
  const toggleDark = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const handleNav = (href: string) => {
    setActiveHash(href);
    setMobileOpen(false);
  };

  const isDark = resolvedTheme === "dark";
  const { scrollYProgress } = useScroll();

  return (
    <nav
      className="site-nav fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300"
      style={{
        background: "var(--nav-bg)",
        borderBottom: "1.5px solid var(--card-border)",
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <motion.div aria-hidden="true" className="reading-progress" style={{ scaleX: scrollYProgress }} />
      <div className="site-container mx-auto flex max-w-[1280px] items-center justify-between px-8 lg:px-12 py-5">
        {/* ── 左侧 Logo: Kc. ── */}
        <a
          href="#home"
          onClick={() => handleNav("#home")}
          className="group flex items-center gap-1.5 select-none"
        >
          <span className="font-mono text-[11px] transition-colors" style={{ color: "var(--accent)" }}>
            &gt;_
          </span>
          <span
            className="text-[22px] font-bold tracking-tight gradient-text transition-all group-hover:tracking-wide"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Kc.
          </span>
        </a>

        {/* ── 右侧：导航 + 社交 + 暗色切换 ── */}
        <div className="flex items-center gap-3">
          {/* ── 导航链接 ── */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeHash === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={activeHash === link.href ? "location" : undefined}
                  onClick={() => handleNav(link.href)}
                  className={`nav-item relative px-5 py-2 text-[16px] tracking-[-0.01em] transition-colors rounded-lg ${
                    isActive
                      ? "font-semibold"
                      : "font-normal hover:text-[var(--foreground)]"
                  }`}
                  style={{
                    color: isActive ? "var(--foreground)" : "var(--muted)",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="nav-active-line absolute bottom-1 left-5 right-5 h-[2px] rounded-full"
                      style={{ background: "var(--accent)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* ── 分隔线 ── */}
          <div
            className="hidden lg:block h-6 w-px mx-2"
            style={{ background: "var(--card-border)" }}
          />

          {/* ── 社交图标 ── */}
          <div className="hidden items-center gap-1 lg:flex">
            {socialLinks.map((link) => {
              if (link.icon === "Mail") return (
                <EmailContact key={link.label} iconOnly className="nav-social-link rounded-lg p-2.5 transition-colors hover:text-[var(--accent)] hover:bg-[var(--accent)]/5" />
              );
              const Icon = iconMap[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  className="nav-social-link rounded-lg p-2.5 transition-colors hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
                  style={{ color: "var(--muted)" }}
                >
                  {Icon && <Icon size={20} />}
                </a>
              );
            })}
          </div>

          {/* ── 暗色切换 ── */}
          {mounted && (
            <button
              onClick={toggleDark}
              className="nav-icon-button rounded-lg p-2.5 transition-colors hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
              style={{ color: "var(--muted)" }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          {/* ── 移动端菜单 ── */}
          <button
            ref={menuButton}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2.5 lg:hidden"
            style={{ color: "var(--muted)" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── 移动端下拉 ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[var(--card-border)] lg:hidden"
            style={{ background: "var(--nav-bg)" }}
          >
            <div className="flex flex-col gap-1 px-8 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={activeHash === link.href ? "location" : undefined}
                  onClick={() => handleNav(link.href)}
                  className="text-[16px] py-2.5 rounded-lg px-3"
                  style={{
                    color: activeHash === link.href ? "var(--foreground)" : "var(--muted)",
                    fontWeight: activeHash === link.href ? 600 : 400,
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-3 mt-2 border-t border-[var(--card-border)]">
                {socialLinks.map((link) => {
                  if (link.icon === "Mail") return (
                    <EmailContact key={link.label} iconOnly className="nav-social-link rounded-lg p-2.5 transition-colors hover:text-[var(--accent)] hover:bg-[var(--accent)]/5" />
                  );
                  const Icon = iconMap[link.icon];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="p-2.5"
                      style={{ color: "var(--muted)" }}
                    >
                      {Icon && <Icon size={20} />}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
