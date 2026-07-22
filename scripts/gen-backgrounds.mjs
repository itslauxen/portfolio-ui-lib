// Gera src/lib/backgrounds/catalog.ts e src/components/backgrounds/effects.tsx
// a partir do motor (src/lib/backgrounds/engine.js).
// Uso: node scripts/gen-backgrounds.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const enginePath = path.join(root, "src/lib/backgrounds/engine.js");

// engine.js é ESM; copiamos para .mjs temporário para importar no Node.
const tmp = path.join(os.tmpdir(), `engine.${Date.now()}.mjs`);
fs.copyFileSync(enginePath, tmp);
const { EFFECTS } = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

const meta = EFFECTS.map((e) => ({
  id: e.id,
  name: e.name,
  cat: e.cat,
  desc: e.desc,
  heavy: !!e.heavy,
  gl: /GLBG\(|webgl|experimental-webgl/.test(e.fn.toString()),
  params: e.params,
}));

// ---- catalog.ts ----
const catalog =
  `import type { BackgroundEffect } from "./types";\n\n` +
  `// ============================================================================\n` +
  `// Catálogo gerado a partir do motor (engine.js). Metadados dos ${meta.length} fundos.\n` +
  `// Regenere com: node scripts/gen-backgrounds.mjs\n` +
  `// ============================================================================\n\n` +
  `export const BACKGROUND_CATALOG: BackgroundEffect[] = ${JSON.stringify(meta, null, 2)};\n`;
fs.writeFileSync(path.join(root, "src/lib/backgrounds/catalog.ts"), catalog);

// ---- effects.tsx (um componente por background) ----
const pascal = (s) => s.replace(/(^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, (m, a, b) => b.toUpperCase());
let out =
  `"use client";\n` +
  `// ============================================================================\n` +
  `// Um componente React por background. Gerado a partir do catálogo.\n` +
  `// Uso: <FluidBackground /> ou <AuroraBackground params={{ speed: 2 }} />\n` +
  `// Regenere com: node scripts/gen-backgrounds.mjs\n` +
  `// ============================================================================\n` +
  `import { AnimatedBackground, type BackgroundOwnProps } from "@/components/AnimatedBackground/AnimatedBackground";\n\n`;
const names = [];
for (const e of meta) {
  const nm = pascal(e.id) + "Background";
  names.push([nm, e.id]);
  const desc = (e.desc || "").replace(/\*\//g, "").replace(/\n/g, " ");
  out += `/** ${e.name} — ${e.cat}. ${desc} */\nexport function ${nm}(props: BackgroundOwnProps) {\n  return <AnimatedBackground effectId="${e.id}" {...props} />;\n}\n\n`;
}
out += `// Mapa id -> componente, útil para render dinâmico.\nexport const BACKGROUND_COMPONENTS = {\n`;
for (const [nm, id] of names) out += `  "${id}": ${nm},\n`;
out += `} as const;\n`;
fs.writeFileSync(path.join(root, "src/components/backgrounds/effects.tsx"), out);

console.log(`OK: ${meta.length} efeitos → catalog.ts + effects.tsx`);
