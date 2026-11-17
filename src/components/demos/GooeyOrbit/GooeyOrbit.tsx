"use client";

// Spinner "gooey": gotas orbitam um núcleo em velocidades diferentes e se fundem com ele e entre si
// quando se cruzam. O efeito de líquido vem de um filtro SVG (desfoque + contraste no alfa).
import { useId, type CSSProperties } from "react";
import styles from "./GooeyOrbit.module.css";

interface GooeyOrbitProps {
  /** Lado do spinner, em px. */
  size?: number;
  /** Quantidade de gotas em órbita. */
  drops?: number;
  color?: string;
  /** Duração de uma volta da gota mais rápida, em segundos. */
  speed?: number;
  label?: string;
  className?: string;
}

const GooeyOrbit = ({ size = 88, drops = 3, color = "#3ce97f", speed = 1.6, label = "Carregando", className = "" }: GooeyOrbitProps) => {
  const id = `goo${useId().replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span className={`${styles.wrap} ${className}`} role="status" aria-label={label}
      style={{ "--s": `${size}px`, "--c": color, filter: `url(#${id})` } as CSSProperties}>
      <svg width="0" height="0" className={styles.defs} aria-hidden="true">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.055} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <span className={styles.core} />
      {Array.from({ length: drops }, (_, i) => (
        <span key={i} className={styles.arm}
          style={{ animationDuration: `${speed * (1 + i * 0.42)}s`, animationDelay: `${-speed * i * 0.3}s`, animationDirection: i % 2 ? "reverse" : "normal" }}>
          <span className={styles.drop} style={{ "--k": 1 - i * 0.12 } as CSSProperties} />
        </span>
      ))}
    </span>
  );
};

export default GooeyOrbit;
