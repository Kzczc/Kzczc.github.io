"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, FileText } from "lucide-react";
import Image from "next/image";
import {
  personalInfo,
  currentResearch,
  education,
  mascots,
  briefIntro,
} from "@/data/profile";

/* ─── Typewriter hook ─── */
function useTypewriter(
  texts: string[],
  typingSpeed = 55,
  deletingSpeed = 30,
  pause = 2200
) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIdx === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setTextIdx((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, textIdx, texts, typingSpeed, deletingSpeed, pause]);

  return display;
}

/* ─── Markdown renderer: **bold** + [link](url) ─── */
function renderBrief(text: string) {
  // First split by links [text](url), then handle bold inside each part
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Text before this link
    if (match.index > lastIndex) {
      parts.push(...renderBold(text.slice(lastIndex, match.index), parts.length));
    }
    // The link itself
    const linkText = match[1];
    const linkUrl = match[2];
    // Check if link text has bold markers
    const boldStripped = linkText.replace(/\*\*/g, "");
    const isBold = linkText.includes("**");
    parts.push(
      <a
        key={`link-${parts.length}`}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline decoration-1 underline-offset-2 hover:decoration-2 transition-all ${isBold ? "font-semibold" : ""}`}
        style={{ color: "var(--accent)" }}
      >
        {boldStripped}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  // Remaining text after last link
  if (lastIndex < text.length) {
    parts.push(...renderBold(text.slice(lastIndex), parts.length));
  }
  return parts;
}

function renderBold(text: string, keyOffset: number): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`b-${keyOffset}-${i}`} className="font-semibold" style={{ color: "var(--foreground)" }}>
        {part}
      </strong>
    ) : (
      <span key={`t-${keyOffset}-${i}`}>{part}</span>
    )
  );
}

/* ═══════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════ */
export default function Hero() {
  const typed = useTypewriter(personalInfo.typewriterTexts);
  const [hoveredMascot, setHoveredMascot] = useState<number | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section id="home" className="relative pt-20 pb-6 overflow-hidden">
      <div className="halftone-overlay absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-8 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-x-14 lg:gap-y-6 items-start pt-8"
        >
          {/* ═══════ LEFT COLUMN ═══════ */}
          <div className="flex flex-col gap-4">
              {/* name */}
              <motion.div variants={fadeUp}>
                <p className="font-mono text-[15px] mb-2" style={{ color: "var(--accent)" }}>
                  $ Hi there, I&apos;m
                </p>
                <h1 className="text-[2.8rem] font-bold tracking-tight sm:text-[3.2rem] leading-[1.1]">
                  <span className="gradient-text animate-neon">
                    {personalInfo.name}
                  </span>
                </h1>
              </motion.div>

              {/* typewriter */}
              <motion.p variants={fadeUp} className="font-mono text-[15px]" style={{ color: "var(--muted)" }}>
                <span style={{ color: "var(--accent)" }}>$</span> Sometimes I{" "}
                <span style={{ color: "var(--accent-warm)" }}>{typed}</span>
                <span className="animate-blink" style={{ color: "var(--accent)" }}>█</span>
              </motion.p>

              {/* research & education */}
              <motion.div variants={fadeUp} className="grid gap-6 sm:grid-cols-2 items-stretch mt-2">
                <div className="flex flex-col">
                  <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--muted)" }}>
                    Current Research
                  </h3>
                  <div className="flex flex-col gap-3 flex-1 justify-between">
                    {currentResearch.map((r) => (
                      <div key={r.title} className="flex items-start gap-3 flex-1">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] mt-0.5">
                          <Image src={r.icon} alt={r.title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium leading-snug" style={{ color: "var(--foreground)" }}>{r.title}</p>
                          <p className="text-[13px] leading-snug mt-0.5" style={{ color: "var(--muted)" }}>{r.subtitle}</p>
                          <p className="text-[12px] leading-snug mt-1 italic" style={{ color: "var(--muted)", opacity: 0.7 }}>{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--muted)" }}>
                    Education
                  </h3>
                  <div className="flex flex-col gap-3 flex-1 justify-between">
                    {education.map((e) => (
                      <div key={e.title} className="flex items-start gap-3 flex-1">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] mt-0.5">
                          <Image src={e.icon} alt={e.title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium leading-snug" style={{ color: "var(--foreground)" }}>{e.title}</p>
                          <p className="text-[13px] leading-snug mt-0.5" style={{ color: "var(--muted)" }}>{e.subtitle}</p>
                          <p className="text-[12px] leading-snug mt-1 italic" style={{ color: "var(--muted)", opacity: 0.7 }}>{e.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* greeting + contact */}
              <motion.div variants={fadeUp} className="flex items-start gap-4 mt-2">
                <p className="text-[14px] leading-relaxed text-justify flex-1" style={{ color: "var(--muted)" }}>
                  {personalInfo.greeting}
                </p>
                <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="inline-flex items-center gap-1.5 text-[13px] rounded-lg px-4 py-2 border transition-colors hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/40"
                    style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}
                  >
                    <Mail size={14} /> Email
                  </a>
                  <a
                    href="/images/CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] rounded-lg px-4 py-2 border transition-colors hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/40"
                    style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}
                  >
                    <FileText size={14} /> CV
                  </a>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT ── */}
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-5 lg:pt-0">
              {/* avatar */}
              <div
                className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-2xl border-2 shadow-lg overflow-hidden"
                style={{ borderColor: "var(--accent)" }}
              >
                <div
                  className="absolute inset-0 opacity-10 z-10 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, var(--accent) 1px, transparent 1px)",
                    backgroundSize: "5px 5px",
                  }}
                />
                <Image src={personalInfo.avatar} alt={personalInfo.name} fill className="object-cover" priority unoptimized />
              </div>

              {/* social icons: bilibili + rednote + wechat */}
              <div className="flex items-center gap-4">
                {/* Bilibili 小电视 */}
                <a href="https://space.bilibili.com/510981326" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="#00AEEC">
                    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                  </svg>
                </a>
                {/* 小红书 */}
                <a href="https://www.xiaohongshu.com/user/profile/62c02fa70000000019029c28" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Image src="/images/rednote.png" alt="小红书" width={22} height={22} unoptimized />
                </a>
                {/* 微信 */}
                <a href="/images/wechat.jpg" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Image src="/images/weixin.png" alt="微信" width={22} height={22} unoptimized />
                </a>
              </div>

              {/* mascots row */}
              <div className="flex items-start gap-6">
                {mascots.map((m, i) => (
                  <motion.div
                    key={m.name}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                  >
                    <div
                      className="relative h-20 w-20 overflow-hidden rounded-full border-2 sm:h-[88px] sm:w-[88px] transition-all duration-200"
                      style={{ borderColor: hoveredMascot === i ? m.roleColor : "var(--card-border)" }}
                      onMouseEnter={() => setHoveredMascot(i)}
                      onMouseLeave={() => setHoveredMascot(null)}
                    >
                      <Image src={m.image} alt={m.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[16px] font-semibold"
                        style={{ color: m.roleColor, fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}
                      >
                        {m.name}
                      </span>
                      <div className="relative h-7 w-7 flex-shrink-0">
                        <Image src={m.icon} alt={m.role} fill className="object-contain" unoptimized />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          {/* ═══════ FULL-WIDTH: mascot bio card (if hovered) ═══════ */}
          {hoveredMascot !== null && (
            <motion.div
              key={mascots[hoveredMascot].name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="lg:col-span-2 rounded-xl border px-6 py-5"
              style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
            >
              <span
                className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded inline-block mb-2.5"
                style={{ color: "#fff", background: mascots[hoveredMascot].roleColor }}
              >
                {mascots[hoveredMascot].role}
              </span>
              <p className="text-[14px] leading-[1.75] text-justify" style={{ color: "var(--muted)", fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
                {mascots[hoveredMascot].bio}
              </p>
            </motion.div>
          )}

          {/* ═══════ FULL-WIDTH: brief intro ═══════ */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-2 rounded-xl border px-6 py-5"
            style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
          >
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                &gt; who am i
              </span>
              <span
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                style={{ color: "var(--accent-warm)", background: "rgba(249,115,22,0.12)" }}
              >
                Researcher
              </span>
              <span
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                style={{ color: "#a855f7", background: "rgba(168,85,247,0.12)" }}
              >
                Anime Fan
              </span>
              <span
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                style={{ color: "var(--accent)", background: "rgba(6,182,212,0.12)" }}
              >
                Hip-hop Head
              </span>
            </div>
            <div className="text-[14px] leading-[1.8] space-y-2 text-justify" style={{ color: "var(--muted)" }}>
              {briefIntro.split("\n\n").map((p, i) => (
                <p key={i}>{renderBrief(p)}</p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
