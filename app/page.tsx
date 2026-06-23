import { TokenPlayground } from "@/components/TokenPlayground";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:pt-14">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal animate-livepulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
            Real-time BPE tokenizer
          </span>
        </div>

        <h1 className="font-mono text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Live Token Inspector
        </h1>

        {/* Measurement-ruler strip: the one decorative signature, tying the
            page to the idea of measuring text in discrete units. */}
        <div className="ruler mt-4 h-3 w-full rounded-sm opacity-70" />

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-dim">
          A model never sees your text. It sees integers. Each chunk below is
          one <span className="text-fg">token</span> a subword piece mapped to
          an ID. English runs about four characters per token; spaces and
          punctuation cost tokens too, and other languages and code can cost far
          more.
        </p>
      </header>

      <TokenPlayground />

      <footer className="mt-12 border-t border-line-soft pt-6 text-sm leading-relaxed text-fg-faint">
        Tokenization runs entirely in your browser via{" "}
        <span className="font-mono text-fg-dim">js-tiktoken</span>. Light tiles
        are whole-character tokens; slate tiles are raw byte fragments of a
        multi-byte character. Hover or tap any token to see its integer ID and
        exact text.
      </footer>
    </main>
  );
}
