"use client";

// Loader "faísca": raios arredondados saem de um núcleo e esticam e encolhem em onda, um depois do
// outro, o que dá a impressão de a forma inteira estar girando e respirando, como um indicador de
// "pensando". Com o filtro gooey os raios se fundem ao núcleo numa peça só.
import { useId, type CSSProperties } from "react";
import styles from "./GooeySpark.module.css";

interface GooeySparkProps {
  /** Lado do loader, em px. */
  size?: number;
  /** Quantidade de raios. */
  rays?: number;
  color?: string;
  /** Duração de uma volta da onda, em segundos. */
  speed?: number;
  /** Girar a faísca inteira devagar, além da onda. */
  spin?: boolean;
  label?: string;
  className?: string;
}

const GooeySpark = ({ size = 96, rays = 8, color = "#3ce97f", speed = 1.8, spin = true, label = "Pensando", className = "" }: GooeySparkProps) => {
  const id = `goo${useId().replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span className={`${styles.wrap} ${className}`} role="status" aria-label={label}
      style={{ "--s": `${size}px`, "--c": color, "--t": `${speed}s`, "--n": rays, filter: `url(#${id})` } as CSSProperties}>
      <svg width="0" height="0" className={styles.defs} aria-hidden="true">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.02} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <span className={`${styles.turn} ${spin ? styles.spin : ""}`}>
        <span className={styles.core} />
        {Array.from({ length: rays }, (_, i) => (
          <span key={i} className={styles.arm} style={{ transform: `rotate(${(360 / rays) * i}deg)` }}>
            {/* comprimentos de repouso alternados (longo, curto) para não parecer uma engrenagem */}
            <span className={styles.ray} style={{ animationDelay: `${-speed + (speed / rays) * i}s`, "--k": i % 2 ? 0.78 : 1 } as CSSProperties} />
          </span>
        ))}
      </span>
    </span>
  );
};

export default GooeySpark;
