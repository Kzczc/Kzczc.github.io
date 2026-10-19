"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const ease = [0.22, 1, 0.36, 1] as const;
const MAX_ZOOM = 5;
type Point = { x: number; y: number };

function sourceBounds(trigger: HTMLButtonElement) {
  const image = trigger.querySelector("img");
  if (!image?.naturalWidth) return null;
  const rect = image.getBoundingClientRect();
  const css = getComputedStyle(image);
  const left = parseFloat(css.paddingLeft) || 0;
  const right = parseFloat(css.paddingRight) || 0;
  const top = parseFloat(css.paddingTop) || 0;
  const bottom = parseFloat(css.paddingBottom) || 0;
  const availableWidth = rect.width - left - right;
  const availableHeight = rect.height - top - bottom;
  const ratio = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight,
  );
  const width = image.naturalWidth * ratio;
  const height = image.naturalHeight * ratio;
  return {
    x: rect.x + left + (availableWidth - width) / 2,
    y: rect.y + top + (availableHeight - height) / 2,
    width,
    height,
  };
}

export default function FigureLightbox({
  src,
  title,
  trigger,
  onClose,
}: {
  src: string;
  title: string;
  trigger: HTMLButtonElement;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchAction = useRef<{ target: HTMLElement; time: number } | null>(
    null,
  );
  const alive = useRef(false);
  const closing = useRef(false);
  const initialized = useRef(false);
  const geometry = useRef({ width: 0, height: 0, fitWidth: 1, fitHeight: 1 });
  const transforms = useRef<Array<{ stop: () => void }>>([]);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef({
    x: 0,
    y: 0,
    originX: 0,
    originY: 0,
    moved: false,
    multiple: false,
    onImage: false,
  });
  const pinch = useRef<{
    distance: number;
    scale: number;
    anchor: Point;
  } | null>(null);
  const reducedMotion = useReducedMotion();
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const width = useMotionValue(1);
  const height = useMotionValue(1);
  const imageOpacity = useMotionValue(0);
  const shadeOpacity = useMotionValue(0);
  const chromeOpacity = useMotionValue(0);

  useMotionValueEvent(scale, "change", (value) => setZoomed(value > 1.01));

  const stopMotion = useCallback(
    () => transforms.current.forEach((animation) => animation.stop()),
    [],
  );
  const constrain = useCallback((point: Point, zoom: number) => {
    const g = geometry.current;
    const maxX = Math.max(0, (g.fitWidth * zoom - g.width) / 2);
    const maxY = Math.max(0, (g.fitHeight * zoom - g.height) / 2);
    return { x: clamp(point.x, -maxX, maxX), y: clamp(point.y, -maxY, maxY) };
  }, []);
  const moveTo = useCallback(
    (point: Point, zoom: number, duration = 0.34) => {
      stopMotion();
      const options = { duration: reducedMotion ? 0 : duration, ease };
      const animations = [
        animate(x, point.x, options),
        animate(y, point.y, options),
        animate(scale, zoom, options),
      ];
      transforms.current = animations;
      return Promise.all(animations);
    },
    [reducedMotion, scale, stopMotion, x, y],
  );
  const zoomAt = useCallback(
    (zoom: number, clientPoint?: Point) => {
      if (closing.current || !initialized.current || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const anchor = clientPoint
        ? {
            x: clientPoint.x - rect.x - rect.width / 2,
            y: clientPoint.y - rect.y - rect.height / 2,
          }
        : { x: 0, y: 0 };
      const nextScale = clamp(zoom, 1, MAX_ZOOM);
      const ratio = nextScale / scale.get();
      void moveTo(
        constrain(
          {
            x: anchor.x - (anchor.x - x.get()) * ratio,
            y: anchor.y - (anchor.y - y.get()) * ratio,
          },
          nextScale,
        ),
        nextScale,
      );
    },
    [constrain, moveTo, scale, x, y],
  );
  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    pointers.current.clear();
    const source = trigger.isConnected ? sourceBounds(trigger) : null;
    const stage = stageRef.current?.getBoundingClientRect();
    const visibleSource =
      source &&
      stage &&
      source.y + source.height > 0 &&
      source.y < window.innerHeight;
    const duration = reducedMotion ? 0 : 0.28;
    animate(shadeOpacity, 0, { duration, ease });
    animate(chromeOpacity, 0, { duration: duration / 2 });
    if (!visibleSource) animate(imageOpacity, 0, { duration });
    const destination = visibleSource
      ? {
          x: source.x + source.width / 2 - stage.x - stage.width / 2,
          y: source.y + source.height / 2 - stage.y - stage.height / 2,
        }
      : { x: x.get(), y: y.get() };
    const endScale = visibleSource
      ? source.width / geometry.current.fitWidth
      : scale.get() * 0.97;
    void moveTo(destination, endScale, duration).then(() => {
      if (alive.current) onClose();
    });
  }, [
    chromeOpacity,
    imageOpacity,
    moveTo,
    onClose,
    reducedMotion,
    scale,
    shadeOpacity,
    trigger,
    x,
    y,
  ]);
  const measure = useCallback(() => {
    if (closing.current) return;
    const stage = stageRef.current;
    const image = imageRef.current?.querySelector("img");
    if (!stage || !image?.naturalWidth) return;
    const rect = stage.getBoundingClientRect();
    const ratio = Math.min(
      rect.width / image.naturalWidth,
      rect.height / image.naturalHeight,
      1,
    );
    const fitWidth = image.naturalWidth * ratio;
    const fitHeight = image.naturalHeight * ratio;
    // Loading and ResizeObserver can report the same geometry in adjacent frames.
    // Do not interrupt the opening transition with a duplicate measurement.
    const previous = geometry.current;
    if (
      initialized.current &&
      previous.width === rect.width &&
      previous.height === rect.height &&
      previous.fitWidth === fitWidth &&
      previous.fitHeight === fitHeight
    )
      return;
    geometry.current = {
      width: rect.width,
      height: rect.height,
      fitWidth,
      fitHeight,
    };
    width.set(fitWidth);
    height.set(fitHeight);
    if (!initialized.current) {
      initialized.current = true;
      const source = sourceBounds(trigger);
      if (source && !reducedMotion) {
        x.set(source.x + source.width / 2 - rect.x - rect.width / 2);
        y.set(source.y + source.height / 2 - rect.y - rect.height / 2);
        scale.set(source.width / fitWidth);
      }
      imageOpacity.set(1);
      void moveTo({ x: 0, y: 0 }, 1, 0.42);
    } else {
      const zoom = Math.max(1, scale.get());
      void moveTo(constrain({ x: x.get(), y: y.get() }, zoom), zoom, 0.2);
    }
  }, [
    constrain,
    height,
    imageOpacity,
    moveTo,
    reducedMotion,
    scale,
    trigger,
    width,
    x,
    y,
  ]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const previousOverflow = document.body.style.overflow;
    alive.current = true;
    closing.current = false;
    initialized.current = false;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    animate(shadeOpacity, 1, { duration: reducedMotion ? 0 : 0.3 });
    animate(chromeOpacity, 1, {
      duration: reducedMotion ? 0 : 0.25,
      delay: reducedMotion ? 0 : 0.12,
    });
    const observer = new ResizeObserver(measure);
    observer.observe(stageRef.current!);
    return () => {
      alive.current = false;
      observer.disconnect();
      stopMotion();
      shadeOpacity.stop();
      chromeOpacity.stop();
      imageOpacity.stop();
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [
    chromeOpacity,
    imageOpacity,
    measure,
    reducedMotion,
    shadeOpacity,
    stopMotion,
    trigger,
  ]);

  useEffect(() => {
    const stage = stageRef.current!;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (closing.current || !initialized.current) return;
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? geometry.current.height
            : 1;
      if (event.ctrlKey || event.metaKey)
        zoomAt(scale.get() * Math.exp(-event.deltaY * unit * 0.01), {
          x: event.clientX,
          y: event.clientY,
        });
      else if (scale.get() > 1) {
        stopMotion();
        const next = constrain(
          {
            x: x.get() - (event.shiftKey ? event.deltaY : event.deltaX) * unit,
            y: y.get() - (event.shiftKey ? 0 : event.deltaY) * unit,
          },
          scale.get(),
        );
        x.set(next.x);
        y.set(next.y);
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [constrain, scale, stopMotion, x, y, zoomAt]);
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || closing.current || !initialized.current) return;
    stopMotion();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointers.current.size === 1)
      gesture.current = {
        x: event.clientX,
        y: event.clientY,
        originX: x.get(),
        originY: y.get(),
        moved: false,
        multiple: false,
        onImage: !!imageRef.current?.contains(event.target as Node),
      };
    else {
      gesture.current.multiple = true;
      const [a, b] = [...pointers.current.values()];
      const rect = stageRef.current!.getBoundingClientRect();
      pinch.current = {
        distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        scale: scale.get(),
        anchor: {
          x:
            ((a.x + b.x) / 2 - rect.x - rect.width / 2 - x.get()) / scale.get(),
          y:
            ((a.y + b.y) / 2 - rect.y - rect.height / 2 - y.get()) /
            scale.get(),
        },
      };
    }
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId) || closing.current) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointers.current.size > 1 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const rect = stageRef.current!.getBoundingClientRect();
      const zoom = clamp(
        (pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) /
          pinch.current.distance,
        1,
        MAX_ZOOM,
      );
      const next = constrain(
        {
          x:
            (a.x + b.x) / 2 -
            rect.x -
            rect.width / 2 -
            pinch.current.anchor.x * zoom,
          y:
            (a.y + b.y) / 2 -
            rect.y -
            rect.height / 2 -
            pinch.current.anchor.y * zoom,
        },
        zoom,
      );
      scale.set(zoom);
      x.set(next.x);
      y.set(next.y);
    } else {
      const g = gesture.current;
      if (Math.hypot(event.clientX - g.x, event.clientY - g.y) > 6) {
        g.moved = true;
        setDragging(true);
      }
      if (g.moved) {
        const next = constrain(
          {
            x: g.originX + event.clientX - g.x,
            y: g.originY + event.clientY - g.y,
          },
          scale.get(),
        );
        x.set(next.x);
        y.set(next.y);
      }
    }
  };
  const pointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.delete(event.pointerId)) return;
    pinch.current = null;
    const remaining = [...pointers.current.values()][0];
    if (remaining) {
      gesture.current = {
        ...gesture.current,
        x: remaining.x,
        y: remaining.y,
        originX: x.get(),
        originY: y.get(),
        moved: true,
      };
      return;
    }
    setDragging(false);
    const g = gesture.current;
    if (
      event.type === "pointercancel" ||
      g.moved ||
      g.multiple ||
      closing.current
    )
      return;
    if (g.onImage)
      zoomAt(scale.get() > 1.01 ? 1 : 2.5, {
        x: event.clientX,
        y: event.clientY,
      });
    else requestClose();
  };

  // Some mobile browsers suppress compatibility clicks immediately after a pinch.
  // Activate toolbar taps on release, while retaining native keyboard clicks.
  const touchRelease = (
    event: PointerEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    if (event.pointerType !== "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      return;
    touchAction.current = {
      target: event.currentTarget,
      time: performance.now(),
    };
    action();
  };
  const duplicateTouchClick = (target: HTMLElement, detail: number) =>
    detail > 0 &&
    touchAction.current?.target === target &&
    performance.now() - touchAction.current.time < 700;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="figure-lightbox"
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      onKeyDown={(event) => {
        if (["+", "=", "-", "0"].includes(event.key)) {
          event.preventDefault();
          zoomAt(
            event.key === "0"
              ? 1
              : scale.get() * (event.key === "-" ? 0.8 : 1.25),
          );
        }
        const offset: Record<string, Point> = {
          ArrowLeft: { x: 100, y: 0 },
          ArrowRight: { x: -100, y: 0 },
          ArrowUp: { x: 0, y: 100 },
          ArrowDown: { x: 0, y: -100 },
        };
        if (offset[event.key] && !closing.current) {
          event.preventDefault();
          void moveTo(
            constrain(
              {
                x: x.get() + offset[event.key].x,
                y: y.get() + offset[event.key].y,
              },
              scale.get(),
            ),
            scale.get(),
            0.18,
          );
        }
      }}
    >
      <motion.div
        aria-hidden="true"
        className="figure-lightbox-shade"
        style={{ opacity: shadeOpacity }}
        onClick={requestClose}
      />
      <motion.div
        className="figure-lightbox-toolbar"
        style={{ opacity: chromeOpacity }}
      >
        <p className="figure-lightbox-title">{title}</p>
        <div className="figure-lightbox-actions">
          <button
            type="button"
            onPointerUp={(event) =>
              touchRelease(event, () => zoomAt(zoomed ? 1 : 2.5))
            }
            onClick={(event) => {
              if (!duplicateTouchClick(event.currentTarget, event.detail))
                zoomAt(zoomed ? 1 : 2.5);
            }}
            aria-label={zoomed ? "Fit figure to screen" : "Zoom in"}
            title={zoomed ? "Fit figure to screen (0)" : "Zoom in (+)"}
            aria-pressed={zoomed}
          >
            {zoomed ? <ZoomOut size={21} /> : <ZoomIn size={21} />}
          </button>
          <button
            ref={closeRef}
            type="button"
            onPointerUp={(event) => touchRelease(event, requestClose)}
            onClick={(event) => {
              if (!duplicateTouchClick(event.currentTarget, event.detail))
                requestClose();
            }}
            aria-label="Close figure"
            title="Close (Esc)"
          >
            <X size={23} />
          </button>
        </div>
      </motion.div>
      <div
        ref={stageRef}
        className="figure-lightbox-stage"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
      >
        <motion.button
          ref={imageRef}
          type="button"
          className="figure-lightbox-image"
          data-zoomed={zoomed}
          data-dragging={dragging}
          style={{ x, y, scale, width, height, opacity: imageOpacity }}
          onClick={(event) => {
            if (event.detail === 0) zoomAt(zoomed ? 1 : 2.5);
          }}
          aria-label={zoomed ? "Fit figure to screen" : "Zoom in"}
        >
          <Image
            src={src}
            alt={title}
            fill
            sizes="100vw"
            unoptimized
            draggable={false}
            onLoad={measure}
          />
        </motion.button>
      </div>
      <motion.div
        aria-hidden="true"
        className="figure-lightbox-hint"
        style={{ opacity: chromeOpacity }}
      >
        <span className="figure-hint-mouse">
          {zoomed
            ? "Drag or scroll to explore · Click to fit"
            : "Click to zoom · Esc to close"}
        </span>
        <span className="figure-hint-touch">
          Pinch to zoom · Drag to explore
        </span>
      </motion.div>
    </dialog>,
    document.body,
  );
}
