"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { Token } from "@/lib/tokenizer";
import { TokenChip } from "@/components/TokenChip";

interface TokenStreamProps {
  tokens: Token[];
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  /**
   * Bumped on encoding switch or sample load. Remounting on epoch change
   * triggers a brief staggered entrance; while typing the epoch is stable, so
   * only edited chips animate (no full re-flash).
   */
  epoch: number;
}

export function TokenStream({
  tokens,
  hoveredIndex,
  onHover,
  epoch,
}: TokenStreamProps) {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.012 },
    },
  };

  const chipVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, scale: 1 },
        show: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.82 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
        },
        exit: { opacity: 0, scale: 0.82, transition: { duration: 0.12 } },
      };

  if (tokens.length === 0) {
    return (
      <div className="flex min-h-[8rem] items-center justify-center rounded-2xl border border-dashed border-line px-6 py-10 text-center">
        <p className="max-w-sm text-sm text-fg-faint">
          Tokens appear here. Each tile is one token, the integer the model
          actually reads. Notice that spaces and punctuation cost tokens too.
        </p>
      </div>
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        key={epoch}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-ink-raised p-4 shadow-panel"
      >
        <AnimatePresence initial={false}>
          {tokens.map((token, index) => (
            // Key by position + id so an edit only re-animates changed chips
            // and keeps a stable identity for the untouched prefix.
            <TokenChip
              key={`${index}:${token.id}`}
              token={token}
              colorIndex={index}
              hovered={hoveredIndex === index}
              onHover={(h) => onHover(h ? index : null)}
              variants={chipVariants}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
