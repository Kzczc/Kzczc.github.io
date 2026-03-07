"use client";

import { personalInfo } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-10 mt-6" style={{ borderTop: "1px solid var(--card-border)" }}>
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* left: credit */}
          <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--muted)" }}>
            <span>Built with</span>
            <span>❤️</span>
            <span>and</span>
            <span>🕊️</span>
            <span>by</span>
            <a
              href={`https://github.com/${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Kc.
            </a>
          </div>

          {/* center: hobbies */}
          <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--muted)" }}>
            <span>🎸 Guitar</span>
            <span>·</span>
            <span>🎤 Hip-hop</span>
            <span>·</span>
            <span>🏸 Badminton</span>
          </div>

          {/* right: copyright */}
          <p className="text-[12px] font-mono" style={{ color: "var(--muted)", opacity: 0.6 }}>
            © {year} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
