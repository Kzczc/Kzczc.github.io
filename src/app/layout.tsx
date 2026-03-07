import type { Metadata } from "next";
import { Libre_Baskerville, Fira_Code } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Yuhe Wu | LLM × Finance Researcher",
  description:
    "Personal homepage of Yuhe Wu. Research on Large Language Models in Finance, LLM evaluation, agent cognition, and applied AI.",
  keywords: [
    "Yuhe Wu",
    "LLM",
    "Finance",
    "NLP",
    "HKUST",
    "DUFE",
    "Machine Learning",
  ],
  authors: [{ name: "Yuhe Wu" }],
  icons: { icon: "/images/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${baskerville.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
