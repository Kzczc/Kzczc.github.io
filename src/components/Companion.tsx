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
  type CSSProperties,
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
  Settings2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  House,
  ArrowLeft,
  MoveDiagonal,
} from "lucide-react";
import {
  companionLines,
  companionPoses,
  companionSections,
  poseSource,
  type CompanionPose,
  companionMementos,
  companionPaperIds,
  type CompanionMemento,
} from "@/data/companion";
import { selectedPublications } from "@/data/profile";
import "./companion.css";

type Point = { x: number; y: number };
type Preferences = {
  version: 1;
  automatic: boolean;
  quiet: boolean;
  minimized: boolean;
  placement: Point | null;
  size: number;
  mementos: CompanionMemento[];
};
type Bubble = { text: string; kind: "ambient" | "user" | "settings" };
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
  size: 100,
  mementos: [],
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
      size:
        typeof stored.size === "number" && Number.isFinite(stored.size)
          ? clamp(Math.round(stored.size), 70, 150)
          : 100,
      mementos: Array.isArray(stored.mementos)
        ? [
            ...new Set<CompanionMemento>(
              stored.mementos.filter(
                (key: unknown): key is CompanionMemento =>
                  typeof key === "string" &&
                  Object.hasOwn(companionMementos, key),
              ),
            ),
          ]
        : [],
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
  preferences,
  onSize,
  onHome,
  onMemento,
  onBack,
}: {
  bubble: Bubble;
  id: string;
  onClose: () => void;
  onAction: (action: Action) => void;
  onHover: (value: boolean) => void;
  onMeasure: () => void;
  register: (element: HTMLDivElement | null) => void;
  reduced: boolean;
  preferences: Preferences;
  onSize: (size: number) => void;
  onHome: (resetSize: boolean) => void;
  onMemento: (key: CompanionMemento) => void;
  onBack: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState<CompanionMemento | null>(null);
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
      aria-label={bubble.kind === "settings" ? "小向导设置" : "小向导的对话"}
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
          COMPANION /{" "}
          {bubble.kind === "settings"
            ? "MY LITTLE WORLD"
            : bubble.kind === "user"
              ? "LISTENING"
              : "WITH YOU"}
        </span>
        <IconButton label="收起对话" onClick={onClose}>
          <X size={14} aria-hidden="true" />
        </IconButton>
      </div>
      {bubble.kind !== "settings" && (
        <p className="companion-speech" aria-live="polite" aria-atomic="true">
          <ComicText text={bubble.text} />
        </p>
      )}
      {bubble.kind === "settings" && (
        <div className="companion-settings">
          <div className="companion-setting-heading">
            <label htmlFor={`${id}-size`}>我的大小</label>
            <output htmlFor={`${id}-size`}>{preferences.size}%</output>
          </div>
          <div className="companion-size-control">
            <IconButton
              label="缩小角色"
              disabled={preferences.size <= 70}
              onClick={() => onSize(preferences.size - 10)}
            >
              <ZoomOut size={17} aria-hidden="true" />
            </IconButton>
            <input
              id={`${id}-size`}
              type="range"
              min="70"
              max="150"
              step="1"
              value={preferences.size}
              onChange={(event) => onSize(Number(event.target.value))}
            />
            <IconButton
              label="放大角色"
              disabled={preferences.size >= 150}
              onClick={() => onSize(preferences.size + 10)}
            >
              <ZoomIn size={17} aria-hidden="true" />
            </IconButton>
          </div>
          <div className="companion-setting-tools">
            <IconButton label="回到右下角" onClick={() => onHome(false)}>
              <House size={17} aria-hidden="true" />
            </IconButton>
            <IconButton label="恢复默认大小与位置" onClick={() => onHome(true)}>
              <RotateCcw size={17} aria-hidden="true" />
            </IconButton>
            <IconButton label="回到聊天" onClick={onBack}>
              <ArrowLeft size={17} aria-hidden="true" />
            </IconButton>
          </div>
          <div className="companion-setting-heading">
            <span>小小纪念册</span>
            <span>{preferences.mementos.length} / 3</span>
          </div>
          <div className="companion-mementos">
            {(Object.keys(companionMementos) as CompanionMemento[]).map(
              (key) => {
                const entry = companionMementos[key],
                  found = preferences.mementos.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    data-memento={key}
                    data-found={found}
                    aria-label={
                      found ? `回看${entry.title}` : `彩蛋提示：${entry.hint}`
                    }
                    data-tip={found ? entry.title : "点一下找线索"}
                    onClick={() => {
                      if (found) onMemento(key);
                      else setHint(hint === key ? null : key);
                    }}
                  >
                    <span aria-hidden="true">{found ? entry.emoji : "✧"}</span>
                  </button>
                );
              },
            )}
          </div>
          {hint && !preferences.mementos.includes(hint) && (
            <p className="companion-memento-hint" role="status">
              {companionMementos[hint].hint} ✨
            </p>
          )}
        </div>
      )}
      {bubble.kind === "user" && (
        <div className="companion-actions">
          <IconButton
            label="论文盲盒"
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
  const resizeHandle = useRef<HTMLButtonElement>(null);
  const resizeReadout = useRef<HTMLOutputElement>(null);
  const focusOnReveal = useRef(false);
  const speech = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [pose, setPose] = useState<CompanionPose>("wave");
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeSide, setResizeSide] = useState<"left" | "right">("left");
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
    resize: null as null | {
      id: number;
      start: Point;
      origin: Point;
      anchor: Point;
      baseArt: number;
      side: "left" | "right";
      initialSize: number;
      preferences: Preferences;
      moved: boolean;
    },
    resizeFrame: 0,
    resizePoint: null as Point | null,
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
    paperBag: [] as string[],
    lastPaper: "",
    highlightedPaper: null as HTMLElement | null,
    paperTimer: null as ReturnType<typeof setTimeout> | null,
    visited: new Set<string>(),
    dwell: 0,
    pendingMemento: null as CompanionMemento | null,
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
      width = panel.offsetWidth;
    const left = clamp(
      x.get() + s.size.width / 2 - width / 2,
      b.left,
      b.width - width - 12,
    );
    const aboveSpace = Math.max(0, y.get() - b.top - 10);
    const belowSpace = Math.max(0, b.height - 16 - y.get() - s.size.height - 8);
    const naturalHeight = panel.scrollHeight + 2;
    const above = aboveSpace >= naturalHeight || aboveSpace >= belowSpace;
    panel.style.maxHeight = `${Math.max(100, above ? aboveSpace : belowSpace)}px`;
    const height = panel.offsetHeight;
    const top = above
      ? Math.max(b.top, y.get() - height - 10)
      : Math.min(y.get() + s.size.height + 8, b.height - height - 16);
    panel.style.left = `${left - x.get()}px`;
    panel.style.top = `${top - y.get()}px`;
    panel.style.transformOrigin = `${clamp(x.get() + s.size.width / 2 - left, 20, width - 20)}px ${above ? "100%" : "0%"}`;
  }, [x, y]);
  const positionActor = useCallback(() => {
    if (actor.current)
      actor.current.style.translate = `${x.get()}px ${y.get()}px`;
    if (!state.current.resize)
      setResizeSide(
        x.get() + state.current.size.width / 2 > state.current.bounds.width / 2
          ? "left"
          : "right",
      );
    placeSpeech();
  }, [placeSpeech, x, y]);
  useMotionValueEvent(x, "change", positionActor);
  useMotionValueEvent(y, "change", positionActor);
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
    const size = {
      width: actor.current?.offsetWidth || 128,
      height: actor.current?.offsetHeight || 166,
    };
    if (width === s.bounds.width && height === s.bounds.height && size.width === s.size.width && size.height === s.size.height) {
      positionActor();
      return;
    }
    s.size = size;
    s.bounds = {
      left: 10,
      top: Math.min(92, height / 4),
      right: Math.max(10, width - s.size.width - 12),
      bottom: Math.max(92, height - s.size.height - 84),
      width,
      height,
    };
    if (s.resize || s.drag) {
      const point = constrain({ x: x.get(), y: y.get() });
      x.set(point.x);
      y.set(point.y);
      positionActor();
      return;
    }
    s.wander = { x: 0, y: 0 };
    s.target = { x: -1, y: -1 };
    move(basePoint(), true);
    positionActor();
  }, [basePoint, constrain, move, positionActor, x, y]);
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
  const cancelGesture = useCallback(() => {
    const s = state.current;
    if (s.resize) {
      const gesture = s.resize;
      cancelAnimationFrame(s.resizeFrame);
      s.resizeFrame = 0;
      s.resizePoint = null;
      s.preferences = gesture.preferences;
      root.current?.style.setProperty(
        "--pet-scale",
        String(gesture.initialSize / 100),
      );
      resizeHandle.current?.setAttribute(
        "aria-valuenow",
        String(gesture.initialSize),
      );
      if (resizeReadout.current)
        resizeReadout.current.textContent = `${gesture.initialSize}%`;
      x.set(gesture.origin.x);
      y.set(gesture.origin.y);
      // Recalculate the bounds while the gesture still owns the position.
      // An idle wander must not turn cancellation into a jump back home.
      measure();
      s.resize = null;
      setResizing(false);
      setPrefs(gesture.preferences);
      if (resizeHandle.current?.hasPointerCapture(gesture.id))
        resizeHandle.current.releasePointerCapture(gesture.id);
      s.target = { ...gesture.origin };
      s.holdUntil = s.elapsed + 1500;
      root.current?.setAttribute("data-resizing", "false");
      return true;
    }
    if (s.drag) {
      const gesture = s.drag;
      s.drag = null;
      x.set(gesture.origin.x);
      y.set(gesture.origin.y);
      s.target = { ...gesture.origin };
      s.suppressClick = true;
      setDragging(false);
      if (trigger.current?.hasPointerCapture(gesture.id))
        trigger.current.releasePointerCapture(gesture.id);
      s.holdUntil = s.elapsed + 1500;
      return true;
    }
    return false;
  }, [measure, x, y]);
  const discover = useCallback(
    (key: CompanionMemento, explicit = false) => {
      const s = state.current;
      if (s.preferences.mementos.includes(key)) return false;
      persist({ ...s.preferences, mementos: [...s.preferences.mementos, key] });
      if (explicit) {
        const entry = companionMementos[key];
        showBubble(entry.text, "user", entry.pose);
        if (!reduced) setReaction((value) => value + 1);
      } else if (!s.preferences.quiet) s.pendingMemento = key;
      return true;
    },
    [persist, reduced, showBubble],
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
      cancelAnimationFrame(s.resizeFrame);
      if (s.paperTimer) clearTimeout(s.paperTimer);
      s.highlightedPaper?.classList.remove("companion-paper-spotlight");
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
      if (
        actor.current &&
        !state.current.preferences.minimized &&
        focusOnReveal.current
      ) {
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
      if (next) cancelGesture();
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
      if (s.hidden) {
        cancelGesture();
        stop();
      } else {
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
      if (event.key === "Escape" && cancelGesture()) {
        event.preventDefault();
        return;
      }
      if (event.key === "Escape" && s.bubble && !s.blocked) {
        event.preventDefault();
        closeBubble(true);
      }
    };
    const onBlur = () => {
      cancelGesture();
    };
    syncBlocked();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("blur", onBlur);
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(),
        elapsed = Math.min(now - previous, 450);
      previous = now;
      if (s.hidden || s.blocked || s.preferences.minimized) return;
      s.elapsed += elapsed;
      // Only count active reading time; a fast scroll past a section does not count.
      if (
        s.elapsed - s.lastScroll > 850 &&
        !s.drag &&
        s.bubble?.kind !== "settings"
      ) {
        s.dwell += elapsed;
        if (s.dwell > 3500) s.visited.add(s.section);
        if (
          ["home", "publications", "journey", "awards"].every((section) =>
            s.visited.has(section),
          )
        )
          discover("explorer");
      }
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
      if (
        s.drag ||
        s.resize ||
        reading ||
        s.bubble ||
        s.exiting ||
        s.elapsed < s.holdUntil
      )
        return;
      if (
        s.pendingMemento &&
        !s.preferences.quiet &&
        s.elapsed - s.lastSpeech > 25000 &&
        s.elapsed - s.lastScroll > 1600
      ) {
        const entry = companionMementos[s.pendingMemento];
        s.pendingMemento = null;
        showBubble(entry.text, "ambient", entry.pose);
        return;
      }
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
            s.dwell = 0;
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
      window.removeEventListener("blur", onBlur);
    };
  }, [
    basePoint,
    cancelGesture,
    changePose,
    closeBubble,
    discover,
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
  const resizePet = (size: number) => {
    const s = state.current;
    stop();
    recordPosition();
    persist({
      ...s.preferences,
      size: clamp(Math.round(size), 70, 150),
    });
    s.holdUntil = s.elapsed + 2000;
  };
  const returnHome = (resetSize: boolean) => {
    const s = state.current;
    stop();
    s.wander = { x: 0, y: 0 };
    s.nextMove = s.elapsed + 32000;
    persist({
      ...s.preferences,
      placement: null,
      size: resetSize ? 100 : s.preferences.size,
    });
    s.target = { x: -1, y: -1 };
    move(basePoint());
  };
  const pointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !event.isPrimary || state.current.resize) return;
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
    if (event.type === "pointercancel") {
      cancelGesture();
      return;
    }
    s.drag = null;
    setDragging(false);
    if (drag.moved) {
      s.suppressClick = true;
      recordPosition();
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const applyResize = (point: Point) => {
    const s = state.current,
      gesture = s.resize;
    if (!gesture) return;
    const dx = point.x - gesture.start.x,
      dy = point.y - gesture.start.y;
    if (!gesture.moved && Math.hypot(dx, dy) < 4) return;
    if (!gesture.moved) {
      gesture.moved = true;
      closeBubble();
      setResizing(true);
      root.current?.setAttribute("data-resizing", "true");
    }
    const delta = ((gesture.side === "left" ? -dx : dx) - dy) / 2;
    const size = clamp(
      Math.round(gesture.initialSize + (delta / gesture.baseArt) * 100),
      70,
      150,
    );
    s.preferences = { ...s.preferences, size };
    root.current?.style.setProperty("--pet-scale", String(size / 100));
    const art = (gesture.baseArt * size) / 100;
    s.size = {
      width: actor.current!.offsetWidth,
      height: actor.current!.offsetHeight,
    };
    const b = s.bounds;
    b.right = Math.max(b.left, b.width - s.size.width - 12);
    b.bottom = Math.max(b.top, b.height - s.size.height - 84);
    const margin = (s.size.width - art) / 2;
    const next = constrain({
      x: gesture.anchor.x - margin - (gesture.side === "left" ? art : 0),
      y: gesture.anchor.y - art,
    });
    x.set(next.x);
    y.set(next.y);
    s.target = next;
    if (resizeReadout.current) resizeReadout.current.textContent = `${size}%`;
    resizeHandle.current?.setAttribute("aria-valuenow", String(size));
    positionActor();
  };
  const resizeDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !event.isPrimary || state.current.drag) return;
    const s = state.current;
    stop();
    const body = event.currentTarget.parentElement!.getBoundingClientRect();
    const side =
      x.get() + s.size.width / 2 > s.bounds.width / 2 ? "left" : "right";
    setResizeSide(side);
    s.resize = {
      id: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { x: x.get(), y: y.get() },
      anchor: { x: side === "left" ? body.right : body.left, y: body.bottom },
      baseArt: body.width / (s.preferences.size / 100),
      side,
      initialSize: s.preferences.size,
      preferences: { ...s.preferences },
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const resizeMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const s = state.current;
    if (s.resize?.id !== event.pointerId) return;
    s.resizePoint = { x: event.clientX, y: event.clientY };
    if (!s.resizeFrame)
      s.resizeFrame = requestAnimationFrame(() => {
        s.resizeFrame = 0;
        if (s.resizePoint) applyResize(s.resizePoint);
      });
  };
  const resizeEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const s = state.current;
    if (s.resize?.id !== event.pointerId) return;
    if (event.type === "pointercancel") {
      cancelGesture();
      return;
    }
    cancelAnimationFrame(s.resizeFrame);
    s.resizeFrame = 0;
    if (s.resizePoint) applyResize(s.resizePoint);
    const moved = s.resize.moved;
    s.resize = null;
    s.resizePoint = null;
    if (moved) {
      recordPosition();
      positionActor();
    }
    setResizing(false);
    root.current?.setAttribute("data-resizing", "false");
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onAction = (action: Action) => {
    const s = state.current;
    s.nextPose = s.elapsed + 12000;
    if (action === "papers") {
      if (!s.paperBag.length) {
        s.paperBag = [...companionPaperIds];
        for (let i = s.paperBag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [s.paperBag[i], s.paperBag[j]] = [s.paperBag[j], s.paperBag[i]];
        }
        if (s.paperBag[s.paperBag.length - 1] === s.lastPaper)
          s.paperBag.reverse();
      }
      const paperId = s.paperBag.pop()!;
      const paper = selectedPublications.find((p) => p.id === paperId)!;
      s.lastPaper = paperId;
      const target = document.getElementById(`paper-${paperId}`);
      s.highlightedPaper?.classList.remove("companion-paper-spotlight");
      if (s.paperTimer) clearTimeout(s.paperTimer);
      if (target) {
        target.scrollIntoView({
          behavior: reduced ? "instant" : "smooth",
          block: "center",
        });
        target.classList.add("companion-paper-spotlight");
        s.highlightedPaper = target;
        s.paperTimer = setTimeout(
          () => target.classList.remove("companion-paper-spotlight"),
          4800,
        );
      }
      const title = paper.title.split(":")[0];
      showBubble(
        `这次抽到「${title}」📖 ${paper.status.startsWith("Under Review") ? "这项工作还在投稿评审中" : "这项工作已接收"}，点图片或摘要一起看看吧～`,
        "user",
        "point",
      );
    } else if (action === "pat") {
      s.counts.pat++;
      if (s.counts.pat === 5 && discover("kindness", true)) return;
      showBubble(
        companionLines.pat[(s.counts.pat - 1) % companionLines.pat.length],
        "user",
        "heart",
      );
      if (!reduced) setReaction((value) => value + 1);
    } else if (action === "coffee") {
      s.energyUntil = s.elapsed + 45000;
      s.counts.coffee++;
      if (s.counts.coffee === 3 && discover("tea", true)) return;
      showBubble(
        companionLines.coffee[Math.min(s.counts.coffee - 1, 2)],
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
      data-resizing={resizing}
      data-resize-side={resizeSide}
      data-reduced={reduced}
      style={{ "--pet-scale": prefs.size / 100 } as CSSProperties}
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
              if (
                focusOnReveal.current &&
                state.current.preferences.minimized
              ) {
                focusOnReveal.current = false;
                root.current
                  ?.querySelector<HTMLButtonElement>(
                    ".companion-launcher button",
                  )
                  ?.focus({ preventScroll: true });
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
                  preferences={prefs}
                  onSize={resizePet}
                  onHome={returnHome}
                  onMemento={(key) =>
                    showBubble(
                      companionMementos[key].text,
                      "user",
                      companionMementos[key].pose,
                    )
                  }
                  onBack={() =>
                    showBubble(companionLines.hello, "user", "hand")
                  }
                  onHover={(value) => {
                    state.current.bubbleHovered = value;
                  }}
                />
              )}
            </AnimatePresence>
            <motion.div className="companion-body" style={{ rotate: lean }}>
              <span className="sr-only" id={`${id}-help`}>
                拖动角色移动位置，拖动角落手柄改变大小；按 Esc
                取消。也可用方向键操作。
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
                  if (
                    state.current.bubble &&
                    state.current.bubble.kind !== "ambient"
                  )
                    closeBubble();
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
              <button
                type="button"
                role="slider"
                ref={resizeHandle}
                className="companion-resize"
                aria-label="拖动调整大小"
                aria-valuemin={70}
                aria-valuemax={150}
                aria-valuenow={prefs.size}
                aria-describedby={`${id}-resize-help`}
                data-tip="拖动缩放 · 双击还原"
                onPointerDown={resizeDown}
                onPointerMove={resizeMove}
                onPointerUp={resizeEnd}
                onPointerCancel={resizeEnd}
                onLostPointerCapture={resizeEnd}
                onDoubleClick={() => resizePet(100)}
                onKeyDown={(event) => {
                  if (["ArrowUp", "ArrowRight", "+", "="].includes(event.key)) {
                    event.preventDefault();
                    resizePet(state.current.preferences.size + 5);
                  } else if (
                    ["ArrowDown", "ArrowLeft", "-"].includes(event.key)
                  ) {
                    event.preventDefault();
                    resizePet(state.current.preferences.size - 5);
                  } else if (["Home", "0", "Enter"].includes(event.key)) {
                    event.preventDefault();
                    resizePet(100);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    resizePet(150);
                  }
                }}
              >
                <MoveDiagonal size={16} aria-hidden="true" />
              </button>
              <span className="sr-only" id={`${id}-resize-help`}>
                拖动缩放，双击恢复默认大小。方向键每次调整百分之五，Home
                恢复默认，Esc 取消拖动。
              </span>
              <output
                ref={resizeReadout}
                className="companion-size-readout"
                aria-hidden={!resizing}
              >
                {prefs.size}%
              </output>
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
                label="大小与彩蛋"
                aria-expanded={bubble?.kind === "settings"}
                onClick={() => {
                  if (state.current.bubble?.kind === "settings") closeBubble();
                  else showBubble("", "settings");
                }}
              >
                <Settings2 size={16} aria-hidden="true" />
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
