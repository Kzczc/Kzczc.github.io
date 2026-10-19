"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import FigureLightbox from "@/components/FigureLightbox";
import { selectedPublications } from "@/data/profile";

/* ── highlight "Yuhe Wu" (with optional * or † suffix) ── */
function renderAuthors(authors: string) {
  const parts = authors.split(/(Yuhe Wu[*†]*)/g);
  return parts.map((part, i) =>
    part.startsWith("Yuhe Wu") ? (
      <span key={i} className="font-semibold not-italic" style={{ color: "var(--accent-warm)" }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── mini markdown: **bold** and *italic* ── */
function renderMarkdown(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--foreground)" }}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith("*") && tok.endsWith("*")) {
      return <em key={i}>{tok.slice(1, -1)}</em>;
    }
    return <span key={i}>{tok}</span>;
  });
}

const mascots = [
  { image: "/images/hiphop_action.png", name: "Kiso", color: "#06b6d4", slogan: "Let me break this down." },
  { image: "/images/painter_action.png", name: "Sui", color: "#a855f7", slogan: "Allow me to illustrate!" },
];

const statusColors: Record<string, { text: string; bg: string }> = {
  green:  { text: "var(--status-green)", bg: "#16a34a15" },
  blue:   { text: "var(--status-blue)", bg: "#2563eb15" },
  orange: { text: "#ea580c", bg: "#ea580c15" },
  gray:   { text: "#64748b", bg: "#64748b15" },
};

const SELECTED_MANUSCRIPT_IDS = [
  "prism",
  "bizsage",
  "narrative-captivity",
  "bizcompass",
  "headwater",
  "aaai-cor2",
  "generative-agent",
  "dnd",
];

export default function Publications() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsedCoreIds, setCollapsedCoreIds] = useState<Set<string>>(() => new Set(SELECTED_MANUSCRIPT_IDS));
  const [lightbox, setLightbox] = useState<{ src: string; title: string; trigger: HTMLButtonElement } | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const [showAll, setShowAll] = useState(false);
  const reducedMotion = useReducedMotion();

  const visiblePubs = showAll
    ? [...selectedPublications].sort((a, b) => {
        const statusOrder = (status: string) => {
          if (status === "Accepted" || status === "Published") return 0;
          if (status.startsWith("Under Review")) return 1;
          if (status === "Preprint") return 2;
          return 3;
        };
        return statusOrder(a.status) - statusOrder(b.status);
      })
    : selectedPublications
        .filter((p) => SELECTED_MANUSCRIPT_IDS.includes(p.id))
        .sort((a, b) => SELECTED_MANUSCRIPT_IDS.indexOf(a.id) - SELECTED_MANUSCRIPT_IDS.indexOf(b.id));

  return (
    <section id="publications" className="relative py-10">
      <div className="site-container mx-auto max-w-[1280px] px-8 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="section-dash text-[1.4rem] font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Selected Manuscripts
          </span>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-3 -mt-3">
          <button
            aria-pressed={!showAll}
            onClick={() => setShowAll(false)}
            className="pub-tab text-[12.5px] px-4 py-1.5 rounded-full transition-all"
            style={{
              color: !showAll ? "var(--on-accent)" : "var(--muted)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              background: !showAll ? "var(--accent)" : "transparent",
              border: "1px solid var(--card-border)",
            }}
          >
            Selected Manuscripts
          </button>
          <button
            aria-pressed={showAll}
            onClick={() => setShowAll(true)}
            className="pub-tab text-[12.5px] px-4 py-1.5 rounded-full transition-all"
            style={{
              color: showAll ? "var(--on-accent)" : "var(--muted)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              background: showAll ? "var(--accent)" : "transparent",
              border: "1px solid var(--card-border)",
            }}
          >
            Full Publications List
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap" style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
          <p className="text-[12.5px]">* equal contribution · † corresponding author</p>
          <span className="text-[12px] tabular-nums">{visiblePubs.length} {showAll ? "papers" : "selected manuscripts"}</span>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {visiblePubs.map((pub, i) => {
            const isCoreTab = !showAll;
            const isExpanded = isCoreTab
              ? !collapsedCoreIds.has(pub.id)
              : expandedId === pub.id;
            const sc = statusColors[pub.statusColor] || statusColors.blue;

            return (
              <motion.div
                key={pub.id}
                id={`paper-${pub.id}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i, 3) * 0.04 }}
                data-glow
                className="glow-surface paper-card rounded-xl border overflow-hidden card-hover"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* ── Left column: thumbnail + mascot ── */}
                  <div className={`${pub.thumbnail || isExpanded ? "w-full lg:w-[46%] flex" : "hidden"} flex-shrink-0 flex-col`}>
                    {pub.thumbnail ? (
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`Enlarge figure: ${pub.title}`}
                      className={`pub-figure-frame relative w-full cursor-zoom-in group ${pub.id === "aaai-cor2" ? "pub-figure-tall" : "aspect-[16/10]"}`}
                      onClick={event => setLightbox({ src: pub.thumbnail, title: pub.title, trigger: event.currentTarget })}
                    >
                      <Image
                        src={pub.thumbnail}
                        alt={pub.title}
                        fill
                        sizes="(min-width: 1280px) 544px, (min-width: 1024px) 46vw, 100vw"
                        className="object-contain p-2.5"
                        unoptimized
                      />
                      <span className="figure-zoom-hint">
                        <span className="text-[11px] font-mono">
                          Click to zoom
                        </span>
                      </span>
                    </button>
                    ) : null}
                    {isExpanded && (() => {
                      const m = mascots[i % 2];
                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.35, delay: 0.2 }}
                          className="hidden lg:flex flex-1 flex-col items-center justify-center relative p-4 pub-mascot-panel"
                        >
                          <div
                            className="absolute inset-0"
                            style={{ background: `radial-gradient(ellipse at center, ${m.color}20 0%, transparent 65%)` }}
                          />
                          <div className="relative mb-1.5 z-10">
                            <div
                              className="px-3.5 py-1.5 rounded-2xl text-[15px] whitespace-nowrap"
                              style={{ background: `${m.color}15`, color: m.color, fontFamily: "var(--font-comic)" }}
                            >
                              {m.slogan} <span className="text-[11px] opacity-60">— {m.name}</span>
                            </div>
                            <div
                              className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-[10px] h-[10px] rotate-45"
                              style={{ background: `${m.color}15` }}
                            />
                          </div>
                          <motion.div
                            animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-0"
                          >
                            <Image
                              src={m.image}
                              alt={m.name}
                              width={210}
                              height={178}
                              className="select-none pointer-events-none"
                              unoptimized
                            />
                          </motion.div>
                        </motion.div>
                      );
                    })()}
                  </div>

                  {/* ── Right: content ── */}
                  <div className="paper-content min-w-0 flex-1 px-5 py-5 sm:px-6 flex flex-col justify-center gap-3">
                    {/* title */}
                    <h3 className="text-[16.5px] font-bold leading-snug" style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>
                      {pub.title}
                    </h3>

                    {/* authors */}
                    <p className="text-[13.5px] leading-relaxed italic" style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
                      {renderAuthors(pub.authors)}
                    </p>

                    {/* badges */}
                    <div className="flex items-center gap-2 flex-wrap" style={{ fontFamily: "var(--font-sans)" }}>
                      {pub.badges.map((badge) => (
                        <span
                          key={badge}
                          className="text-[10.5px] font-semibold px-2 py-0.5 rounded"
                          style={{
                            color: (badge === "Equal Contribution" || badge === "Co-First Author") ? "var(--accent-warm)" : "var(--accent)",
                            background: (badge === "Equal Contribution" || badge === "Co-First Author") ? "rgba(249,115,22,0.1)" : "rgba(6,182,212,0.1)",
                            border: (badge === "Equal Contribution" || badge === "Co-First Author") ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(6,182,212,0.2)",
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                      {pub.extraBadges?.map((eb) => (
                        <span
                          key={eb}
                          className="text-[10.5px] font-semibold px-2 py-0.5 rounded"
                          style={{ color: "#16a34a", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)" }}
                        >
                          {eb}
                        </span>
                      ))}
                      <span
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded"
                        style={{ color: sc.text, background: sc.bg }}
                      >
                        {pub.status}
                      </span>
                    </div>

                    {/* venue + links */}
                    <div className="flex items-center gap-3 flex-wrap text-[13px]" style={{ fontFamily: "var(--font-sans)" }}>
                      <span className="italic font-semibold" style={{ color: "var(--accent)" }}>
                        {pub.venue}
                      </span>
                      {pub.rating && pub.rating.split(", ").map((r, idx) => {
                        const isTop = r.includes("A") || r.includes("Q1");
                        return (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-sm not-italic font-semibold"
                            style={{
                              color: "var(--violet-text)",
                              background: isTop ? "rgba(167,139,250,0.08)" : "rgba(196,181,253,0.06)",
                              border: isTop ? "1px solid rgba(167,139,250,0.2)" : "1px solid rgba(196,181,253,0.15)",
                            }}>
                            {r}
                          </span>
                        );
                      })}
                      {pub.links?.paper && (
                        <a href={pub.links.paper} target="_blank" rel="noopener noreferrer"
                          className="inline-action hover:underline text-[12.5px]" style={{ color: "var(--action-text)", fontFamily: "var(--font-sans)" }}>
                          [{pub.links.paper.includes("arxiv") ? "ArXiv" : "Paper"}]
                        </a>
                      )}
                      {pub.links?.poster && (
                        <a href={pub.links.poster} target="_blank" rel="noopener noreferrer"
                          className="inline-action hover:underline text-[12.5px]" style={{ color: "var(--action-text)", fontFamily: "var(--font-sans)" }}>[Poster]</a>
                      )}
                      {pub.links?.code && (
                        <a href={pub.links.code} target="_blank" rel="noopener noreferrer"
                          className="inline-action hover:underline text-[12.5px]" style={{ color: "var(--action-text)", fontFamily: "var(--font-sans)" }}>[Code]</a>
                      )}
                      {pub.links?.website && (
                        <a href={pub.links.website} target="_blank" rel="noopener noreferrer"
                          className="inline-action hover:underline text-[12.5px]" style={{ color: "var(--action-text)", fontFamily: "var(--font-sans)" }}>[Website]</a>
                      )}
                      {pub.links?.project && (
                        <a href={pub.links.project} target="_blank" rel="noopener noreferrer"
                          className="inline-action hover:underline text-[12.5px]" style={{ color: "var(--action-text)", fontFamily: "var(--font-sans)" }}>[Project]</a>
                      )}
                      <button
                        onClick={() => {
                          if (isCoreTab) {
                            setCollapsedCoreIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(pub.id)) next.delete(pub.id);
                              else next.add(pub.id);
                              return next;
                            });
                          } else {
                            setExpandedId(expandedId === pub.id ? null : pub.id);
                          }
                        }}
                        aria-expanded={isExpanded}
                        aria-controls={`abstract-${pub.id}`}
                        className="inline-action hover:underline cursor-pointer text-[12.5px]" style={{ color: "var(--action-text)", fontFamily: "var(--font-sans)" }}
                      >
                        [{isExpanded ? "Hide Abstract" : "Abstract"}]
                      </button>
                    </div>

                    {/* expandable abstract */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`abstract-${pub.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="text-[13px] leading-[1.75] mt-2 pt-3 text-justify"
                            style={{ color: "var(--muted)", borderTop: "1px dashed var(--card-border)" }}
                          >
                            {pub.abstract ? (
                              <>
                                <p>{renderMarkdown(pub.abstract)}</p>
                                {pub.abstractNote && (
                                  <p className="mt-2 italic text-[12px]" style={{ color: "var(--accent)" }}>
                                    ({pub.abstractNote})
                                  </p>
                                )}
                              </>
                            ) : (
                              <p>Abstract coming soon. Check back later or contact me for the preprint.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {lightbox && <FigureLightbox {...lightbox} onClose={closeLightbox} />}
    </section>
  );
}
