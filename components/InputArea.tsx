"use client";

interface InputAreaProps {
  value: string;
  onChange: (next: string) => void;
  tokenizing: boolean;
}

/** The large editable text well. Tokenization runs (debounced) on input. */
export function InputArea({ value, onChange, tokenizing }: InputAreaProps) {
  return (
    <div className="relative">
      <label htmlFor="source-text" className="sr-only">
        Text to tokenize
      </label>
      <textarea
        id="source-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Type or paste anything — watch it split into tokens below."
        className="h-44 w-full resize-y rounded-2xl border border-line bg-ink-inset px-4 py-3.5 font-mono text-[15px] leading-relaxed text-fg shadow-panel outline-none transition-colors placeholder:text-fg-faint focus:border-signal/60 sm:h-40"
      />
      <div className="pointer-events-none absolute bottom-3 right-4 flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            tokenizing ? "bg-signal animate-livepulse" : "bg-fg-faint"
          }`}
        />
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          {tokenizing ? "tokenizing" : "live"}
        </span>
      </div>
    </div>
  );
}
