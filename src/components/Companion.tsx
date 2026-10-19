"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  Coffee,
  Heart,
  Lightbulb,
  Minus,
  Moon,
  Orbit,
  Pin,
  Sparkles,
  X,
} from "lucide-react";
import {
  companionLines,
  companionPoses,
  companionSections,
  poseSource,
  type CompanionPose,
} from "@/data/companion";
import "./companion.css";

type Point = { x: number; y: number };
type Preferences = {
  version: 1;
  automatic: boolean;
  quiet: boolean;
  minimized: boolean;
  placement: Point | null;
};
type Bubble = { text: string; kind: "ambient" | "user" };
type Action = "papers" | "pat" | "coffee" | "idea";
const storageKey = "kc-companion-v1";
const ease = [0.22, 1, 0.36, 1] as const;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const defaultPreferences: Preferences = {
  version: 1,
  automatic: true,
  quiet: false,
  minimized: false,
  placement: null,
};

function readPreferences(): Preferences {
  const fallback = {
    ...defaultPreferences,
    minimized: window.innerWidth < 768,
  };
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (stored?.version !== 1) return fallback;
    const p = stored.placement;
    return {
      version: 1,
      automatic:
        typeof stored.automatic === "boolean" ? stored.automatic : true,
      quiet: typeof stored.quiet === "boolean" ? stored.quiet : false,
      minimized:
        typeof stored.minimized === "boolean"
          ? stored.minimized
          : fallback.minimized,
      placement:
        p && Number.isFinite(p.x) && Number.isFinite(p.y)
          ? { x: clamp(p.x, 0, 1), y: clamp(p.y, 0, 1) }
          : null,
    };
  } catch {
    return fallback;
  }
}

function ComicText({ text }: { text: string }) {
  return text
    .split(
      /(陪你一起找找灵感，|也陪你抱着小熊慢慢放空|\p{Extended_Pictographic}\uFE0F?)/u,
    )
    .map((part, index) => {
      if (/\p{Extended_Pictographic}/u.test(part))
        return (
          <span className="companion-emoji" key={index}>
            {part}
          </span>
        );
      if (part === "陪你一起找找灵感，" || part === "也陪你抱着小熊慢慢放空")
        return (
          <span className="companion-phrase" key={index}>
            {part}
          </span>
        );
      return part;
    });
}

function IconButton({
  label,
  children,
  ...props
}: { label: string; children: ReactNode } & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>) {
  return (
    <button type="button" {...props} aria-label={label} data-tip={label}>
      {children}
    </button>
  );
}

function Speech({
  bubble,
  id,
  onClose,
  onAction,
  onHover,
  onMeasure,
  register,
  reduced,
}: {
  bubble: Bubble;
  id: string;
  onClose: () => void;
  onAction: (action: Action) => void;
  onHover: (value: boolean) => void;
  onMeasure: () => void;
  register: (element: HTMLDivElement | null) => void;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const present = useIsPresent();
  useLayoutEffect(() => {
    register(ref.current);
    const observer = new ResizeObserver(onMeasure);
    if (ref.current) observer.observe(ref.current);
    onMeasure();
    return () => {
      observer.disconnect();
      register(null);
    };
  }, [onMeasure, register]);
  return (
    <motion.div
      ref={ref}
      id={id}
      className="companion-bubble"
      role="region"
      aria-label="小向导的对话"
      inert={!present}
      aria-hidden={!present}
      data-kind={bubble.kind}
      initial={{ opacity: 0, scale: 0.97, y: 7 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 7 }}
      transition={{ duration: reduced ? 0 : present ? 0.28 : 0.24, ease }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <div className="companion-bubble-header">
        <span>
          <i aria-hidden="true" />
          COMPANION / {bubble.kind === "user" ? "LISTENING" : "WITH YOU"}
        </span>
        <IconButton label="收起对话" onClick={onClose}>
          <X size={14} aria-hidden="true" />
        </IconButton>
      </div>
      <p className="companion-speech" aria-live="polite" aria-atomic="true">
        <ComicText text={bubble.text} />
      </p>
      {bubble.kind === "user" && (
        <div className="companion-actions">
          <IconButton
            label="看看论文"
            data-action="papers"
            onClick={() => onAction("papers")}
          >
            <BookOpen size={18} aria-hidden="true" />
          </IconButton>
          <IconButton
            label="摸摸头"
            data-action="pat"
            onClick={() => onAction("pat")}
          >
            <Heart size={18} aria-hidden="true" />
          </IconButton>
          <IconButton
            label="投喂咖啡"
            data-action="coffee"
            onClick={() => onAction("coffee")}
          >
            <Coffee size={18} aria-hidden="true" />
          </IconButton>
          <IconButton
            label="来点灵感"
            data-action="idea"
            onClick={() => onAction("idea")}
          >
            <Lightbulb size={18} aria-hidden="true" />
          </IconButton>
        </div>
      )}
    </motion.div>
  );
}

export default function Companion() {
  const reduced = !!useReducedMotion();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const actor = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusOnReveal = useRef(false);
  const speech = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [pose, setPose] = useState<CompanionPose>("wave");
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [dragging, setDragging] = useState(false);
  const [reaction, setReaction] = useState(0);
  const x = useMotionValue(0),
    y = useMotionValue(0),
    lean = useMotionValue(0);
  const state = useRef({
    preferences: defaultPreferences,
    bubble: null as Bubble | null,
    pose: "wave" as CompanionPose,
    elapsed: 0,
    expires: 0,
    lastSpeech: -60000,
    nextPose: 10000,
    nextMove: 18000,
    holdUntil: 0,
    lastScroll: -5000,
    lastScrollY: 0,
    scrollOffset: 0,
    section: "home",
    pendingSection: "home" as string | null,
    blocked: false,
    hidden: false,
    hovered: false,
    bubbleHovered: false,
    focused: false,
    exiting: false,
    wander: { x: 0, y: 0 },
    moveIndex: 0,
    poseIndex: 0,
    energyUntil: 0,
    drag: null as null | {
      id: number;
      start: Point;
      origin: Point;
      moved: boolean;
    },
    suppressClick: false,
    bounds: {
      left: 12,
      top: 96,
      right: 1200,
      bottom: 600,
      width: 1280,
      height: 800,
    },
    size: { width: 128, height: 166 },
    target: { x: -1, y: -1 },
    animations: [] as Array<{ stop: () => void }>,
    decoded: new Map<CompanionPose, Promise<boolean>>(),
    poseVersion: 0,
    counts: { pat: 0, coffee: 0, idea: 0 },
    mounted: false,
  });

  const persist = useCallback((next: Preferences) => {
    state.current.preferences = next;
    setPrefs(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* Preferences are optional. */
    }
  }, []);
  const stop = useCallback(() => {
    state.current.animations.forEach((animation) => animation.stop());
    lean.stop();
    lean.set(0);
  }, [lean]);
  const constrain = useCallback((point: Point) => {
    const b = state.current.bounds;
    return {
      x: clamp(point.x, b.left, b.right),
      y: clamp(point.y, b.top, b.bottom),
    };
  }, []);
  const basePoint = useCallback(() => {
    const { bounds: b, preferences: p } = state.current;
    return p.placement
      ? {
          x: b.left + (b.right - b.left) * p.placement.x,
          y: b.top + (b.bottom - b.top) * p.placement.y,
        }
      : { x: b.right, y: Math.max(b.top, b.bottom - 35) };
  }, []);
  const placeSpeech = useCallback(() => {
    const panel = speech.current;
    if (!panel) return;
    const s = state.current,
      b = s.bounds,
      width = panel.offsetWidth,
      height = panel.offsetHeight;
    const left = clamp(
      x.get() + s.size.width / 2 - width / 2,
      b.left,
      b.width - width - 12,
    );
    const above = y.get() - height - 10;
    const top =
      above >= b.top
        ? above
        : clamp(y.get() + s.size.height + 8, b.top, b.height - height - 16);
    panel.style.left = `${left - x.get()}px`;
    panel.style.top = `${top - y.get()}px`;
    panel.style.transformOrigin = `${clamp(x.get() + s.size.width / 2 - left, 20, width - 20)}px ${above >= b.top ? "100%" : "0%"}`;
  }, [x, y]);
  useMotionValueEvent(x, "change", placeSpeech);
  useMotionValueEvent(y, "change", placeSpeech);
  const registerSpeech = useCallback((element: HTMLDivElement | null) => {
    speech.current = element;
  }, []);
  const move = useCallback(
    (destination: Point, immediate = false) => {
      const point = constrain(destination),
        s = state.current;
      if (
        Math.abs(s.target.x - point.x) < 0.5 &&
        Math.abs(s.target.y - point.y) < 0.5
      )
        return;
      stop();
      s.target = point;
      if (immediate || reduced) {
        x.set(point.x);
        y.set(point.y);
        return;
      }
      const tilt = clamp(
        (point.x - x.get()) * 0.05 + (point.y - y.get()) * 0.025,
        -3,
        3,
      );
      s.animations = [
        animate(x, point.x, { duration: 1.4, ease }),
        animate(y, point.y, { duration: 1.4, ease }),
        animate(lean, [0, tilt, 0], { duration: 1.4, ease }),
      ];
    },
    [constrain, lean, reduced, stop, x, y],
  );
  const measure = useCallback(() => {
    const s = state.current;
    const width = document.documentElement.clientWidth;
    const height = window.visualViewport?.height || window.innerHeight;
    s.size = {
      width: actor.current?.offsetWidth || 128,
      height: actor.current?.offsetHeight || 166,
    };
    s.bounds = {
      left: 10,
      top: Math.min(92, height / 4),
      right: Math.max(10, width - s.size.width - 12),
      bottom: Math.max(92, height - s.size.height - 84),
      width,
      height,
    };
    s.wander = { x: 0, y: 0 };
    s.target = { x: -1, y: -1 };
    move(basePoint(), true);
    placeSpeech();
  }, [basePoint, move, placeSpeech]);
  const changePose = useCallback(async (next: CompanionPose) => {
    const s = state.current;
    if (next === s.pose) return;
    const version = ++s.poseVersion;
    if (!s.decoded.has(next)) {
      const image = new window.Image();
      image.src = poseSource(next);
      s.decoded.set(
        next,
        image.decode().then(
          () => true,
          () => false,
        ),
      );
    }
    const loaded = await s.decoded.get(next);
    if (loaded && s.mounted && version === s.poseVersion) {
      s.pose = next;
      setPose(next);
    }
  }, []);
  const closeBubble = useCallback((restoreFocus = false) => {
    const s = state.current;
    if (!s.bubble) return;
    if (restoreFocus || speech.current?.contains(document.activeElement))
      trigger.current?.focus({ preventScroll: true });
    s.bubble = null;
    s.exiting = true;
    s.bubbleHovered = false;
    s.holdUntil = s.elapsed + 1300;
    setBubble(null);
  }, []);
  const showBubble = useCallback(
    (text: string, kind: Bubble["kind"], next?: CompanionPose) => {
      const s = state.current;
      const message = { text, kind };
      stop();
      s.bubble = message;
      s.exiting = false;
      s.lastSpeech = s.elapsed;
      s.expires = s.elapsed + Math.max(9000, text.length * 190);
      s.holdUntil = s.elapsed + 9000;
      setBubble(message);
      if (next) void changePose(next);
    },
    [changePose, stop],
  );

  useEffect(() => {
    const s = state.current;
    s.mounted = true;
    let idle: ReturnType<typeof setTimeout>;
    const startup = setTimeout(() => {
      const preferences = readPreferences();
      s.preferences = preferences;
      s.lastScrollY = window.scrollY;
      setPrefs(preferences);
      setReady(true);
      idle = setTimeout(() => {
        for (const pose of companionPoses) {
          const image = new window.Image();
          image.src = poseSource(pose);
          s.decoded.set(
            pose,
            image.decode().then(
              () => true,
              () => false,
            ),
          );
        }
      }, 1200);
    }, 2800);
    return () => {
      s.mounted = false;
      s.poseVersion++;
      clearTimeout(startup);
      clearTimeout(idle);
      stop();
    };
  }, [stop]);

  useEffect(() => {
    if (!ready) return;
    const observer = new ResizeObserver(measure);
    let frame = 0;
    const attach = () => {
      if (!actor.current && !state.current.preferences.minimized) {
        frame = requestAnimationFrame(attach);
        return;
      }
      measure();
      if (actor.current) observer.observe(actor.current);
      if (actor.current && !state.current.preferences.minimized && focusOnReveal.current) {
        focusOnReveal.current = false;
        trigger.current?.focus({ preventScroll: true });
      }
    };
    frame = requestAnimationFrame(attach);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [measure, ready, prefs.minimized]);

  useEffect(() => {
    if (!ready) return;
    const s = state.current;
    const syncBlocked = () => {
      const next = !!document.querySelector(
        'dialog[open], [aria-controls="mobile-navigation"][aria-expanded="true"]',
      );
      if (next === s.blocked) return;
      s.blocked = next;
      setBlocked(next);
      stop();
      if (next) closeBubble();
    };
    const observer = new MutationObserver(syncBlocked);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open", "aria-expanded"],
    });
    const onVisibility = () => {
      s.hidden = document.hidden;
      if (root.current) root.current.dataset.suspended = String(s.hidden);
      if (s.hidden) stop();
      else {
        s.nextMove = s.elapsed + 12000;
      }
    };
    const onScroll = () => {
      const delta = window.scrollY - s.lastScrollY;
      s.lastScrollY = window.scrollY;
      s.lastScroll = s.elapsed;
      s.scrollOffset = clamp(delta * 0.25, -20, 20);
    };
    const onOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) closeBubble();
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && s.bubble && !s.blocked) {
        event.preventDefault();
        closeBubble(true);
      }
    };
    syncBlocked();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEscape);
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(),
        elapsed = Math.min(now - previous, 450);
      previous = now;
      if (s.hidden || s.blocked || s.preferences.minimized) return;
      s.elapsed += elapsed;
      const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
      s.hovered = fine && !!actor.current?.matches(":hover");
      s.bubbleHovered = fine && !!speech.current?.matches(":hover");
      s.focused =
        !!root.current?.contains(document.activeElement) &&
        document.activeElement?.matches(":focus-visible") === true;
      const reading = s.hovered || s.bubbleHovered || s.focused;
      if (s.bubble?.kind === "ambient") {
        if (reading) s.expires = Math.max(s.expires, s.elapsed + 3500);
        else if (s.elapsed > s.expires || s.elapsed - s.lastScroll < 500)
          closeBubble();
      }
      if (s.drag || reading || s.bubble || s.exiting || s.elapsed < s.holdUntil)
        return;
      if (s.elapsed - s.lastScroll > 850 && s.pendingSection) {
        const section = s.pendingSection;
        s.pendingSection = null;
        const content = companionSections[section];
        void changePose(s.preferences.quiet ? "bear" : content.pose);
        if (
          !s.preferences.quiet &&
          s.elapsed - s.lastSpeech > 50000 &&
          window.innerWidth >= 768
        ) {
          const hour = new Date().getHours();
          showBubble(
            section === "home" && (hour >= 22 || hour < 6)
              ? companionLines.night
              : content.text,
            "ambient",
          );
        }
      }
      if (s.elapsed > s.nextPose && s.elapsed - s.lastScroll > 1200) {
        const sequence: CompanionPose[] = s.preferences.quiet
          ? ["bear", "think", "bear", "heart"]
          : s.elapsed < s.energyUntil
            ? ["cheer", "peace", "thumb"]
            : ["bear", "think", "peace", "bear", "wave"];
        void changePose(sequence[s.poseIndex++ % sequence.length]);
        s.nextPose = s.elapsed + 14000 + (s.poseIndex % 3) * 3200;
      }
      if (s.preferences.automatic && !reduced) {
        if (s.elapsed > s.nextMove && s.elapsed - s.lastScroll > 1600) {
          const positions = [
            { x: -6, y: -22 },
            { x: -12, y: 12 },
            { x: 0, y: -9 },
            { x: -4, y: 20 },
          ];
          s.wander = positions[s.moveIndex++ % positions.length];
          s.nextMove = s.elapsed + 26000 + (s.moveIndex % 3) * 4000;
        }
        const base = basePoint();
        move({
          x: base.x + s.wander.x,
          y:
            base.y +
            s.wander.y +
            (s.elapsed - s.lastScroll < 700 ? s.scrollOffset : 0),
        });
      }
    }, 250);
    const sections = Object.keys(companionSections)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting && entry.target.id !== s.section) {
            s.section = entry.target.id;
            s.pendingSection = entry.target.id;
          }
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((section) => sectionObserver.observe(section));
    return () => {
      clearInterval(timer);
      observer.disconnect();
      sectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [
    basePoint,
    changePose,
    closeBubble,
    move,
    ready,
    reduced,
    showBubble,
    stop,
  ]);

  const recordPosition = () => {
    const s = state.current,
      b = s.bounds;
    s.wander = { x: 0, y: 0 };
    s.target = { x: x.get(), y: y.get() };
    s.nextMove = s.elapsed + 32000;
    s.holdUntil = s.elapsed + 1500;
    persist({
      ...s.preferences,
      placement: {
        x: clamp((x.get() - b.left) / Math.max(1, b.right - b.left), 0, 1),
        y: clamp((y.get() - b.top) / Math.max(1, b.bottom - b.top), 0, 1),
      },
    });
  };
  const pointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const s = state.current;
    stop();
    s.suppressClick = false;
    s.drag = {
      id: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { x: x.get(), y: y.get() },
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const s = state.current,
      drag = s.drag;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.start.x,
      dy = event.clientY - drag.start.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) {
      closeBubble();
      setDragging(true);
    }
    drag.moved = true;
    const p = constrain({ x: drag.origin.x + dx, y: drag.origin.y + dy });
    x.set(p.x);
    y.set(p.y);
  };
  const pointerEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const s = state.current,
      drag = s.drag;
    if (!drag || drag.id !== event.pointerId) return;
    s.drag = null;
    setDragging(false);
    if (drag.moved) {
      s.suppressClick = true;
      recordPosition();
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onAction = (action: Action) => {
    const s = state.current;
    s.nextPose = s.elapsed + 12000;
    if (action === "papers") {
      document
        .getElementById("publications")
        ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      showBubble(companionLines.papers, "user", "point");
    } else if (action === "pat") {
      showBubble(
        companionLines.pat[s.counts.pat++ % companionLines.pat.length],
        "user",
        "heart",
      );
      if (!reduced) setReaction((value) => value + 1);
    } else if (action === "coffee") {
      s.energyUntil = s.elapsed + 45000;
      showBubble(
        companionLines.coffee[Math.min(s.counts.coffee++, 2)],
        "user",
        s.counts.coffee > 2 ? "bear" : "thumb",
      );
    } else
      showBubble(
        companionLines.ideas[s.counts.idea++ % companionLines.ideas.length],
        "user",
        "think",
      );
  };

  if (!ready) return null;
  return (
    <div
      ref={root}
      className="companion-root"
      data-blocked={blocked}
      data-dragging={dragging}
      data-reduced={reduced}
      aria-label="网页小向导"
      inert={blocked}
    >
      <AnimatePresence initial={false} mode="wait">
        {prefs.minimized ? (
          <motion.div
            key="launcher"
            className="companion-launcher"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onAnimationComplete={() => {
              if (focusOnReveal.current && state.current.preferences.minimized) {
                focusOnReveal.current = false;
                root.current?.querySelector<HTMLButtonElement>(".companion-launcher button")?.focus({ preventScroll: true });
              }
            }}
          >
            <IconButton
              label="叫回小向导"
              onClick={(event) => {
                focusOnReveal.current = event.detail === 0;
                persist({ ...state.current.preferences, minimized: false });
                showBubble(companionLines.returning, "user", "wave");
              }}
            >
              <Sparkles size={20} aria-hidden="true" />
            </IconButton>
          </motion.div>
        ) : (
          <motion.div
            key="actor"
            ref={actor}
            className="companion-actor"
            style={{ x, y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            onPointerEnter={() => {
              stop();
              state.current.target = { x: x.get(), y: y.get() };
            }}
          >
            <AnimatePresence
              onExitComplete={() => {
                state.current.exiting = false;
              }}
            >
              {bubble && (
                <Speech
                  key="speech"
                  bubble={bubble}
                  id={id}
                  reduced={reduced}
                  register={registerSpeech}
                  onMeasure={placeSpeech}
                  onClose={() => closeBubble(true)}
                  onAction={onAction}
                  onHover={(value) => {
                    state.current.bubbleHovered = value;
                  }}
                />
              )}
            </AnimatePresence>
            <motion.div className="companion-body" style={{ rotate: lean }}>
              <span className="sr-only" id={`${id}-help`}>
                拖动可移动位置；聚焦后也可用方向键移动。
              </span>
              <button
                type="button"
                ref={trigger}
                className="companion-pet"
                aria-label="和小向导互动"
                aria-describedby={`${id}-help`}
                aria-expanded={!!bubble}
                aria-controls={bubble ? id : undefined}
                data-pose={pose}
                onPointerDown={pointerDown}
                onPointerMove={pointerMove}
                onPointerUp={pointerEnd}
                onPointerCancel={pointerEnd}
                onLostPointerCapture={pointerEnd}
                onClick={(event) => {
                  if (event.detail > 0 && state.current.suppressClick) {
                    state.current.suppressClick = false;
                    return;
                  }
                  if (state.current.bubble?.kind === "user") closeBubble();
                  else showBubble(companionLines.hello, "user", "hand");
                }}
                onKeyDown={(event) => {
                  const offsets: Record<string, Point> = {
                    ArrowLeft: { x: -16, y: 0 },
                    ArrowRight: { x: 16, y: 0 },
                    ArrowUp: { x: 0, y: -16 },
                    ArrowDown: { x: 0, y: 16 },
                  };
                  const delta = offsets[event.key];
                  if (!delta) return;
                  event.preventDefault();
                  stop();
                  closeBubble();
                  const next = constrain({
                    x: x.get() + delta.x,
                    y: y.get() + delta.y,
                  });
                  x.set(next.x);
                  y.set(next.y);
                  recordPosition();
                }}
              >
                <span className="companion-breathe">
                  <AnimatePresence initial={false}>
                    <motion.span
                      className="companion-pose"
                      key={pose}
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.25, ease }}
                    >
                      <Image
                        src={poseSource(pose)}
                        alt=""
                        width={384}
                        height={384}
                        draggable={false}
                        unoptimized
                      />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
              {reaction > 0 && !reduced && (
                <span
                  className="companion-reaction"
                  key={reaction}
                  aria-hidden="true"
                >
                  <span>💗</span>
                  <span>✨</span>
                  <span>🌸</span>
                </span>
              )}
            </motion.div>
            <div className="companion-controls">
              <IconButton
                label={prefs.automatic ? "停在这里" : "恢复自主活动"}
                aria-pressed={prefs.automatic}
                onClick={() => {
                  stop();
                  recordPosition();
                  persist({
                    ...state.current.preferences,
                    automatic: !state.current.preferences.automatic,
                  });
                  state.current.nextMove = state.current.elapsed + 7000;
                }}
              >
                {prefs.automatic ? (
                  <Orbit size={16} aria-hidden="true" />
                ) : (
                  <Pin size={16} aria-hidden="true" />
                )}
              </IconButton>
              <IconButton
                label={prefs.quiet ? "恢复聊天" : "安静陪读"}
                aria-pressed={prefs.quiet}
                onClick={() => {
                  closeBubble();
                  persist({
                    ...state.current.preferences,
                    quiet: !state.current.preferences.quiet,
                  });
                  void changePose(
                    state.current.preferences.quiet ? "bear" : "wave",
                  );
                }}
              >
                <Moon size={16} aria-hidden="true" />
              </IconButton>
              <IconButton
                label="收起小向导"
                onClick={(event) => {
                  focusOnReveal.current = event.detail === 0;
                  closeBubble();
                  persist({ ...state.current.preferences, minimized: true });
                }}
              >
                <Minus size={16} aria-hidden="true" />
              </IconButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
