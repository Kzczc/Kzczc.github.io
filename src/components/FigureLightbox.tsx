"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export default function FigureLightbox({ src, title, onClose }: {
  src: string;
  title: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  const toggleZoom = () => {
    setZoomed(value => !value);
    stageRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="figure-lightbox"
      aria-label={title}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="figure-lightbox-toolbar">
        <button type="button" onClick={toggleZoom} aria-label={zoomed ? "Fit figure to screen" : "Zoom in"} aria-pressed={zoomed}>
          {zoomed ? <ZoomOut size={22} /> : <ZoomIn size={22} />}
        </button>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close figure">
          <X size={24} />
        </button>
      </div>
      <div ref={stageRef} className={`figure-lightbox-stage ${zoomed ? "is-zoomed" : ""}`}>
        <button type="button" className="figure-lightbox-image" onClick={toggleZoom} aria-label={zoomed ? "Fit figure to screen" : "Zoom in"}>
          <Image src={src} alt={title} width={2400} height={1800} unoptimized />
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
