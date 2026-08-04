// Gera public/component-src/<Nome>.txt com o código-fonte de cada componente
// de shader (backgrounds/shaders) e demo (demos), incluindo o CSS module.
// A biblioteca usa isso no "copiar componente" para entregar o arquivo inteiro.
// Uso: node scripts/gen-component-sources.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/component-src");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const srcDirs = [
  path.join(root, "src/components/backgrounds/shaders"),
  path.join(root, "src/components/demos"),
];

let count = 0;
for (const base of srcDirs) {
  if (!fs.existsSync(base)) continue;
  for (const name of fs.readdirSync(base)) {
    const dir = path.join(base, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    const tsx = path.join(dir, `${name}.tsx`);
    if (!fs.existsSync(tsx)) continue;

    let out = fs.readFileSync(tsx, "utf8");
    const css = path.join(dir, `${name}.module.css`);
    if (fs.existsSync(css)) {
      out +=
        `\n\n/* ============================================================\n` +
        `   ${name}.module.css\n` +
        `   ============================================================ */\n` +
        fs.readFileSync(css, "utf8");
    }
    fs.writeFileSync(path.join(outDir, `${name}.txt`), out);
    count++;
  }
}
console.log(`OK: ${count} fontes → public/component-src/`);
