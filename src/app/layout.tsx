import type { Metadata } from "next";
import { Libre_Baskerville, Fira_Code, Zen_Old_Mincho } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/providers/ThemeProvider";
import "./globals.css";

/* Libre Baskerville — 优雅的新罗马风格衬线体，学术感强 */
const baskerville = Libre_Baskerville({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Fira Code — 优雅等宽字体，带连字 */
const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/* Zen Old Mincho — 日文书法字体，用于 Footer 签名 */
const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kzczc.github.io"),
  title: "Yuhe Wu (Kc.) | Homepage",
  description:
    "Personal homepage of Yuhe Wu (Kc.). Research on Large Language Models in Finance, LLM evaluation, agent cognition, and applied AI. HKUST(GZ) Fintech PhD Incoming.",
  keywords: [
    "Yuhe Wu",
    "Kc.",
    "LLM",
    "Finance",
    "NLP",
    "HKUST",
    "HKUST(GZ)",
    "DUFE",
    "Machine Learning",
    "Fintech",
    "Agent Cognition",
  ],
  authors: [{ name: "Yuhe Wu" }],
  icons: { icon: "/images/paint.png" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kzczc.github.io",
    siteName: "Yuhe Wu (Kc.)",
    title: "Yuhe Wu (Kc.) — LLM × Finance Researcher",
    description:
      "HKUST(GZ) Fintech PhD Incoming. Research on LLM evaluation, agent cognition, and AI for financial decision-making.",
    images: [
      {
        url: "/images/my_picture.png",
        width: 800,
        height: 800,
        alt: "Yuhe Wu (Kc.)",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Yuhe Wu (Kc.) | Homepage",
    description: "LLM × Finance Researcher · HKUST(GZ) PhD Incoming",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${baskerville.variable} ${firaCode.variable} ${zenOldMincho.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
