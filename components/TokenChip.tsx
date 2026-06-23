"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import type { Token } from "@/lib/tokenizer";

interface TokenChipProps {
  token: Token;
  /** Position in the stream — drives the cycling tile color. */
  colorIndex: number;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
  variants: Variants;
}

// Six light tiles, cycled so adjacent token boundaries are always obvious.
const TILE_BG = [
  "bg-tile-1",
  "bg-tile-2",
  "bg-tile-3",
  "bg-tile-4",
  "bg-tile-5",
  "bg-tile-6",
] as const;

/** Render whitespace as faded glyphs so it's visible as part of the token. */
function renderVisibleText(text: string): ReactNode {
  return [...text].map((char, i) => {
    if (char === " ")
      return (
        <span key={i} className="text-ink/35">
          ·
        </span>
      );
    if (char === "\n")
      return (
        <span key={i} className="text-ink/35">
          ↵
        </span>
      );
    if (char === "\t")
      return (
        <span key={i} className="text-ink/35">
          →
        </span>
      );
    return <span key={i}>{char}</span>;
  });
}

function bytesToHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
}

export function TokenChip({
  token,
  colorIndex,
  hovered,
  onHover,
  variants,
}: TokenChipProps) {
  const { id, text, partial, bytes } = token;
  const tile = TILE_BG[colorIndex % TILE_BG.length];

  // A fragment token holds raw bytes that aren't a whole character, so we
  // show the bytes themselves rather than a broken glyph.
  const face: ReactNode = partial ? (
    <span className="font-mono text-xs">{bytesToHex(bytes)}</span>
  ) : (
    renderVisibleText(text)
  );

  return (
    <motion.button
      type="button"
      layout
      variants={variants}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onClick={() => onHover(!hovered)}
      aria-label={
        partial
          ? `Token ${id}, partial UTF-8 bytes ${bytesToHex(bytes)}`
          : `Token ${id}, text ${JSON.stringify(text)}`
      }
      className={`relative inline-flex max-w-full items-center rounded-md px-1.5 py-1 font-mono text-[15px] leading-none whitespace-pre outline-none ${
        partial
          ? "bg-frag text-frag-fg ring-1 ring-inset ring-white/10"
          : `${tile} text-ink shadow-tile`
      }`}
    >
      {face}

      <AnimatePresence>
        {hovered && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-[260px] -translate-x-1/2 rounded-lg border border-line bg-ink-raised px-3 py-2 text-left shadow-pop"
          >
            <span className="block font-mono text-xs text-signal">
              #{id}
            </span>
            <span className="mt-1 block break-words font-mono text-xs text-fg">
              {partial ? (
                <>
                  <span className="text-fg-dim">bytes</span> {bytesToHex(bytes)}
                </>
              ) : (
                JSON.stringify(text)
              )}
            </span>
            {partial && (
              <span className="mt-1 block text-[11px] leading-snug text-fg-faint">
                A fragment of a multi-byte character.
              </span>
            )}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-line bg-ink-raised" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
