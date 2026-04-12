"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronRight, FileText, Github, Globe, X } from "lucide-react";
import { selectedPublications } from "@/data/profile";

/* ── highlight "Yuhe Wu" ── */
function renderAuthors(authors: string) {
  const parts = authors.split(/(Yuhe Wu)/g);
  return parts.map((part, i) =>
    part === "Yuhe Wu" ? (
      <span key={i} className="font-semibold" style={{ color: "var(--accent)" }}>{part}</span>
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
};

export default function Publications() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {selectedPublications.map((pub, i) => {
            const isExpanded = expandedId === pub.id;
            const sc = statusColors[pub.statusColor] || statusColors.blue;

            return (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-xl border overflow-hidden card-hover"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* ── Left column: thumbnail + mascot ── */}
                  <div className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 flex flex-col">
                    <div
                      className="relative overflow-hidden cursor-zoom-in group"
                      style={{ minHeight: "200px", background: "var(--card-bg)" }}
                      onClick={() => setLightboxSrc(pub.thumbnail)}
                    >
                      <Image
                        src={pub.thumbnail}
                        alt={pub.title}
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-[11px] font-mono px-2 py-1 rounded bg-black/60 text-white">
                          Click to zoom
                        </span>
                      </div>
                    </div>
                    {isExpanded && (() => {
                      const m = mascots[pub.id.charCodeAt(0) % 2];
                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.35, delay: 0.2 }}
                          className="hidden md:flex flex-1 flex-col items-center justify-center relative py-3"
                        >
                          <div
                            className="absolute inset-0 rounded-xl"
                            style={{ background: `radial-gradient(ellipse at center, ${m.color}10 0%, transparent 70%)` }}
                          />
                          {/* speech bubble */}
                          <div className="relative mb-1 z-10">
                            <div
                              className="px-3 py-1 rounded-2xl text-[15px]"
                              style={{ background: `${m.color}15`, color: m.color, fontFamily: "var(--font-comic)" }}
                            >
                              {m.slogan}
                            </div>
                            <div
                              className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-[10px] h-[10px] rotate-45"
                              style={{ background: `${m.color}15` }}
                            />
                          </div>
                          {/* character */}
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-0"
                          >
                            <Image
                              src={m.image}
                              alt={m.name}
                              width={300}
                              height={260}
                              className="select-none pointer-events-none"
                              unoptimized
                            />
                          </motion.div>
                          {/* name */}
                          <span className="text-[12px] font-semibold mt-1" style={{ color: m.color }}>
                            — {m.name}
                          </span>
                        </motion.div>
                      );
                    })()}
                  </div>

                  {/* ── Right: content ── */}
                  <div className="flex-1 px-6 py-5 flex flex-col gap-2">
                    {/* venue + rating */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[12.5px] font-semibold" style={{ color: "var(--accent)" }}>
                        ── {pub.venue}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                        / {pub.venueType}
                      </span>
                      {pub.rating && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded font-mono" style={{ color: "var(--foreground)", opacity: 0.5, background: "var(--card-border)" }}>
                          {pub.rating}
                        </span>
                      )}
                    </div>

                    {/* title */}
                    <h3 className="text-[16px] font-bold leading-snug font-mono" style={{ color: "var(--foreground)" }}>
                      {pub.title}
                    </h3>

                    {/* authors */}
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                      {renderAuthors(pub.authors)}
                    </p>

                    {/* badges */}
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      {pub.badges.map((badge) => (
                        <span
                          key={badge}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{
                            color: badge === "Equal Contribution" ? "var(--accent-warm)" : "var(--accent)",
                            background: badge === "Equal Contribution" ? "rgba(249,115,22,0.1)" : "rgba(6,182,212,0.1)",
                            border: badge === "Equal Contribution" ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(6,182,212,0.2)",
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                      {pub.extraBadges?.map((eb) => (
                        <span
                          key={eb}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{ color: "#16a34a", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)" }}
                        >
                          {eb}
                        </span>
                      ))}
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded"
                        style={{ color: sc.text, background: sc.bg }}
                      >
                        {pub.status}
                      </span>
                    </div>

                    {/* action buttons */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="pub-btn"><FileText size={13} /> Paper</span>
                      <span className="pub-btn"><Github size={13} /> Code</span>
                      <span className="pub-btn"><Globe size={13} /> Project</span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                        className="pub-btn"
                      >
                        <ChevronRight
                          size={13}
                          className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        />
                        Abstract
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

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a href="#" className="font-mono text-[13px] transition-colors hover:underline" style={{ color: "var(--accent)" }}>
            View all publications →
          </a>
        </motion.div>
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
