"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Github, ExternalLink } from "lucide-react";
import { recentUpdates } from "@/data/profile";

/* ── type config ── */
const typeConfig: Record<string, { label: string; icon: string; bg: string; border: string }> = {
  PUBLICATION: { label: "PUBLICATION", icon: "📄", bg: "#7c3aed15", border: "#7c3aed33" },
  EXPERIENCE:  { label: "EXPERIENCE",  icon: "🏫", bg: "#06b6d415", border: "#06b6d433" },
  AWARD:       { label: "AWARD",       icon: "🏆", bg: "#f9731615", border: "#f9731633" },
  RELEASE:     { label: "RELEASE",     icon: "🚀", bg: "#10b98115", border: "#10b98133" },
  MEDIA:       { label: "MEDIA",       icon: "📰", bg: "#14b8a615", border: "#14b8a633" },
  TALK:        { label: "TALK",        icon: "🎙️", bg: "#ec489915", border: "#ec489933" },
  COURSE:      { label: "COURSE",      icon: "📚", bg: "#ef444415", border: "#ef444433" },
};

/* ── status config ── */
const statusConfig: Record<string, { label: string; bg: string }> = {
  under_review: { label: "Under Review", bg: "#facc1515" },
  accepted:     { label: "Accepted",     bg: "#4ade8015" },
  published:    { label: "Published",    bg: "#4ade8015" },
  joined:       { label: "Joined",       bg: "#22d3ee15" },
  offered:      { label: "Offered",      bg: "#22d3ee15" },
  granted:      { label: "Awarded",      bg: "#fb923c15" },
  released:     { label: "Released",     bg: "#34d39915" },
  upcoming:     { label: "Coming Soon",  bg: "#f9731615" },
};

/* ── link icon components (replacing dangerouslySetInnerHTML) ── */
const linkIconComponents: Record<string, { Icon: React.ComponentType<{ size?: number }>; title: string }> = {
  paper:  { Icon: FileText,     title: "Paper" },
  github: { Icon: Github,       title: "Code" },
  site:   { Icon: ExternalLink, title: "Website" },
};

/* ── live clock ── */
function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime([now.getHours(), now.getMinutes(), now.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":"));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── slugify venue for command line ── */
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 28);
}

export default function RecentUpdates() {
  const clock = useClock();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVisible = 6;

  const cmdText = hoveredIdx !== null
    ? `less ./memories/${slugify(recentUpdates[hoveredIdx].venue)}...`
    : `find ./brain -type f -name "*.memory" | sort -r | head -10`;

  return (
    <section className="relative py-8">
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">
        {/* ── Section Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="section-dash text-[1.4rem] font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Recent Updates
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded animate-pulse" style={{ color: "#fff", background: "#ef4444" }}>
            NEWS
          </span>
        </motion.div>

        {/* ── Terminal Window ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="terminal-card rounded-xl overflow-hidden border relative"
          style={{ borderColor: "var(--card-border)" }}
        >
          {/* ══ Rainbow gradient bar (animated) ══ */}
          <div className="h-[3px] w-full rainbow-bar" />

          {/* ══ Title bar ══ */}
          <div className="flex items-center justify-between px-4 py-2.5 terminal-titlebar">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
                <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
                <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
              </div>
              <span className="font-mono text-[12px] ml-1 terminal-muted">
                &gt;_ const kc = new Terminal(
                <span className="terminal-green">&apos;research&apos;</span>)
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] px-3 py-1 rounded-md terminal-status-box">
              <span className="terminal-yellow">PAPER.GRINDING</span>
              <span className="terminal-muted">✓</span>
              <span className="terminal-text">{clock}</span>
              <span className="terminal-green">●</span>
              <span className="terminal-green">FLOW_STATE</span>
            </div>
          </div>

          {/* ══ Tab bar ══ */}
          <div className="flex items-center justify-between px-4 py-1.5 font-mono text-[11px] terminal-tabbar">
            <div className="flex items-center gap-1.5">
              <span>🎤</span>
              <span className="terminal-blue">Kc.</span>
              <span className="terminal-muted">/</span>
              <span className="terminal-purple">AI</span>
              <span className="terminal-muted">/</span>
              <span>📁</span>
              <span className="terminal-green">~/lab/breakthroughs</span>
              <span className="terminal-muted ml-4">→</span>
            </div>
            <div className="hidden sm:flex items-center gap-2.5 terminal-muted">
              <span>♪</span>
              <span className="terminal-blue">lo-fi beats</span>
              <span>·</span>
              <span className="terminal-green">matcha</span>
              <span className="ml-2">🔋</span>
              <span className="terminal-green">95%</span>
              <span className="flex items-end gap-[1px] ml-1">
                <span className="w-[3px] h-[5px] rounded-sm terminal-signal-on" />
                <span className="w-[3px] h-[7px] rounded-sm terminal-signal-on" />
                <span className="w-[3px] h-[9px] rounded-sm terminal-signal-on" />
                <span className="w-[3px] h-[11px] rounded-sm terminal-signal-off" />
              </span>
            </div>
          </div>

          {/* ══ Column headers ══ */}
          <div
            className="grid font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-2 terminal-header"
            style={{ gridTemplateColumns: "105px 120px 60px 1fr auto" }}
          >
            <span>TIME</span>
            <span>CAT</span>
            <span>PID</span>
            <span>MEMORY.DUMP</span>
            <span className="text-right min-w-[80px]">LINKS</span>
          </div>

          {/* ══ Scrollable rows ══ */}
          <div className="overflow-y-auto terminal-scroll" style={{ maxHeight: `${maxVisible * 72}px` }}>
            {recentUpdates.map((item, i) => {
              const tc = typeConfig[item.type] || typeConfig.PUBLICATION;
              const sc = statusConfig[item.status];
              return (
                <div
                  key={item.hex}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`grid items-start px-4 py-3 font-mono text-[12.5px] terminal-row transition-colors cursor-default group ${hoveredIdx === i ? "terminal-row-selected" : ""}`}
                  style={{ gridTemplateColumns: "105px 120px 60px 1fr auto" }}
                >
                  <span className="terminal-type-date">{item.date}</span>
                  <span className="flex items-center gap-1">
                    <span>{tc.icon}</span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded terminal-type-text"
                      style={{ background: tc.bg, border: `1px solid ${tc.border}` }}
                    >
                      {tc.label}
                    </span>
                  </span>
                  <span className="terminal-dim">{item.hex}</span>
                  <div className="min-w-0">
                    {sc && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-[2px] rounded mr-2 inline-block terminal-status-label"
                        style={{ background: sc.bg }}
                      >
                        {sc.label}
                      </span>
                    )}
                    <span className="font-semibold terminal-venue">{item.venue}</span>
                    <br />
                    <span className="terminal-desc">
                      {item.title}
                      {item.title.length > 50 && (
                        <span className="ml-1 text-[10px] terminal-muted">[+more]</span>
                      )}
                    </span>
                  </div>
                  {/* ── Right-side link icons (clickable) ── */}
                  <div className="flex items-center gap-1.5 min-w-[80px] justify-end">
                    {item.linkIcons.map((linkItem) => {
                      const ic = linkIconComponents[linkItem.type];
                      if (!ic) return null;
                      const { Icon, title } = ic;
                      return (
                        <a
                          key={linkItem.type}
                          href={linkItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={title}
                          onClick={(e) => e.stopPropagation()}
                          className="terminal-link-icon inline-flex items-center justify-center w-6 h-6 rounded border"
                        >
                          <Icon size={14} />
                        </a>
                      );
                    })}
                    {/* expand */}
                    <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity terminal-muted ml-1">
                      [+]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ══ Bottom command line (dynamic) ══ */}
          <div className="flex items-center justify-between px-4 py-3 font-mono text-[12px] terminal-bottom">
            <div className="flex items-center min-w-0">
              <span className="terminal-green">❯</span>
              <span className="ml-2 terminal-text truncate">
                {cmdText}
              </span>
              <span className="animate-blink ml-0.5 terminal-blue">█</span>
            </div>
            <span className="hidden sm:inline text-[10px] italic terminal-dim flex-shrink-0 ml-4">
              // still scrolling? respect. 🎤
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
