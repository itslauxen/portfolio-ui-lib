// Espelho em TS dos tokens de marca, use quando precisar das cores no JS
// (ex.: passar a cor de destaque para um <canvas>). Mantenha em sincronia
// com os valores de tokens.css. O site é dark-only (sem seletor de tema).

export const tokens = {
  bg: "#07070d",
  text: "#ececf5",
  muted: "#9a9ab5",
  accent: "#7c5cff",
  accent2: "#00e5ff",
  accent3: "#ff4d9d",
  good: "#39e0a3",
} as const;
