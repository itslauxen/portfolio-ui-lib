"use client";

// Spinner de arco: um traço de ponta redonda que gira enquanto estica e encolhe, sobre um trilho
// apagado. SVG com animação só em CSS.
import type { CSSProperties } from "react";
import styles from "./ArcSpinner.module.css";

interface ArcSpinnerProps {
  /** Lado do spinner, em px. */
  size?: number;
  /** Espessura do traço, em px. */
  stroke?: number;
  color?: string;
  /** Duração de uma volta, em segundos. */
  speed?: number;
  /** Mostrar o trilho apagado por baixo. */
  track?: boolean;
  label?: string;
  className?: string;
}

const ArcSpinner = ({ size = 64, stroke = 5, color = "#3ce97f", speed = 1.1, track = true, label = "Carregando", className = "" }: ArcSpinnerProps) => {
  const r = 50 - (stroke / size) * 50;
  return (
    <svg className={`${styles.svg} ${className}`} role="status" aria-label={label} width={size} height={size} viewBox="0 0 100 100"
      style={{ "--c": color, "--t": `${speed}s`, "--w": (stroke / size) * 100 } as CSSProperties}>
      {track && <circle className={styles.track} cx="50" cy="50" r={r} />}
      <circle className={styles.arc} cx="50" cy="50" r={r} pathLength={100} />
    </svg>
  );
};

export default ArcSpinner;
