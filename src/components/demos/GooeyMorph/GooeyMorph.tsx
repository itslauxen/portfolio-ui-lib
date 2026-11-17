"use client";

// Loader "gooey" de metamorfose: quatro gotas passeiam em laços diferentes em volta do centro e se
// fundem numa massa só, que não para de mudar de forma. Filtro SVG (desfoque + contraste no alfa).
import { useId, type CSSProperties } from "react";
import styles from "./GooeyMorph.module.css";

interface GooeyMorphProps {
  /** Lado do loader, em px. */
  size?: number;
  color?: string;
  /** Duração do ciclo mais curto, em segundos. */
  speed?: number;
  /** Quanto as gotas se afastam do centro (0 = massa única, 1 = quase se soltam). */
  spread?: number;
  label?: string;
  className?: string;
}

const GooeyMorph = ({ size = 96, color = "#3ce97f", speed = 2.4, spread = 0.9, label = "Carregando", className = "" }: GooeyMorphProps) => {
  const id = `goo${useId().replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span className={`${styles.wrap} ${className}`} role="status" aria-label={label}
      style={{ "--s": `${size}px`, "--c": color, "--t": `${speed}s`, "--d": `${size * 0.2 * spread}px`, filter: `url(#${id})` } as CSSProperties}>
      <svg width="0" height="0" className={styles.defs} aria-hidden="true">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.06} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" />
        </filter>
      </svg>
      <span className={`${styles.blob} ${styles.a}`} />
      <span className={`${styles.blob} ${styles.b}`} />
      <span className={`${styles.blob} ${styles.c}`} />
      <span className={`${styles.blob} ${styles.d}`} />
    </span>
  );
};

export default GooeyMorph;
