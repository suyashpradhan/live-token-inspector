"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { SAMPLES, type Sample } from "@/lib/samples";

interface SamplePickerProps {
  activeId: string | null;
  onPick: (sample: Sample) => void;
}

/** A small dropdown of presets; each preset demonstrates one lesson. */
export function SamplePicker({ activeId, onPick }: SamplePickerProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const active = SAMPLES.find((s) => s.id === activeId) ?? null;

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-ink-inset px-3 py-2 text-sm text-fg transition-colors hover:border-fg-faint"
      >
        <span className="text-[10px] uppercase tracking-wider text-fg-faint">
          Sample
        </span>
        <span className="font-mono text-fg-dim">
          {active ? active.label : "Choose…"}
        </span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
          className="text-fg-faint"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            role="listbox"
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
            className="absolute left-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-line bg-ink-raised shadow-pop"
          >
            {SAMPLES.map((sample) => {
              const isActive = sample.id === activeId;
              return (
                <li key={sample.id} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(sample);
                      setOpen(false);
                    }}
                    className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-ink-inset ${
                      isActive ? "bg-ink-inset" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 font-mono text-sm text-fg">
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      )}
                      {sample.label}
                    </span>
                    <span className="text-xs leading-snug text-fg-faint">
                      {sample.lesson}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
