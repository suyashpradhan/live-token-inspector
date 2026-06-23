"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { EncodingSelect } from "@/components/EncodingSelect";
import { InputArea } from "@/components/InputArea";
import { SamplePicker } from "@/components/SamplePicker";
import { StatsBar, type Stats } from "@/components/StatsBar";
import { TokenStream } from "@/components/TokenStream";
import {
  DEFAULT_ENCODING,
  DEFAULT_SAMPLE,
  SAMPLES,
  type Sample,
} from "@/lib/samples";
import {
  ENCODINGS,
  encode,
  preloadEncoding,
  type EncodingName,
  type Token,
} from "@/lib/tokenizer";
import { useDebounced } from "@/lib/useDebounced";

export function TokenPlayground() {
  const reduceMotion = useReducedMotion();

  const [text, setText] = useState<string>(DEFAULT_SAMPLE.text);
  const [encoding, setEncoding] = useState<EncodingName>(DEFAULT_ENCODING);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(
    DEFAULT_SAMPLE.id,
  );
  const [tokenizing, setTokenizing] = useState<boolean>(true);

  // Remount key for the stream; bumped only on encoding/sample change so that
  // ordinary typing doesn't trigger a full staggered re-flash.
  const [epoch, setEpoch] = useState<number>(0);
  const epochRef = useRef<number>(0);
  const bumpEpoch = () => {
    epochRef.current += 1;
    setEpoch(epochRef.current);
    setHoveredIndex(null);
  };

  const debouncedText = useDebounced(text, 150);

  // Warm both encodings so the first switch and first keystroke feel instant.
  useEffect(() => {
    preloadEncoding(encoding);
    const other = ENCODINGS.find((e) => e.name !== encoding);
    if (other) {
      const id = window.setTimeout(() => preloadEncoding(other.name), 400);
      return () => window.clearTimeout(id);
    }
  }, [encoding]);

  // Real tokenization. Runs off the debounced text so the textarea never
  // janks; a cancellation flag drops stale results when input changes fast.
  useEffect(() => {
    let cancelled = false;
    setTokenizing(true);
    encode(debouncedText, encoding)
      .then((result) => {
        if (!cancelled) {
          setTokens(result);
          setTokenizing(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTokens([]);
          setTokenizing(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedText, encoding]);

  const stats: Stats = useMemo(() => {
    const chars = [...debouncedText].length;
    const trimmed = debouncedText.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const charsPerToken = tokens.length > 0 ? chars / tokens.length : 0;
    return { tokens: tokens.length, chars, words, charsPerToken };
  }, [debouncedText, tokens]);

  const activeLesson = useMemo(
    () => SAMPLES.find((s) => s.id === activeSampleId)?.lesson ?? null,
    [activeSampleId],
  );

  const handleText = (next: string) => {
    setText(next);
    // Free-form editing detaches from any preset (hides its lesson line).
    setActiveSampleId(null);
  };

  const handleEncoding = (name: EncodingName) => {
    if (name === encoding) return;
    setEncoding(name);
    bumpEpoch();
  };

  const handleSample = (sample: Sample) => {
    setText(sample.text);
    setActiveSampleId(sample.id);
    bumpEpoch();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SamplePicker activeId={activeSampleId} onPick={handleSample} />
        <EncodingSelect value={encoding} onChange={handleEncoding} />
      </div>

      <InputArea value={text} onChange={handleText} tokenizing={tokenizing} />

      <AnimatePresence initial={false}>
        {activeLesson && (
          <motion.p
            key={activeLesson}
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="-mt-1 flex items-start gap-2 text-sm text-fg-dim"
          >
            <span aria-hidden className="mt-0.5 text-signal">
              ▸
            </span>
            {activeLesson}
          </motion.p>
        )}
      </AnimatePresence>

      <StatsBar stats={stats} />

      <TokenStream
        tokens={tokens}
        hoveredIndex={hoveredIndex}
        onHover={setHoveredIndex}
        epoch={epoch}
      />
    </div>
  );
}
