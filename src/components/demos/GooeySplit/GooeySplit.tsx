"use client";

// Loader "gooey" de divisão: uma gota se estica, parte em duas, as duas se afastam e voltam a se
// fundir, enquanto o conjunto gira devagar. Filtro SVG (desfoque + contraste no alfa) faz o líquido.
import { useId, type CSSProperties } from "react";
import styles from "./GooeySplit.module.css";

interface GooeySplitProps {
  /** Lado do loader, em px. */
  size?: number;
  color?: string;
  /** Duração de um ciclo (dividir e fundir), em segundos. */
  speed?: number;
  /** Girar o conjunto enquanto divide. */
  rotate?: boolean;
  label?: string;
  className?: string;
}

const GooeySplit = ({ size = 88, color = "#3ce97f", speed = 1.5, rotate = true, label = "Carregando", className = "" }: GooeySplitProps) => {
  const id = `goo${useId().replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span className={`${styles.wrap} ${className}`} role="status" aria-label={label}
      style={{ "--s": `${size}px`, "--c": color, "--t": `${speed}s`, filter: `url(#${id})` } as CSSProperties}>
      <svg width="0" height="0" className={styles.defs} aria-hidden="true">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.07} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <span className={`${styles.spin} ${rotate ? styles.spinOn : ""}`}>
        <span className={`${styles.blob} ${styles.a}`} />
        <span className={`${styles.blob} ${styles.b}`} />
      </span>
    </span>
  );
};

export default GooeySplit;
