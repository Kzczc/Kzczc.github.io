"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Mail, ArrowUpRight, X } from "lucide-react";
import { personalInfo } from "@/data/profile";

function EmailDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    copyRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopyState("copied");
    } catch {
      addressRef.current?.focus();
      addressRef.current?.select();
      setCopyState("manual");
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="email-dialog"
      aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="email-card">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="email-card-icon"><Mail size={20} aria-hidden="true" /></span>
            <h2 id={titleId} className="text-lg font-semibold">Email</h2>
          </div>
          <button type="button" onClick={onClose} className="email-close" aria-label="Close email">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <label htmlFor={`${titleId}-address`} className="sr-only">Email address</label>
        <input
          ref={addressRef}
          id={`${titleId}-address`}
          className="email-address"
          value={personalInfo.email}
          readOnly
          spellCheck={false}
          onFocus={event => event.currentTarget.select()}
          onClick={event => event.currentTarget.select()}
        />
        <div className="email-actions">
          <button ref={copyRef} type="button" onClick={copyEmail} className="email-copy">
            {copyState === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copyState === "copied" ? "Copied" : "Copy address"}
          </button>
          <a href={`mailto:${personalInfo.email}`} className="email-compose">
            Open mail app <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <p role="status" className="email-status">
          {copyState === "copied" ? "Email address copied." : copyState === "manual"
            ? "Copy the selected address with Ctrl+C / ⌘C, or touch and hold."
            : "You can also copy the address into your preferred email service."}
        </p>
      </div>
    </dialog>,
    document.body,
  );
}

export default function EmailContact({ iconOnly = false, className = "" }: {
  iconOnly?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        href={`mailto:${personalInfo.email}`}
        aria-label={iconOnly ? "Email" : undefined}
        aria-haspopup="dialog"
        title={personalInfo.email}
        className={className}
        style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}
        onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          setOpen(true);
        }}
      >
        <Mail size={iconOnly ? 20 : 14} aria-hidden="true" />
        {!iconOnly && "Email"}
      </a>
      {open && <EmailDialog onClose={() => setOpen(false)} />}
    </>
  );
}
