"use client";

// Loader de barras: barras que esticam e encolhem em sequência, como um equalizador.
// Adaptado do "Bars" do aicssanimations.com. Só CSS: nenhuma animação em JavaScript.
import type { CSSProperties } from "react";
import styles from "./BarsLoader.module.css";

interface BarsLoaderProps {
  /** Altura do loader, em px. */
  size?: number;
  /** Quantidade de barras. */
  bars?: number;
  color?: string;
  /** Duração de um ciclo, em segundos. */
  speed?: number;
  /** Texto para leitores de tela. */
  label?: string;
  className?: string;
}

const BarsLoader = ({ size = 56, bars = 5, color = "#3ce97f", speed = 1.2, label = "Carregando", className = "" }: BarsLoaderProps) => (
  <span
    className={`${styles.bars} ${className}`}
    role="status"
    aria-label={label}
    style={{ "--s": `${size}px`, "--c": color, "--t": `${speed}s` } as CSSProperties}
  >
    {Array.from({ length: bars }, (_, i) => (
      <span key={i} style={{ animationDelay: `${-speed + (i * speed) / 12}s` }} />
    ))}
  </span>
);

export default BarsLoader;
