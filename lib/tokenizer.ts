/**
 * Real BPE tokenization in the browser via js-tiktoken.
 *
 * The core idea this app teaches: before a model reads text, the text is
 * split into subword "tokens" and each token is mapped to an integer ID.
 * Tokens are byte-level — they operate on the UTF-8 *bytes* of the text, not
 * on characters. That is why a single Devanagari or emoji character can be
 * shredded into several tokens, and why one token can hold a fragment of a
 * multi-byte character that is not valid UTF-8 on its own.
 *
 * We lazy-load each encoding's rank table (they are large) and cache the
 * encoder so switching back is instant.
 */
import type { Tiktoken } from "js-tiktoken/lite";

export type EncodingName = "cl100k_base" | "o200k_base";

export interface EncodingMeta {
  name: EncodingName;
  label: string;
  /** Which model families use this encoding — shown in the selector. */
  models: string;
}

export const ENCODINGS: readonly EncodingMeta[] = [
  { name: "cl100k_base", label: "cl100k_base", models: "GPT-3.5 · GPT-4" },
  { name: "o200k_base", label: "o200k_base", models: "GPT-4o · o-series" },
] as const;

export interface Token {
  /** The integer the model actually sees. */
  id: number;
  /** Best-effort decoded substring for this single token. */
  text: string;
  /**
   * True when this token's bytes do not form a complete UTF-8 sequence on
   * their own (a fragment of a multi-byte character). Decoding it alone
   * yields the replacement character, so we show its raw bytes instead.
   */
  partial: boolean;
  /** Raw UTF-8 bytes for this token (used to render fragments as hex). */
  bytes: number[];
}

/** Internal shape: js-tiktoken keeps a private rank → bytes map at runtime. */
interface TiktokenWithBytes extends Tiktoken {
  textMap: Map<number, Uint8Array>;
}

const REPLACEMENT = "\uFFFD";

// Each entry is loaded once, lazily, then cached.
const rankLoaders: Record<EncodingName, () => Promise<{ default: unknown }>> = {
  cl100k_base: () => import("js-tiktoken/ranks/cl100k_base"),
  o200k_base: () => import("js-tiktoken/ranks/o200k_base"),
};

const encoderCache = new Map<EncodingName, TiktokenWithBytes>();

async function getEncoder(name: EncodingName): Promise<TiktokenWithBytes> {
  const cached = encoderCache.get(name);
  if (cached) return cached;

  const [{ Tiktoken: TiktokenCtor }, ranks] = await Promise.all([
    import("js-tiktoken/lite"),
    rankLoaders[name](),
  ]);

  // The rank module's default export is the TiktokenBPE table.
  const encoder = new TiktokenCtor(
    ranks.default as ConstructorParameters<typeof TiktokenCtor>[0],
  ) as TiktokenWithBytes;

  encoderCache.set(name, encoder);
  return encoder;
}

/**
 * Encode `text` with the given encoding and return one entry per token.
 * Each token is decoded individually so the UI can show exactly which slice
 * of the input it represents — including the byte fragments that have no
 * standalone character form.
 */
export async function encode(
  text: string,
  name: EncodingName,
): Promise<Token[]> {
  if (text.length === 0) return [];

  const encoder = await getEncoder(name);
  const ids = encoder.encode(text);

  return ids.map((id) => {
    const decoded = encoder.decode([id]);
    const bytes = Array.from(encoder.textMap.get(id) ?? []);
    return {
      id,
      text: decoded,
      partial: decoded.includes(REPLACEMENT),
      bytes,
    };
  });
}

/** Warm an encoding in the background so the first keystroke feels instant. */
export function preloadEncoding(name: EncodingName): void {
  void getEncoder(name);
}
