"use client";

import { motion } from "framer-motion";
import { awards, reviewerService } from "@/data/profile";

/* category → emoji + color */
const catConfig: Record<string, { emoji: string; color: string }> = {
  GRANT:       { emoji: "🎖️", color: "#f59e0b" },
  SCHOLARSHIP: { emoji: "🏅", color: "#8b5cf6" },
  HONOR:       { emoji: "⭐", color: "#06b6d4" },
  COMPETITION: { emoji: "🏆", color: "#ef4444" },
};

export default function Awards() {
  const totalAwards = awards.length;
  const categories = [...new Set(awards.map((a) => a.category))].length;

  return (
    <section id="awards" className="relative py-10">
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-2"
        >
          <span className="section-dash text-[1.4rem] font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Awards & Honors
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[13px] mb-6 ml-1"
          style={{ color: "var(--muted)" }}
        >
          {totalAwards} awards spanning {categories} categories
        </motion.p>

        {/* Awards list */}
        <div className="flex flex-col">
          {awards.map((award, i) => {
            const cat = catConfig[award.category] || catConfig.HONOR;
            return (
              <motion.div
                key={`${award.title}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-start justify-between py-3 gap-4"
                style={{ borderBottom: "1px solid var(--card-border)" }}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-[16px] mt-0.5 flex-shrink-0">{cat.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[14px] leading-snug" style={{ color: "var(--foreground)" }}>
                      {award.title}
                    </p>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
                      {award.org}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[12px]" style={{ color: "var(--muted)" }}>
                    {award.date}
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono"
                    style={{ color: cat.color, background: `${cat.color}15` }}
                  >
                    {award.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reviewer Service */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-10"
        >
          <span className="section-dash text-[1.2rem] font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Reviewer Service
          </span>
          <div className="flex flex-wrap gap-2.5 mt-5">
            {reviewerService.map((venue) => (
              <span
                key={venue}
                className="text-[12px] px-3 py-1.5 rounded-lg border font-mono"
                style={{ color: "var(--muted)", borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              >
                📝 {venue}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
