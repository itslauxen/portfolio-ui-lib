"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

// ============================================================================
// JarvisCore, campo de partículas em <canvas> 2D com matemática pseudo-3D.
// Portado de nova-notes (sem three.js): as formas são geradas no espaço 3D,
// giram no próprio eixo, recebem inclinação e são projetadas em perspectiva -
// os pontos da frente ficam maiores/brilhantes e os de trás menores/apagados.
// Arraste (mouse ou dedo) para girar/inclinar; o cursor repele as partículas.
// Funciona no PC e no mobile (pointer events).
// ============================================================================

const TAU = Math.PI * 2;
const SWAP_MS = 8000;
const INCL = 0.35; // inclinação do disco
const ROLL = 0;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return { h: hue, s: s * 100, l: l * 100 };
}

interface Point3 { x: number; y: number; z: number; }

/* ---------- geradores de formas 3D (origem no centro) ---------- */
function buildGalaxy(R: number, count: number): Point3[] {
  const arms = 4, pts: Point3[] = [];
  for (let i = 0; i < count; i++) {
    const bulge = Math.random() < 0.18;
    const r = bulge ? Math.pow(Math.random(), 2) * R * 0.28 : Math.sqrt(Math.random()) * R;
    const base = ((i % arms) / arms) * TAU;
    const twist = (r / R) * 3.2;
    const spread = (Math.random() - 0.5) * (bulge ? 1.6 : 0.5);
    const a = base + twist + spread;
    const thick = (Math.random() - 0.5) * (bulge ? R * 0.18 : R * 0.04);
    pts.push({ x: Math.cos(a) * r, y: thick, z: Math.sin(a) * r });
  }
  return pts;
}
function buildPlanetRings(R: number, count: number): Point3[] {
  const Rp = R * 0.34, pts: Point3[] = [];
  for (let i = 0; i < count; i++) {
    if (i < count * 0.4) {
      const u = Math.random() * TAU, v = Math.acos(2 * Math.random() - 1);
      const rr = Rp * Math.cbrt(Math.random());
      pts.push({ x: rr * Math.sin(v) * Math.cos(u), y: rr * Math.cos(v), z: rr * Math.sin(v) * Math.sin(u) });
    } else {
      const a = Math.random() * TAU, rr = Rp * 1.55 + Math.random() * Rp * 1.1;
      pts.push({ x: Math.cos(a) * rr, y: (Math.random() - 0.5) * R * 0.02, z: Math.sin(a) * rr });
    }
  }
  return pts;
}
function buildSolarSystem(R: number, count: number): Point3[] {
  const radii = [0.28, 0.44, 0.6, 0.76, 0.9, 1.0].map((f) => f * R);
  const pts: Point3[] = [];
  for (let i = 0; i < count; i++) {
    if (i < count * 0.12) {
      const u = Math.random() * TAU, v = Math.acos(2 * Math.random() - 1);
      const rr = R * 0.11 * Math.cbrt(Math.random());
      pts.push({ x: rr * Math.sin(v) * Math.cos(u), y: rr * Math.cos(v), z: rr * Math.sin(v) * Math.sin(u) });
    } else {
      const ring = radii[i % radii.length], a = Math.random() * TAU;
      const rr = ring + (Math.random() - 0.5) * R * 0.03;
      pts.push({ x: Math.cos(a) * rr, y: (Math.random() - 0.5) * R * 0.02, z: Math.sin(a) * rr });
    }
  }
  return pts;
}
function buildTorus(R: number, count: number): Point3[] {
  const Rmaj = R * 0.66, Rmin = R * 0.3, pts: Point3[] = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random() * TAU, v = Math.random() * TAU;
    const rr = Rmaj + Rmin * Math.cos(v);
    pts.push({ x: rr * Math.cos(u), y: Rmin * Math.sin(v), z: rr * Math.sin(u) });
  }
  return pts;
}

const SCENES = [
  { gen: buildGalaxy, diff: true, speed: 0.13 },
  { gen: buildPlanetRings, diff: false, speed: 0.06 },
  { gen: buildSolarSystem, diff: true, speed: 0.14 },
  { gen: buildTorus, diff: false, speed: 0.18 },
];

interface Particle {
  x: number; y: number; bx: number; by: number; bz: number;
  phase: number; orbitR: number; orbitSpeed: number; size: number; lum: number; tw: number;
}

export interface JarvisCoreProps {
  /** Cor de destaque das partículas (hex). Padrão: violeta da marca. */
  color?: string;
  /** Modo do tema (light apaga um pouco as partículas). */
  mode?: "dark" | "light";
  /** Quantidade de partículas. Padrão 3000 (use menos p/ mobile fraco). */
  count?: number;
  className?: string;
  style?: CSSProperties;
}

export default function JarvisCore({
  color = "#7c5cff",
  mode = "dark",
  count = 3000,
  className,
  style,
}: JarvisCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  const modeRef = useRef(mode);
  colorRef.current = color;
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    if (!ctx || !parent) return;

    let W = 0, H = 0, maxR = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: 0, y: 0, bx: 0, by: 0, bz: 0,
        phase: Math.random() * TAU,
        orbitR: 1.2 + Math.random() * 3,
        orbitSpeed: 0.4 + Math.random() * 1.1,
        size: 0.9 + Math.random() * 1.6,
        lum: 55 + Math.random() * 28,
        tw: Math.random() * TAU,
      });
    }

    let sceneIndex = 0;
    const applyScene = (idx: number, initial = false) => {
      const pts = SCENES[idx].gen(maxR, count);
      for (let i = 0; i < count; i++) {
        particles[i].bx = pts[i].x;
        particles[i].by = pts[i].y;
        particles[i].bz = pts[i].z;
        if (initial) {
          particles[i].x = Math.random() * W;
          particles[i].y = Math.random() * H;
        }
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      W = rect.width; H = rect.height;
      maxR = Math.min(W, H) * 0.45;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applyScene(sceneIndex);
    };

    const mouse = { x: -9999, y: -9999 };
    let dragging = false, lastX = 0, lastY = 0, userRot = 0, userTilt = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
      if (dragging) {
        userRot += (e.clientX - lastX) * 0.006;
        userTilt = Math.max(-0.5, Math.min(1.45, userTilt + (e.clientY - lastY) * 0.004));
        lastX = e.clientX; lastY = e.clientY;
      }
    };
    const onLeave = () => { dragging = false; mouse.x = -9999; mouse.y = -9999; };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerup", onLeave);
    window.addEventListener("pointercancel", onLeave);
    window.addEventListener("resize", resize);

    resize();
    applyScene(0, true);

    const swap = window.setInterval(() => {
      sceneIndex = (sceneIndex + 1) % SCENES.length;
      applyScene(sceneIndex);
    }, SWAP_MS);

    let raf = 0, t = 0;
    const cosR = Math.cos(ROLL), sinR = Math.sin(ROLL);

    const render = () => {
      if (!dragging) t += 0.016;
      ctx.clearRect(0, 0, W, H);
      const cosI = Math.cos(INCL + userTilt), sinI = Math.sin(INCL + userTilt);
      const { h, s } = hexToHsl(colorRef.current);
      const sat = Math.min(95, Math.max(45, s));
      const light = modeRef.current === "light";
      const cx = W / 2;
      const cy = H / 2 - 20 - (W <= 760 ? H * 0.06 : 0);
      const scene = SCENES[sceneIndex];
      const focal = maxR * 2.4;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const rad = Math.hypot(p.bx, p.bz);
        const spin = (scene.diff ? (scene.speed * t) / Math.max(0.4, rad / (maxR * 0.5)) : scene.speed * t) + userRot;
        const cs = Math.cos(spin), sn = Math.sin(spin);
        const rx = p.bx * cs + p.bz * sn;
        const rz = -p.bx * sn + p.bz * cs;
        const ry = p.by;
        const y2 = ry * cosI - rz * sinI;
        const z2 = ry * sinI + rz * cosI;
        const px = rx * cosR - y2 * sinR;
        const py = rx * sinR + y2 * cosR;
        const scale = focal / (focal + z2);
        const sx = cx + px * scale;
        const sy = cy + py * scale;
        p.x += (sx - p.x) * 0.1;
        p.y += (sy - p.y) * 0.1;

        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 9000) {
          const f = (9000 - md2) / 9000;
          const d = Math.sqrt(md2) || 1;
          p.x += (mdx / d) * f * 6;
          p.y += (mdy / d) * f * 6;
        }

        const ox = Math.cos(t * p.orbitSpeed + p.phase) * p.orbitR;
        const oy = Math.sin(t * p.orbitSpeed + p.phase) * p.orbitR;
        const depth = clamp((scale - 0.7) / 1.0, 0, 1);
        const size = p.size * (0.5 + depth * 1.1);
        const alpha = (0.28 + depth * 0.62) * (0.75 + Math.sin(t * 1.6 + p.tw) * 0.25);
        const lum = light ? p.lum - 18 : p.lum;
        ctx.fillStyle = `hsl(${h} ${sat}% ${lum}% / ${clamp(alpha, 0, 1)})`;
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, Math.max(0.4, size), 0, TAU);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(swap);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onLeave);
      window.removeEventListener("pointercancel", onLeave);
    };
  }, [count]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block", touchAction: "none" }}
      />
    </div>
  );
}
