"use client";

import { Fragment, useCallback, useMemo, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import FigureLightbox from "@/components/FigureLightbox";
import { publicationThemes, selectedPublications } from "@/data/profile";

type Publication = (typeof selectedPublications)[number];
type Theme = (typeof publicationThemes)[number];
type View = "selected" | "all";

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
type Mascot = (typeof mascots)[number];

const statusColors: Record<string, { text: string; bg: string }> = {
  green:  { text: "var(--status-green)", bg: "#16a34a15" },
  blue:   { text: "var(--status-blue)", bg: "#2563eb15" },
  orange: { text: "#ea580c", bg: "#ea580c15" },
  gray:   { text: "#64748b", bg: "#64748b15" },
};

const SELECTED_MANUSCRIPT_IDS = [
  "prism",
  "bizsage",
  "narrative-captivity",
  "bizcompass",
  "headwater",
  "aaai-cor2",
  "packrank",
  "identity-structure",
  "generative-agent",
  "iclr-ci",
];

/* Figures taller than the 2:1 preview frame are cropped from the top instead of shrunk. */
const TALL_FIGURE_IDS = new Set(["aaai-cor2"]);

/* Inside a theme: accepted work first, then first-author before co-first before
   corresponding before contributing, then papers with a positive review signal,
   then CCF-A / CORE-A* venues, then file order. */
function statusRank(status: string) {
  if (status === "Accepted" || status === "Published") return 0;
  if (status.startsWith("Under Review")) return 1;
  if (status === "Preprint") return 2;
  return 3;
}

function roleRank(badges: readonly string[]) {
  if (badges.includes("First Author")) return 0;
  if (badges.includes("Co-First Author")) return 1;
  if (badges.includes("Corresponding Author")) return 2;
  return 3;
}

function tierRank(rating: string) {
  if (/CCF A|CORE A\*/.test(rating)) return 0;
  return rating ? 1 : 2;
}

function groupByTheme(pubs: readonly Publication[]) {
  return publicationThemes
    .map((theme) => ({
      theme,
      papers: pubs
        .map((pub, order) => ({ pub, order }))
        .filter(({ pub }) => pub.theme === theme.id)
        .sort(
          (a, b) =>
            statusRank(a.pub.status) - statusRank(b.pub.status) ||
            roleRank(a.pub.badges) - roleRank(b.pub.badges) ||
            Number(b.pub.extraBadges.length > 0) - Number(a.pub.extraBadges.length > 0) ||
            tierRank(a.pub.rating) - tierRank(b.pub.rating) ||
            a.order - b.order
        )
        .map(({ pub }) => pub),
    }))
    .filter((group) => group.papers.length > 0);
}

const themeColorStyle = (theme: Theme) =>
  ({ "--theme-color": theme.color, "--theme-color-to": theme.colorTo }) as CSSProperties;

/* ── small building blocks ── */

function ThemeHeading({ theme, count }: { theme: Theme; count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <h3
        className="inline-flex items-center gap-2.5 text-[15.5px] font-bold"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}
      >
        <span aria-hidden className="pub-theme-dot" style={themeColorStyle(theme)} />
        {theme.label}
      </h3>
      <span className="pub-theme-tagline" style={themeColorStyle(theme)}>
        <span aria-hidden className="pub-theme-slashes">{"//"}</span>
        <span className="pub-theme-glow">
          <span className="pub-theme-tagline-text">{theme.tagline}</span>
        </span>
      </span>
      <span className="ml-auto font-mono text-[11.5px] tabular-nums" style={{ color: "var(--muted)" }}>
        {count} {count === 1 ? "paper" : "papers"}
      </span>
    </div>
  );
}

function PaperVenue({ pub }: { pub: Publication }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-[12.5px]" style={{ fontFamily: "var(--font-sans)" }}>
      <span className="italic font-semibold" style={{ color: "var(--accent)" }}>{pub.venue}</span>
      {pub.rating &&
        pub.rating.split(", ").map((r) => {
          const isTop = r.includes("A") || r.includes("Q1");
          return (
            <span
              key={r}
              className="text-[10px] px-1.5 py-0.5 rounded-sm not-italic font-semibold"
              style={{
                color: "var(--violet-text)",
                background: isTop ? "rgba(167,139,250,0.08)" : "rgba(196,181,253,0.06)",
                border: isTop ? "1px solid rgba(167,139,250,0.2)" : "1px solid rgba(196,181,253,0.15)",
              }}
            >
              {r}
            </span>
          );
        })}
    </span>
  );
}

function PaperBadges({ pub }: { pub: Publication }) {
  const sc = statusColors[pub.statusColor] || statusColors.blue;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5" style={{ fontFamily: "var(--font-sans)" }}>
      {pub.badges.map((badge) => {
        const warm = badge === "Equal Contribution" || badge === "Co-First Author";
        return (
          <span
            key={badge}
            className="pub-chip"
            style={{
              color: warm ? "var(--accent-warm)" : "var(--accent)",
              background: warm ? "rgba(249,115,22,0.1)" : "rgba(6,182,212,0.1)",
              border: warm ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(6,182,212,0.2)",
            }}
          >
            {badge}
          </span>
        );
      })}
      {pub.extraBadges.map((eb) => (
        <span
          key={eb}
          className="pub-chip"
          style={{ color: "#16a34a", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)" }}
        >
          {eb}
        </span>
      ))}
      <span className="pub-chip" style={{ color: sc.text, background: sc.bg }}>{pub.status}</span>
    </span>
  );
}

function PaperLinks({ pub, onZoom }: { pub: Publication; onZoom?: ZoomHandler }) {
  const links = [
    pub.links?.paper && { href: pub.links.paper, label: pub.links.paper.includes("arxiv") ? "ArXiv" : "Paper" },
    pub.links?.poster && { href: pub.links.poster, label: "Poster" },
    pub.links?.code && { href: pub.links.code, label: "Code" },
    pub.links?.website && { href: pub.links.website, label: "Website" },
    pub.links?.project && { href: pub.links.project, label: "Project" },
  ].filter(Boolean) as { href: string; label: string }[];
  const canZoom = onZoom && pub.thumbnail;
  if (links.length === 0 && !canZoom) return null;
  const actionStyle = { color: "var(--action-text)", fontFamily: "var(--font-sans)" };
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-action hover:underline text-[12.5px]"
          style={actionStyle}
        >
          [{link.label}]
        </a>
      ))}
      {canZoom && (
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => onZoom(pub, event.currentTarget)}
          className="inline-action hover:underline text-[12.5px] cursor-zoom-in"
          style={actionStyle}
        >
          [Enlarge Figure]
        </button>
      )}
    </span>
  );
}

function MascotPanel({ mascot }: { mascot: Mascot }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="hidden lg:flex flex-1 flex-col items-center justify-center relative p-4 pub-mascot-panel"
    >
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${mascot.color}20 0%, transparent 65%)` }}
      />
      <div className="relative mb-1.5 z-10">
        <div
          className="px-3.5 py-1.5 rounded-2xl text-[15px] whitespace-nowrap"
          style={{ background: `${mascot.color}15`, color: mascot.color, fontFamily: "var(--font-comic)" }}
        >
          {mascot.slogan} <span className="text-[11px] opacity-60">— {mascot.name}</span>
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-[10px] h-[10px] rotate-45"
          style={{ background: `${mascot.color}15` }}
        />
      </div>
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-0"
      >
        <Image src={mascot.image} alt={mascot.name} width={190} height={161} className="select-none pointer-events-none" unoptimized />
      </motion.div>
    </motion.div>
  );
}

type ZoomHandler = (pub: Publication, trigger: HTMLButtonElement) => void;

function PaperAbstract({ pub }: { pub: Publication }) {
  return (
    <div className="text-[13px] leading-[1.75] text-justify" style={{ color: "var(--muted)" }}>
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
  );
}

const authorsStyle = { color: "var(--muted)", fontFamily: "var(--font-sans)" };

/* Selected view: what the compact card leaves out (full authors, links, abstract). */
function PaperPanel({
  pub,
  mascot,
  onZoom,
  onCollapse,
}: {
  pub: Publication;
  mascot: Mascot;
  onZoom: ZoomHandler;
  onCollapse: () => void;
}) {
  return (
    <div id={`paper-detail-${pub.id}`} className="flex flex-col lg:flex-row">
      {/* The mascots point to their right, so they sit left of the text they introduce. */}
      <div className="hidden lg:flex lg:w-[300px] flex-shrink-0" style={{ borderRight: "1px dashed var(--card-border)" }}>
        <MascotPanel mascot={mascot} />
      </div>
      <div className="paper-content min-w-0 flex-1 px-5 py-5 sm:px-7 sm:py-6 flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[13.5px] leading-relaxed italic" style={authorsStyle}>
            {renderAuthors(pub.authors)}
          </p>
          <button type="button" onClick={onCollapse} aria-expanded aria-controls={`paper-detail-${pub.id}`} className="pub-collapse">
            <ChevronDown size={16} className="rotate-180" aria-hidden />
            <span className="sr-only">Collapse {pub.title}</span>
          </button>
        </div>
        <PaperLinks pub={pub} onZoom={onZoom} />
        <div className="pt-3.5" style={{ borderTop: "1px dashed var(--card-border)" }}>
          <PaperAbstract pub={pub} />
        </div>
      </div>
    </div>
  );
}

/* All view: the row already shows title and venue, so add figure, authors, links, abstract. */
function PaperRowDetail({ pub, mascot, onZoom }: { pub: Publication; mascot: Mascot; onZoom: ZoomHandler }) {
  return (
    <div id={`paper-detail-${pub.id}`} className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-[46%] flex flex-shrink-0 flex-col">
        {pub.thumbnail && (
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`Enlarge figure: ${pub.title}`}
            className={`pub-figure-frame relative w-full cursor-zoom-in group ${pub.id === "aaai-cor2" ? "pub-figure-tall" : "aspect-[2/1]"}`}
            onClick={(event) => onZoom(pub, event.currentTarget)}
          >
            <Image
              src={pub.thumbnail}
              alt={pub.title}
              fill
              sizes="(min-width: 1280px) 544px, (min-width: 1024px) 46vw, 100vw"
              className="object-contain p-2.5"
              unoptimized
            />
            <span className="figure-zoom-hint">
              <span className="text-[11px] font-mono">Click to zoom</span>
            </span>
          </button>
        )}
        <MascotPanel mascot={mascot} />
      </div>
      <div className="paper-content min-w-0 flex-1 px-5 py-5 sm:px-6 flex flex-col gap-3">
        <p className="text-[13.5px] leading-relaxed italic" style={authorsStyle}>
          {renderAuthors(pub.authors)}
        </p>
        <PaperLinks pub={pub} />
        <div className="pt-3" style={{ borderTop: "1px dashed var(--card-border)" }}>
          <PaperAbstract pub={pub} />
        </div>
      </div>
    </div>
  );
}

/* Selected view: compact card that opens a full-width detail panel below its row. */
function PaperCard({
  pub,
  wide,
  active,
  order,
  onToggle,
}: {
  pub: Publication;
  wide: boolean;
  active: boolean;
  order: number;
  onToggle: () => void;
}) {
  const tall = TALL_FIGURE_IDS.has(pub.id);
  return (
    <article
      id={`paper-${pub.id}`}
      data-glow
      data-active={active}
      className={`glow-surface paper-card pub-card card-hover rounded-xl border overflow-hidden ${wide ? "md:col-span-2" : ""}`}
      style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", order }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={active}
        aria-controls={`paper-detail-${pub.id}`}
        aria-label={`${pub.title}: ${active ? "hide" : "show"} details`}
        className={`pub-card-summary flex h-full w-full text-left ${wide ? "flex-col lg:flex-row" : "flex-col"}`}
      >
        {pub.thumbnail && (
          <span className={`pub-figure-frame relative block w-full ${wide ? "aspect-[2/1] lg:aspect-auto lg:w-[46%] lg:min-h-[210px]" : "aspect-[2/1]"}`}>
            <Image
              src={pub.thumbnail}
              alt=""
              fill
              sizes={wide ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 768px) 600px, 100vw"}
              className={tall ? "object-cover object-top" : "object-contain p-2.5"}
              unoptimized
            />
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col gap-2.5 px-5 py-4 sm:px-6 justify-center">
          <PaperVenue pub={pub} />
          <span className="text-[15.5px] font-bold leading-snug" style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>
            {pub.title}
          </span>
          <span className="text-[12.5px] leading-relaxed italic line-clamp-2" style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
            {renderAuthors(pub.authors)}
          </span>
          <span className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-1">
            <PaperBadges pub={pub} />
            <span className="pub-expand-hint">
              {active ? "Close" : "Details"}
              <ChevronDown size={14} aria-hidden />
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}

/* All view: one line per paper inside its theme list; expands in place. */
function PaperRow({
  pub,
  theme,
  active,
  mascot,
  onToggle,
  onZoom,
}: {
  pub: Publication;
  theme: Theme;
  active: boolean;
  mascot: Mascot;
  onToggle: () => void;
  onZoom: ZoomHandler;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <article id={`paper-${pub.id}`} data-active={active} className="paper-card pub-row">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={active}
        aria-controls={`paper-detail-${pub.id}`}
        aria-label={`${pub.title}: ${active ? "hide" : "show"} details`}
        className="pub-row-summary flex w-full items-start gap-3.5 px-4 py-3.5 text-left sm:px-5"
      >
        <span aria-hidden className="pub-theme-dot mt-[7px]" style={themeColorStyle(theme)} />
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-bold leading-snug" style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>
            {pub.title}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <PaperVenue pub={pub} />
            <PaperBadges pub={pub} />
          </span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className={`mt-1 flex-shrink-0 transition-transform duration-300 ${active ? "rotate-180" : ""}`}
          style={{ color: active ? "var(--accent)" : "var(--muted)" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="detail"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pub-row-detail">
              <PaperRowDetail pub={pub} mascot={mascot} onZoom={onZoom} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function Publications() {
  const [view, setView] = useState<View>("selected");
  const [themeFilter, setThemeFilter] = useState<Theme["id"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; title: string; trigger: HTMLButtonElement } | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const reducedMotion = useReducedMotion();

  const selectedGroups = useMemo(
    () => groupByTheme(selectedPublications.filter((p) => SELECTED_MANUSCRIPT_IDS.includes(p.id))),
    []
  );
  const allGroups = useMemo(() => groupByTheme(selectedPublications), []);
  const groups =
    view === "selected"
      ? selectedGroups
      : allGroups.filter((group) => themeFilter === "all" || group.theme.id === themeFilter);
  const visibleCount = groups.reduce((sum, group) => sum + group.papers.length, 0);

  const toggle = useCallback(
    (id: string) => {
      setExpandedId((current) => (current === id ? null : id));
      // keep the opened paper in view once the panel has finished animating
      window.setTimeout(() => {
        const el = document.getElementById(`paper-${id}`);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top < 72 || top > window.innerHeight * 0.55) {
          el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        }
      }, 340);
    },
    [reducedMotion]
  );
  const zoom = useCallback<ZoomHandler>(
    (pub, trigger) => setLightbox({ src: pub.thumbnail, title: pub.title, trigger }),
    []
  );
  const switchView = (next: View) => {
    setView(next);
    setExpandedId(null);
  };

  return (
    <section id="publications" className="relative py-10">
      <div className="site-container mx-auto max-w-[1280px] px-8 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="section-dash text-[1.4rem] font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Publications
          </span>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-3 -mt-3">
          {(
            [
              ["selected", "Selected"],
              ["all", "All Papers"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              aria-pressed={view === id}
              onClick={() => switchView(id)}
              className="pub-tab text-[12.5px] px-4 py-1.5 rounded-full transition-all"
              style={{
                color: view === id ? "var(--on-accent)" : "var(--muted)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                background: view === id ? "var(--accent)" : "transparent",
                border: "1px solid var(--card-border)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Theme filter (All view) */}
        <AnimatePresence initial={false}>
          {view === "all" && (
            <motion.div
              key="filters"
              initial={reducedMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2 pb-3 pt-1" role="group" aria-label="Filter papers by research theme">
                {[{ id: "all" as const, label: "All themes", count: selectedPublications.length }, ...allGroups.map((g) => ({ id: g.theme.id, label: g.theme.label, count: g.papers.length, theme: g.theme }))].map(
                  (chip) => {
                    const pressed = themeFilter === chip.id;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => {
                          setThemeFilter(chip.id);
                          setExpandedId(null);
                        }}
                        className="pub-filter-chip"
                      >
                        {"theme" in chip && <span aria-hidden className="pub-theme-dot" style={themeColorStyle(chip.theme)} />}
                        {chip.label}
                        <span className="tabular-nums opacity-70">{chip.count}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap" style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
          <p className="text-[12.5px]">* equal contribution · † corresponding author</p>
          <span className="text-[12px] tabular-nums">
            {visibleCount} {view === "selected" ? "selected manuscripts" : visibleCount === 1 ? "paper" : "papers"}
          </span>
        </div>

        {/* Theme groups */}
        <div className="flex flex-col gap-10">
          {groups.map((group, groupIndex) => (
            <motion.div
              key={`${view}-${group.theme.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ duration: 0.4, delay: Math.min(groupIndex, 2) * 0.04 }}
              className="flex flex-col gap-4"
            >
              <ThemeHeading theme={group.theme} count={group.papers.length} />

              {view === "selected" ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {group.papers.map((pub, i) => {
                    const wide = group.papers.length % 2 === 1 && i === group.papers.length - 1;
                    const active = expandedId === pub.id;
                    // the detail panel sits right after the card on phones and after the card's row on desktop
                    const rowEnd = wide ? i : i - (i % 2) + 1;
                    return (
                      <Fragment key={pub.id}>
                        <PaperCard pub={pub} wide={wide} active={active} order={i * 2} onToggle={() => toggle(pub.id)} />
                        <AnimatePresence initial={false}>
                          {active && (
                            <motion.div
                              key={`detail-${pub.id}`}
                              initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
                              transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                              className="pub-detail-panel md:col-span-2 overflow-hidden"
                              style={{ "--order-sm": i * 2 + 1, "--order-md": Math.min(rowEnd, group.papers.length - 1) * 2 + 1 } as CSSProperties}
                            >
                              <div
                                data-glow
                                className="glow-surface pub-detail-card rounded-xl border overflow-hidden"
                                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                              >
                                <PaperPanel pub={pub} mascot={mascots[i % 2]} onZoom={zoom} onCollapse={() => toggle(pub.id)} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}
                </div>
              ) : (
                <div
                  data-glow
                  className="glow-surface rounded-xl border overflow-hidden"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                >
                  {group.papers.map((pub, i) => (
                    <PaperRow
                      key={pub.id}
                      pub={pub}
                      theme={group.theme}
                      active={expandedId === pub.id}
                      mascot={mascots[i % 2]}
                      onToggle={() => toggle(pub.id)}
                      onZoom={zoom}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox && <FigureLightbox {...lightbox} onClose={closeLightbox} />}
    </section>
  );
}
