"use client";

// Rastro de cursor com efeito dither (matriz de Bayer 4x4): um cometa de
// pixels lima segue o mouse, quantizado em blocos chunky de terminal.
// Canvas 2D em baixa resolução ampliado com image-rendering: pixelated
// (composita como camada DOM normal, sem custo de contexto WebGL).
// Overlay fixo sem capturar eventos; desativado em touch e reduced-motion.
import { useEffect, useRef } from "react";

const MAX_PTS = 24;
const SCALE = 4; // 1 pixel do efeito = 4px de CSS (dá o chunky)

// Matriz de Bayer 4x4 clássica, normalizada 0..1.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16);

// Cores (RGBA em bytes): lima #c6ff3a e núcleo mais claro.
const LIME = [198, 255, 58] as const;
const CORE = [225, 255, 150] as const;

export function CursorDither() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    // Só onde existe mouse de verdade e o usuário aceita motion.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let img: ImageData;
    let px: Uint32Array;
    let intensity: Float32Array;

    const resize = () => {
      W = Math.ceil(window.innerWidth / SCALE);
      H = Math.ceil(window.innerHeight / SCALE);
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
      px = new Uint32Array(img.data.buffer);
      intensity = new Float32Array(W * H);
    };
    resize();
    window.addEventListener("resize", resize);

    // Trilha: pontos com idade; mousemove adiciona, o tempo envelhece.
    const pts: { x: number; y: number; age: number }[] = [];
    let last = { x: -1e3, y: -1e3 };
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / SCALE;
      const y = e.clientY / SCALE;
      const dx = x - last.x, dy = y - last.y;
      if (dx * dx + dy * dy < 1.2) return; // ignora micro-movimentos
      last = { x, y };
      pts.unshift({ x, y, age: 0 });
      if (pts.length > MAX_PTS) pts.length = MAX_PTS;
    };
    window.addEventListener("mousemove", onMove);

    // Little-endian: ABGR ao escrever Uint32.
    const pack = (r: number, g: number, b: number, a: number) =>
      (a << 24) | (b << 16) | (g << 8) | r;
    const COL_ON = pack(LIME[0], LIME[1], LIME[2], 216);
    const COL_CORE = pack(CORE[0], CORE[1], CORE[2], 235);

    let raf = 0;
    let prev = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      for (const p of pts) p.age += dt * 1.6;
      while (pts.length && pts[pts.length - 1].age >= 1) pts.pop();

      intensity.fill(0);
      // Acumula gaussianas só na caixa ao redor de cada ponto (barato).
      for (const p of pts) {
        const life = 1 - p.age;
        const r = 4 + 11 * life;
        const r2 = r * r;
        const x0 = Math.max(0, Math.floor(p.x - r * 1.6));
        const x1 = Math.min(W - 1, Math.ceil(p.x + r * 1.6));
        const y0 = Math.max(0, Math.floor(p.y - r * 1.6));
        const y1 = Math.min(H - 1, Math.ceil(p.y + r * 1.6));
        for (let y = y0; y <= y1; y++) {
          const dy = y - p.y;
          const row = y * W;
          for (let x = x0; x <= x1; x++) {
            const dx = x - p.x;
            intensity[row + x] += Math.exp(-(dx * dx + dy * dy) / r2) * life;
          }
        }
      }

      // Dither de Bayer: liga o pixel quando a intensidade vence o limiar.
      px.fill(0);
      for (let y = 0; y < H; y++) {
        const row = y * W;
        const by = (y & 3) * 4;
        for (let x = 0; x < W; x++) {
          const I = intensity[row + x];
          if (I <= 0.06) continue;
          const t = BAYER[by + (x & 3)];
          const th = t * 0.9 + 0.06;
          if (I > th + 0.7) px[row + x] = COL_CORE;
          else if (I > th) px[row + x] = COL_ON;
        }
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        // Atrás do conteúdo (texto, cards, nav), acima do fundo da página.
        zIndex: -1,
        imageRendering: "pixelated",
      }}
    />
  );
}
