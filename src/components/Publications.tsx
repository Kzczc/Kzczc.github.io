"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronRight, FileText, Github, Globe } from "lucide-react";
import { selectedPublications } from "@/data/profile";

/* ── highlight "Yuhe Wu" in author string ── */
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

const statusColors: Record<string, { text: string; bg: string }> = {
  green:  { text: "#16a34a", bg: "#16a34a15" },
  blue:   { text: "#2563eb", bg: "#2563eb15" },
  orange: { text: "#ea580c", bg: "#ea580c15" },
};

export default function Publications() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                  {/* ── Left: thumbnail — object-contain + white bg for paper figures ── */}
                  <div
                    className="relative w-full md:w-[300px] lg:w-[340px] flex-shrink-0 overflow-hidden"
                    style={{ minHeight: "200px", background: "#fff" }}
                  >
                    <Image
                      src={pub.thumbnail}
                      alt={pub.title}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>

                  {/* ── Right: content — 新罗马体 ── */}
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

                    {/* title — 新罗马体 */}
                    <h3 className="text-[16px] font-bold leading-snug font-mono" style={{ color: "var(--foreground)" }}>
                      {pub.title}
                    </h3>

                    {/* authors — sans-serif, darker color */}
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
                          <p
                            className="text-[13px] leading-[1.75] mt-2 pt-3 text-justify"
                            style={{ color: "var(--muted)", borderTop: "1px dashed var(--card-border)" }}
                          >
                            Abstract coming soon. Check back later or contact me for the preprint.
                          </p>
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
    </section>
  );
}
