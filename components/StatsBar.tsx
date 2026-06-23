"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";

export interface Stats {
  tokens: number;
  chars: number;
  words: number;
  charsPerToken: number;
}

interface StatsBarProps {
  stats: Stats;
}

interface Metric {
  key: keyof Stats;
  label: string;
  decimals: number;
}

const METRICS: readonly Metric[] = [
  { key: "tokens", label: "Tokens", decimals: 0 },
  { key: "chars", label: "Characters", decimals: 0 },
  { key: "words", label: "Words", decimals: 0 },
  { key: "charsPerToken", label: "Chars / token", decimals: 2 },
];

// English text clusters near ~4 chars per token. A noticeable deviation means
// the input is non-English, code, or symbol-heavy — all of which tokenize
// less efficiently.
const LOW = 3;
const HIGH = 5;

export function StatsBar({ stats }: StatsBarProps) {
  const reduceMotion = useReducedMotion();
  const ratio = stats.charsPerToken;
  const showHint = stats.tokens > 0 && (ratio < LOW || ratio > HIGH);

  return (
    <div className="rounded-2xl border border-line bg-ink-raised p-1.5 shadow-panel">
      <dl className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {METRICS.map((metric) => (
          <div
            key={metric.key}
            className="rounded-xl bg-ink-inset px-4 py-3"
          >
            <dt className="text-[10px] uppercase tracking-wider text-fg-faint">
              {metric.label}
            </dt>
            <dd className="mt-1 font-mono text-2xl tabular-nums text-fg">
              <CountUp value={stats[metric.key]} decimals={metric.decimals} />
            </dd>
          </div>
        ))}
      </dl>

      <AnimatePresence initial={false}>
        {showHint && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className="overflow-hidden"
          >
            <span className="mt-1.5 flex items-center gap-2 rounded-xl bg-signal/10 px-4 py-2.5 text-sm text-signal">
              <span className="font-mono text-xs">
                {ratio < LOW ? "↓" : "↑"}
              </span>
              non-English, code or symbols tokenize differently
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
