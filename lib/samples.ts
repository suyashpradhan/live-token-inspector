import type { EncodingName } from "@/lib/tokenizer";

export interface Sample {
  id: string;
  label: string;
  /** One-line lesson shown under the picker when this sample is active. */
  lesson: string;
  text: string;
}

/**
 * Each sample is chosen to make one tokenization fact visible:
 *  - English sits near the ~4 chars/token English baseline.
 *  - Hindi shows the multilingual "token tax": the same idea costs far more
 *    tokens, and under cl100k_base most are raw byte fragments.
 *  - JSON shows structural overhead — braces, quotes and indentation each
 *    cost tokens.
 *  - Code shows punctuation and templating splitting into many tokens.
 *  - "strawberry" shows a single word breaking into subword pieces.
 */
export const SAMPLES: readonly Sample[] = [
  {
    id: "english",
    label: "English sentence",
    lesson: "English averages roughly four characters per token.",
    text: "The quick brown fox jumps over the lazy dog.",
  },
  {
    id: "hindi",
    label: "Hindi (Devanagari)",
    lesson:
      "The same sentence in Hindi costs many more tokens — the multilingual token tax.",
    text: "तेज़ भूरी लोमड़ी आलसी कुत्ते के ऊपर से कूदती है।",
  },
  {
    id: "json",
    label: "JSON object",
    lesson: "Braces, quotes and indentation are all paid for in tokens.",
    text: '{\n  "name": "Ada",\n  "age": 36,\n  "tags": ["math", "code"]\n}',
  },
  {
    id: "code",
    label: "Code snippet",
    lesson: "Punctuation and template syntax fragment into many small tokens.",
    text: "function greet(name: string) {\n  return `Hello, ${name}!`;\n}",
  },
  {
    id: "strawberry",
    label: 'The word "strawberry"',
    lesson:
      "One word, several subword tokens — and the split changes by encoding.",
    text: "strawberry",
  },
] as const;

export const DEFAULT_SAMPLE = SAMPLES[0];
export const DEFAULT_ENCODING: EncodingName = "cl100k_base";
