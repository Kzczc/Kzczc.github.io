import { ImageResponse } from "next/og";

/**
 * OG Image — Next.js 自动生成 1200×630 的社交分享封面图
 * 访问 /opengraph-image 可直接预览
 */
export const runtime = "edge";
export const alt = "Yuhe Wu (Kc.) — LLM × Finance Researcher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111318 50%, #0a0a0a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 顶部装饰条 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #f38ba8, #f9e2af, #a6e3a1, #89b4fa, #cba6f7, #f38ba8)",
          }}
        />

        {/* 名字 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            background: "linear-gradient(135deg, #22d3ee, #fb923c)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          Yuhe Wu (Kc.)
        </div>

        {/* 身份 */}
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 16,
            letterSpacing: "0.05em",
          }}
        >
          LLM × Finance Researcher
        </div>

        {/* 分隔线 */}
        <div
          style={{
            width: 120,
            height: 2,
            background: "linear-gradient(90deg, transparent, #22d3ee, #fb923c, transparent)",
            marginTop: 28,
            marginBottom: 28,
          }}
        />

        {/* 学校 */}
        <div
          style={{
            fontSize: 22,
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>HKUST(GZ) Fintech PhD Incoming</span>
          <span style={{ color: "#334155" }}>·</span>
          <span>DUFE</span>
        </div>

        {/* 底部终端提示 */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            color: "#334155",
            fontFamily: "monospace",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#22d3ee" }}>$</span>
          <span>kzczc-github-io.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
