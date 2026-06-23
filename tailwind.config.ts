import type { Config } from "tailwindcss";

/**
 * Design tokens for "Live Token Inspector".
 * Direction: a calm laboratory instrument. Dark graphite shell, a single
 * cyan signal accent, and bright physical "tiles" for tokens. The token
 * tiles are the hero, so the shell stays quiet.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1116", // app background
          raised: "#161A22", // panels
          inset: "#10141B", // textarea / wells
        },
        line: {
          DEFAULT: "#2A313D", // borders
          soft: "#212834", // hairlines
        },
        fg: {
          DEFAULT: "#E8EBF1", // primary text
          dim: "#99A2B4", // secondary text
          faint: "#5C6678", // tertiary / whitespace glyphs
        },
        signal: {
          DEFAULT: "#5AD1E3", // the one accent
          press: "#2BB6C9",
        },
        // Token tile palette: light tiles read clearly against the dark shell
        // and cycle so adjacent token boundaries are unmistakable. All pair
        // with near-black tile text for high contrast.
        tile: {
          1: "#B7E2C9",
          2: "#BBD3F2",
          3: "#F3D3B5",
          4: "#E6C9EC",
          5: "#EEE2A4",
          6: "#BFE0DD",
        },
        // Partial byte-fragment tokens (e.g. one Devanagari char split across
        // several byte tokens) get a distinct slate tile to signal "not a
        // whole character — raw UTF-8 bytes".
        frag: {
          DEFAULT: "#39414F",
          fg: "#C7D0DF",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        tile: "0 1px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)",
        panel: "0 1px 0 rgba(255,255,255,0.03) inset, 0 18px 50px -28px rgba(0,0,0,0.9)",
        pop: "0 12px 30px -10px rgba(0,0,0,0.8)",
      },
      keyframes: {
        livepulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.7)" },
        },
      },
      animation: {
        livepulse: "livepulse 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
