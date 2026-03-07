"use client";

import { motion } from "framer-motion";
import { journeyItems } from "@/data/profile";

export default function Journey() {
  return (
    <section id="journey" className="relative py-10">
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
            My Journey
          </span>
        </motion.div>

        {/* Timeline */}
        <div className="relative ml-4">
          {/* vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: "var(--card-border)" }} />

          <div className="flex flex-col gap-8">
            {journeyItems.map((item, i) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative pl-10"
              >
                {/* dot */}
                <div
                  className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 z-10"
                  style={{
                    borderColor: item.isCurrent ? "var(--accent)" : "var(--card-border)",
                    background: item.isCurrent ? "var(--accent)" : "var(--card-bg)",
                  }}
                >
                  {item.isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--accent)", opacity: 0.3 }} />
                  )}
                </div>

                {/* period + org */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded"
                    style={{
                      color: item.isCurrent ? "var(--accent)" : "var(--accent-warm)",
                      background: item.isCurrent ? "rgba(6,182,212,0.1)" : "rgba(249,115,22,0.1)",
                    }}
                  >
                    {item.period}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--muted)" }}>
                    / {item.org}
                  </span>
                </div>

                {/* title */}
                <h3 className="text-[15px] font-bold leading-snug font-mono mb-1" style={{ color: "var(--foreground)" }}>
                  {item.title}
                </h3>

                {/* description */}
                <p className="text-[13px] leading-[1.7] text-justify" style={{ color: "var(--muted)" }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* View all */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pl-10 mt-6"
          >
            <a href="#" className="font-mono text-[13px] transition-colors hover:underline" style={{ color: "var(--accent)" }}>
              View all experience →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
