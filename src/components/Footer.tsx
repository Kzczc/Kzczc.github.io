import { personalInfo } from "@/data/profile";

/**
 * Footer — Server Component（无客户端 JS）
 * 包含：Credits / 兴趣 / 签名引用 / 版权
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-10 mt-6" style={{ borderTop: "1px solid var(--card-border)" }}>
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">
        {/* ── 上排：Credit + 兴趣 + 版权 ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* left: credit — ☮️ = peace & love (hip-hop) */}
          <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--muted)" }}>
            <span>Built with</span>
            <span>❤️</span>
            <span>and</span>
            <span title="Peace & Love ☮️">☮️</span>
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
            <span>🎌 Anime</span>
          </div>

          {/* right: copyright */}
          <p className="text-[12px] font-mono" style={{ color: "var(--muted)", opacity: 0.6 }}>
            © {year} {personalInfo.name}. All rights reserved.
          </p>
        </div>

        {/* ── 签名引用 ── */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {/* 渐变分隔线 */}
          <div className="signature-divider" />

          {/* 日文座右铭 — Zen Old Mincho 书法字体 */}
          <p className="signature-quote text-center max-w-2xl px-4">
            正義の女神は法の下の平等のために目を塞ぎ、
            <br className="hidden sm:inline" />
            人々は保身のためなら、あらゆることに目を瞑る。
            <br className="hidden sm:inline" />
            私だけは目を開けていたい。
          </p>

          {/* 出处 — 咒术回战 + 个人感言 */}
          <span
            className="text-[11px] tracking-[0.08em]"
            style={{ color: "var(--muted)", opacity: 0.35, fontFamily: "var(--font-zen), serif" }}
          >
            —— 呪術廻戦
            <span className="ml-2" style={{ opacity: 0.7 }}>
              one of my all-time favorites
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
