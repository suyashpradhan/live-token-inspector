# Live Token Inspector

See exactly how an LLM tokenizer turns text into integer tokens — in real time,
100% in the browser, using real BPE via [`js-tiktoken`](https://github.com/dqbd/tiktoken).

- **Real tokenization.** No stubs. `cl100k_base` (GPT-3.5/4) and `o200k_base`
  (GPT-4o / o-series) rank tables are lazy-loaded and run client-side.
- **Honest byte view.** Tokens are byte-level. A single Devanagari character or
  emoji is often split across several tokens; fragments that aren't valid UTF-8
  on their own are shown as raw hex bytes (slate tiles) instead of mojibake.
- **Teaching samples.** English, the same sentence in Hindi (the multilingual
  "token tax"), a JSON object (structural overhead), a code snippet, and the
  word *strawberry* (subword splitting).

## Stack

Next.js (App Router) · TypeScript (strict, no `any`) · Tailwind CSS ·
Framer Motion · js-tiktoken. No backend, no env vars, no database.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy

Zero configuration. Push to a Git repo and import into Vercel, or:

```bash
npm i -g vercel && vercel
```

All tokenization happens in the browser, so there is nothing to configure.

## How it works

`lib/tokenizer.ts` lazy-loads each encoding's rank table, constructs a
`Tiktoken` encoder, and exposes `encode(text, encoding)`. It runs the real BPE
`encode`, then decodes each resulting ID individually to recover the exact slice
of input that token represents. `prefers-reduced-motion` is respected throughout.
