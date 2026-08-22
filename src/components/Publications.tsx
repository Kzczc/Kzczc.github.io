"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronRight, FileText, Github, Globe, X, Presentation } from "lucide-react";
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
  green:  { text: "#16a34a", bg: "#16a34a15" },
  blue:   { text: "#2563eb", bg: "#2563eb15" },
  orange: { text: "#ea580c", bg: "#ea580c15" },
  gray:   { text: "#64748b", bg: "#64748b15" },
};

const FULL_ONLY_IDS = new Set(["kdd-quantifying", "joneses", "polluvcct", "anor"]);

export default function Publications() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsedCoreIds, setCollapsedCoreIds] = useState<Set<string>>(new Set());
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visiblePubs = showAll
    ? selectedPublications
    : selectedPublications.filter((p) => !FULL_ONLY_IDS.has(p.id));

  return (
    <section id="publications" className="relative py-10">
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="section-dash text-[1.4rem] font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Selected Publications
          </span>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-3 -mt-3">
          <button
            onClick={() => setShowAll(false)}
            className="text-[12.5px] px-4 py-1.5 rounded-full transition-all"
            style={{
              color: !showAll ? "#fff" : "#7c3aed",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              background: !showAll ? "#7c3aed" : "transparent",
              border: "1px solid #7c3aed",
            }}
          >
            Core Publications
          </button>
          <button
            onClick={() => setShowAll(true)}
            className="text-[12.5px] px-4 py-1.5 rounded-full transition-all"
            style={{
              color: showAll ? "#fff" : "#0891b2",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              background: showAll ? "#0891b2" : "transparent",
              border: "1px solid #0891b2",
            }}
          >
            Full Publications List
          </button>
        </div>
        <p className="text-[12.5px] mb-5" style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>
          (* equal contribution · † corresponding author)
        </p>

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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-lg border overflow-hidden card-hover"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* ── Left column: thumbnail + mascot ── */}
                  <div className="w-full md:w-[380px] lg:w-[440px] flex-shrink-0 flex flex-col">
                    <div
                      className="relative overflow-hidden cursor-zoom-in group"
                      onClick={() => setLightboxSrc(pub.thumbnail)}
                    >
                      <Image
                        src={pub.thumbnail}
                        alt={pub.title}
                        width={1200}
                        height={600}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-[11px] font-mono px-2 py-1 rounded bg-black/60 text-white">
                          Click to zoom
                        </span>
                      </div>
                    </div>
                    {isExpanded && (() => {
                      const m = mascots[i % 2];
                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.35, delay: 0.2 }}
                          className="hidden md:flex flex-1 flex-col items-center justify-center relative p-4"
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
                            animate={{ y: [0, -5, 0] }}
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
                  <div className="flex-1 px-6 py-4 flex flex-col justify-between">
                    {/* title */}
                    <h3 className="text-[16.5px] font-bold leading-snug" style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>
                      {pub.title}
                    </h3>

                    {/* authors */}
                    <p className="text-[13.5px] leading-relaxed italic" style={{ color: "var(--foreground)", opacity: 0.65, fontFamily: "var(--font-sans)" }}>
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
                              color: isTop ? "#a78bfa" : "#c4b5fd",
                              background: isTop ? "rgba(167,139,250,0.08)" : "rgba(196,181,253,0.06)",
                              border: isTop ? "1px solid rgba(167,139,250,0.2)" : "1px solid rgba(196,181,253,0.15)",
                            }}>
                            {r}
                          </span>
                        );
                      })}
                      {pub.links?.paper && (
                        <a href={pub.links.paper} target="_blank" rel="noopener noreferrer"
                          className="hover:underline text-[12.5px]" style={{ color: "#e09040", fontFamily: "var(--font-sans)" }}>
                          [{pub.links.paper.includes("arxiv") ? "ArXiv" : "Paper"}]
                        </a>
                      )}
                      {pub.links?.poster && (
                        <a href={pub.links.poster} target="_blank" rel="noopener noreferrer"
                          className="hover:underline text-[12.5px]" style={{ color: "#e09040", fontFamily: "var(--font-sans)" }}>[Poster]</a>
                      )}
                      {pub.links?.code && (
                        <a href={pub.links.code} target="_blank" rel="noopener noreferrer"
                          className="hover:underline text-[12.5px]" style={{ color: "#e09040", fontFamily: "var(--font-sans)" }}>[Code]</a>
                      )}
                      {pub.links?.website && (
                        <a href={pub.links.website} target="_blank" rel="noopener noreferrer"
                          className="hover:underline text-[12.5px]" style={{ color: "#e09040", fontFamily: "var(--font-sans)" }}>[Website]</a>
                      )}
                      {pub.links?.project && (
                        <a href={pub.links.project} target="_blank" rel="noopener noreferrer"
                          className="hover:underline text-[12.5px]" style={{ color: "#e09040", fontFamily: "var(--font-sans)" }}>[Project]</a>
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
                        className="hover:underline cursor-pointer text-[12.5px]" style={{ color: "#e09040", fontFamily: "var(--font-sans)" }}
                      >
                        [{isExpanded ? "Hide Abstract" : "Abstract"}]
                      </button>
                    </div>

                    {/* expandable abstract */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
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

      {/* ══ Lightbox overlay ══ */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out p-8"
            onClick={() => setLightboxSrc(null)}
          >
            {/* close button */}
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightboxSrc(null)}
            >
              <X size={28} />
            </button>
            {/* full image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxSrc}
                alt="Paper figure"
                width={1200}
                height={675}
                className="object-contain w-[85vw] h-auto max-h-[85vh] rounded-lg shadow-2xl"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
