"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ENCODINGS, type EncodingName } from "@/lib/tokenizer";

interface EncodingSelectProps {
  value: EncodingName;
  onChange: (name: EncodingName) => void;
}

/** A two-option segmented control; re-tokenization happens on change upstream. */
export function EncodingSelect({ value, onChange }: EncodingSelectProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label="Tokenizer encoding"
      className="inline-flex rounded-xl border border-line bg-ink-inset p-1"
    >
      {ENCODINGS.map((enc) => {
        const active = enc.name === value;
        return (
          <button
            key={enc.name}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(enc.name)}
            className="relative isolate rounded-lg px-3 py-1.5 text-left transition-colors"
          >
            {active && (
              <motion.span
                layoutId="encoding-pill"
                className="absolute inset-0 -z-10 rounded-lg bg-ink-raised ring-1 ring-line"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 520, damping: 40 }
                }
              />
            )}
            <span
              className={`block font-mono text-sm leading-tight ${
                active ? "text-signal" : "text-fg-dim"
              }`}
            >
              {enc.label}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-fg-faint">
              {enc.models}
            </span>
          </button>
        );
      })}
    </div>
  );
}
