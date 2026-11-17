"use client";

// Loader "gooey" em cubo: oito pontos nos vértices de um cubo que gira em 3D. Os da frente ficam
// maiores, os de trás menores, e eles se fundem quando um passa na frente do outro.
// A rotação é calculada a cada quadro (não dá para descrever um cubo girando só com keyframes) e
// escrita direto no estilo de cada ponto, sem re-renderizar o React.
import { useEffect, useId, useRef, type CSSProperties } from "react";
import styles from "./GooeyCube.module.css";

interface GooeyCubeProps {
  /** Diâmetro do ponto no tamanho médio, em px. */
  size?: number;
  /** Aresta do cubo, em múltiplos do ponto. */
  edge?: number;
  color?: string;
  /** Duração de uma volta, em segundos. */
  speed?: number;
  /** Inclinação do cubo, em graus (0 = visto de frente). */
  tilt?: number;
  label?: string;
  className?: string;
}

const VERTICES = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as const)));
const CAMERA = 5; // distância da câmera, em meias arestas: dá a perspectiva

const GooeyCube = ({ size = 18, edge = 3, color = "#3ce97f", speed = 4, tilt = 28, label = "Carregando", className = "" }: GooeyCubeProps) => {
  const id = `goo${useId().replace(/[^a-z0-9]/gi, "")}`;
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const half = (size * edge) / 2;
  const box = half * 2 * 1.75 + size * 2; // a diagonal do cubo em perspectiva + folga do desfoque

  useEffect(() => {
    const lento = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 4 : 1;
    const inc = (tilt * Math.PI) / 180;
    let raf = 0;
    const t0 = performance.now();
    const frame = (agora: number) => {
      const a = ((agora - t0) / 1000 / (speed * lento)) * Math.PI * 2;
      const b = inc + Math.sin(a * 0.5) * 0.25; // a inclinação balança de leve, para as faces se alternarem
      const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      VERTICES.forEach(([x, y, z], i) => {
        const el = dots.current[i];
        if (!el) return;
        // gira em torno do eixo vertical, depois inclina em torno do horizontal
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        const p = CAMERA / (CAMERA - z2); // perto da câmera = maior e mais afastado do centro
        el.style.transform = `translate(${(x1 * half * p).toFixed(2)}px, ${(y2 * half * p).toFixed(2)}px) scale(${p.toFixed(3)})`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [half, speed, tilt]);

  return (
    <span className={`${styles.wrap} ${className}`} role="status" aria-label={label}
      style={{ "--s": `${size}px`, "--c": color, width: box, height: box, filter: `url(#${id})` } as CSSProperties}>
      <svg width="0" height="0" className={styles.defs} aria-hidden="true">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.22} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      {VERTICES.map((_, i) => (
        <span key={i} ref={(el) => { dots.current[i] = el; }} className={styles.dot} />
      ))}
    </span>
  );
};

export default GooeyCube;
