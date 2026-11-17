// Gera public/lab-thumbs/<id>.webp: uma foto de cada item do lab, para a grade.
// Abre a página técnica /thumb/<id> num Chrome sem janela (controlado pelo protocolo de depuração),
// deixa o efeito rodar em tempo real, passeia o mouse pela tela (vários efeitos só aparecem com o
// cursor) e fotografa.
// Precisa do site rodando (npm run dev), do Chrome, do cwebp (brew install webp) e de Node 22+.
// Uso: node scripts/gen-lab-thumbs.mjs [http://localhost:3000] [id1 id2 ...]
import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/lab-thumbs");
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORTA = 9333;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lab-thumbs-"));
fs.mkdirSync(out, { recursive: true });

const todos = await (await fetch(`${base}/thumb/ids`)).json();
const pedidos = process.argv.slice(3);
const ids = pedidos.length ? todos.filter((x) => pedidos.includes(x.id)) : todos;

const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--no-first-run", "--mute-audio",
  `--user-data-dir=${path.join(tmp, "perfil")}`, `--remote-debugging-port=${PORTA}`, "about:blank"], { stdio: "ignore" });
for (let i = 0; i < 50; i++) { try { await fetch(`http://127.0.0.1:${PORTA}/json/version`); break; } catch { await espera(200); } }

// uma aba por item, falando o protocolo por WebSocket
async function aba(url) {
  const alvo = await (await fetch(`http://127.0.0.1:${PORTA}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((ok, erro) => { ws.onopen = ok; ws.onerror = erro; });
  let n = 0;
  const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } };
  const cmd = (method, params = {}) => new Promise((ok) => { const id = ++n; pend.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
  return { cmd, fechar: async () => { ws.close(); await fetch(`http://127.0.0.1:${PORTA}/json/close/${alvo.id}`).catch(() => {}); } };
}

let feitos = 0;
const falhas = [];
async function foto({ id, componente }) {
  // fundos enchem a tela: foto grande, reduzida. Componentes têm tamanho próprio: janela menor,
  // para não ficarem perdidos no meio do quadro.
  const [w, h] = componente ? [960, 600] : [1280, 800];
  const png = path.join(tmp, `${id}.png`);
  let t;
  try {
    t = await aba("about:blank");
    await t.cmd("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await t.cmd("Page.navigate", { url: `${base}/thumb/${id}` });
    await espera(4500);
    // o mouse desenha um "S" pela tela e para perto do centro
    for (let i = 0; i <= 60; i++) {
      const p = i / 60;
      await t.cmd("Input.dispatchMouseEvent", { type: "mouseMoved", x: Math.round(w * (0.15 + 0.7 * p)), y: Math.round(h * (0.5 + 0.28 * Math.sin(p * Math.PI * 2))), pointerType: "mouse" });
      await espera(28);
    }
    await espera(350);
    const { data } = await t.cmd("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(png, Buffer.from(data, "base64"));
    await run("cwebp", ["-quiet", "-q", "78", "-resize", "640", "400", png, "-o", path.join(out, `${id}.webp`)]);
    feitos++;
  } catch {
    falhas.push(id);
  } finally {
    await t?.fechar();
  }
}
// três por vez
const fila = [...ids];
await Promise.all(Array.from({ length: 3 }, async () => { while (fila.length) await foto(fila.shift()); }));
chrome.kill();
await espera(300);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`OK: ${feitos} miniaturas → public/lab-thumbs/` + (falhas.length ? `\nFalharam: ${falhas.join(", ")}` : ""));
