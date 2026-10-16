"use client";

import { useEffect } from "react";

/** Decorative effects only: no component state or render work on pointer movement. */
export default function VisualEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const surfaces = document.querySelectorAll<HTMLElement>("[data-ambient]");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.lit = String(entry.isIntersecting);
      }
    }, { threshold: 0 });
    surfaces.forEach(surface => observer.observe(surface));

    const pointerAllowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let active: HTMLElement | null = null;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (active) {
        delete active.dataset.glowActive;
        active.style.removeProperty("--glow-x");
        active.style.removeProperty("--glow-y");
      }
      active = null;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !pointerAllowed.matches) return;
      const surface = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-glow]") : null;
      if (surface !== active) {
        reset();
        active = surface;
      }
      if (!active) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!active) return;
        const rect = active.getBoundingClientRect();
        active.style.setProperty("--glow-x", `${pointerX - rect.left}px`);
        active.style.setProperty("--glow-y", `${pointerY - rect.top}px`);
        active.dataset.glowActive = "true";
      });
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
    const visibility = () => {
      root.dataset.pageHidden = String(document.hidden);
      if (document.hidden) reset();
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("scroll", reset, { passive: true, capture: true });
    window.addEventListener("blur", reset);
    pointerAllowed.addEventListener("change", reset);
    return () => {
      reset();
      observer.disconnect();
      surfaces.forEach(surface => { delete surface.dataset.lit; });
      delete root.dataset.pageHidden;
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("scroll", reset, true);
      window.removeEventListener("blur", reset);
      pointerAllowed.removeEventListener("change", reset);
    };
  }, []);
  return null;
}
