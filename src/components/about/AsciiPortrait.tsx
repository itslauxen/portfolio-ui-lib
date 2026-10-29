"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import s from "./asciiPortrait.module.css";

// Retrato em ASCII (no espírito do AsciiEffect do componentry.dev): a foto
// vira uma grade de caracteres escolhidos pela luminância, coloridos num
// degradê da paleta noite-verde. Uma onda lenta ("flow") mantém a grade
// viva e um ripple segue o mouse; clique/toque revela a foto real.
const CHARS = " .:-=+*#%@"; // do mais escuro ao mais claro
const FONT_SIZE = 8; // px CSS por célula (≈ 55 linhas num retrato de 440px)
const CELL_W = FONT_SIZE * 0.62; // avanço do JetBrains Mono
const BOOST = 1.35; // clareia um pouco (a foto é escura) sem virar tudo "@"
const CONTRAST = 1.3; // espalha a rampa de caracteres pelo rosto
const THRESHOLD = 0.06; // abaixo disso a célula fica vazia
const DITHER = 0.8; // Floyd–Steinberg: textura que faz o rosto ler em poucas linhas
const ZOOM = 1.0; // 1 = a foto inteira (cabeça e ombros) cabe no retrato
// degradê por luminância: verde profundo → acento → menta clara
const COLORS: [number, number, number][] = [
  [22, 70, 44],
  [40, 160, 92],
  [60, 233, 127],
  [200, 255, 226],
];
// ripple do mouse: raio de atuação (px), deslocamento máximo (px),
// velocidade da onda e distância entre cristas — calibrado pra ser sutil
const MOUSE_RADIUS = 110;
const MOUSE_STRENGTH = 4.5;
const MOUSE_SPEED = 3.5;
const MOUSE_FREQ = 0.05;
const FLOW_STRENGTH = 2.2;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
function colorAt(l: number) {
  const p = Math.min(0.9999, Math.max(0, l)) * (COLORS.length - 1);
  const i = Math.floor(p);
  const t = p - i;
  const c0 = COLORS[i];
  const c1 = COLORS[i + 1];
  return `rgb(${mix(c0[0], c1[0], t) | 0},${mix(c0[1], c1[1], t) | 0},${mix(c0[2], c1[2], t) | 0})`;
}

export function AsciiPortrait({
  src,
  photoSrc,
  alt,
  label,
}: {
  /** foto de onde o ASCII é amostrado */
  src: string;
  /** foto mostrada no clique (opcional; padrão = src) */
  photoSrc?: string;
  alt: string;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let stop = false;
    // ctx.font não aceita var(): resolve a família real que o next/font
    // registrou em --font-jbmono (nome com hash) e espera ela carregar —
    // sem isso o canvas caía na sans padrão e o retrato ficava borrado
    const family =
      getComputedStyle(canvas).getPropertyValue("--font-jbmono").trim() ||
      '"JetBrains Mono", ui-monospace, monospace';
    const font = `500 ${FONT_SIZE}px ${family}`;
    let mouse: { x: number; y: number } | null = null;
    let mouseFade = 0; // 0..1, decai depois que o mouse sai
    let visible = true;

    // célula → caractere + cor, recalculado quando a foto carrega ou o tamanho muda
    let cols = 0;
    let rows = 0;
    let cells: { ch: string; color: string }[] = [];
    const img = new Image();
    img.src = src;

    const sample = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h || !img.naturalWidth) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL_W);
      rows = Math.ceil(h / FONT_SIZE);
      // luminância da foto numa grade cols×rows. As células NÃO são quadradas
      // (CELL_W × FONT_SIZE), então o enquadramento é calculado em px CSS
      // (fit cover, centrado) e só depois convertido pra unidades de célula.
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d");
      if (!octx) return;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * ZOOM;
      const pw = img.naturalWidth * scale; // tamanho desenhado, em px CSS
      const ph = img.naturalHeight * scale;
      octx.drawImage(img, (w - pw) / 2 / CELL_W, (h - ph) / 2 / FONT_SIZE, pw / CELL_W, ph / FONT_SIZE);
      const px = octx.getImageData(0, 0, cols, rows).data;
      const lum = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        const l = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
        lum[i] = Math.min(1, Math.max(0, ((l - 0.5) * CONTRAST + 0.5) * BOOST));
      }
      // Floyd–Steinberg: quantiza em CHARS.length níveis espalhando o erro
      // pros vizinhos — é o que dá textura e deixa o rosto legível
      const levels = CHARS.length - 1;
      const q = new Float32Array(lum);
      cells = new Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const old = q[i];
          const nq = Math.round(Math.min(1, Math.max(0, old)) * levels) / levels;
          const err = (old - nq) * DITHER;
          if (c + 1 < cols) q[i + 1] += (err * 7) / 16;
          if (r + 1 < rows) {
            if (c > 0) q[i + cols - 1] += (err * 3) / 16;
            q[i + cols] += (err * 5) / 16;
            if (c + 1 < cols) q[i + cols + 1] += err / 16;
          }
          const ch = lum[i] < THRESHOLD ? " " : CHARS[Math.round(nq * levels)];
          cells[i] = { ch, color: colorAt(lum[i]) };
        }
      }
    };

    const draw = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.font = font;
      ctx.textBaseline = "top";
      const t = now / 1000;
      const flow = reduced ? 0 : FLOW_STRENGTH;
      const m = mouse;
      const mf = reduced ? 0 : mouseFade;
      for (let r = 0; r < rows; r++) {
        const y0 = r * FONT_SIZE;
        for (let c = 0; c < cols; c++) {
          const cell = cells[r * cols + c];
          if (!cell || cell.ch === " ") continue;
          const x0 = c * CELL_W;
          // flow: onda lenta diagonal; ripple: anel que segue o mouse
          let dx = flow * Math.sin(y0 * 0.018 + t * 1.4 + c * 0.02);
          let dy = flow * 0.6 * Math.cos(x0 * 0.02 + t * 1.1);
          if (m && mf > 0) {
            const ddx = x0 - m.x;
            const ddy = y0 - m.y;
            const d = Math.hypot(ddx, ddy);
            if (d < MOUSE_RADIUS && d > 0.001) {
              const k = (1 - d / MOUSE_RADIUS) * mf;
              const wave = Math.sin(d * MOUSE_FREQ - t * MOUSE_SPEED) * MOUSE_STRENGTH * k;
              dx += (ddx / d) * wave;
              dy += (ddy / d) * wave;
            }
          }
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.ch, x0 + dx, y0 + dy);
        }
      }
    };

    // 30 fps bastam pro flow/ripple; a 60 fps eram ~8 mil fillText por quadro
    let last = 0;
    const loop = (now: number) => {
      if (stop) return;
      if (now - last < 33) {
        raf = requestAnimationFrame(loop);
        return;
      }
      last = now;
      if (visible && !document.hidden) {
        // o ripple decai em ~0,5 s depois que o mouse sai
        if (!mouse && mouseFade > 0) mouseFade = Math.max(0, mouseFade - 0.08);
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };

    img.onload = async () => {
      try {
        await document.fonts.load(font);
      } catch {
        /* segue com o fallback */
      }
      if (stop) return;
      sample();
      if (reduced) {
        draw(0);
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      mouseFade = 1;
    };
    const onLeave = () => {
      mouse = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => {
      sample();
      if (reduced) draw(0);
    });
    ro.observe(canvas);
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([e]) => (visible = e.isIntersecting))
        : null;
    io?.observe(canvas);

    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      io?.disconnect();
    };
  }, [src, reduced]);

  return (
    <button
      type="button"
      className={`${s.portrait} ${revealed ? s.revealed : ""}`}
      onClick={() => setRevealed((v) => !v)}
      aria-pressed={revealed}
      aria-label={label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoSrc ?? src} alt={alt} className={s.photo} width={1000} height={1000} />
      <canvas ref={canvasRef} className={s.ascii} aria-hidden="true" />
    </button>
  );
}
