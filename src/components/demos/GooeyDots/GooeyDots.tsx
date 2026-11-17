"use client";

// Loader "gooey" de pontos: uma gota corre de um lado ao outro e se funde com os pontos parados
// por onde passa. O efeito de líquido vem de um filtro SVG (desfoque + contraste no alfa).
import { useId, type CSSProperties } from "react";
import styles from "./GooeyDots.module.css";

interface GooeyDotsProps {
  /** Diâmetro de cada ponto, em px. */
  size?: number;
  /** Quantidade de pontos parados. */
  dots?: number;
  color?: string;
  /** Duração de uma ida, em segundos. */
  speed?: number;
  label?: string;
  className?: string;
}

const GooeyDots = ({ size = 22, dots = 4, color = "#3ce97f", speed = 1.4, label = "Carregando", className = "" }: GooeyDotsProps) => {
  const id = `goo${useId().replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span className={`${styles.wrap} ${className}`} role="status" aria-label={label}
      style={{ "--s": `${size}px`, "--c": color, "--t": `${speed}s`, filter: `url(#${id})` } as CSSProperties}>
      <svg width="0" height="0" className={styles.defs} aria-hidden="true">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.28} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>
      <span className={styles.row}>
        {Array.from({ length: dots }, (_, i) => (
          <span key={i} className={styles.dot} style={{ animationDelay: `${(-speed * i) / dots}s` }} />
        ))}
        <span className={styles.runner} />
      </span>
    </span>
  );
};

export default GooeyDots;
