"use client";

// Loader "gooey" de linhas cruzadas: o mesmo vai e vem do Carrossel Gooey (cresce na frente,
// encolhe atrás), mas em vários eixos que se cruzam no centro. Os pontos de cada eixo chegam ao
// meio em momentos diferentes e se fundem ali ao passar.
import { useId, type CSSProperties } from "react";
import styles from "./GooeyCross.module.css";

interface GooeyCrossProps {
  /** Diâmetro do ponto no tamanho médio, em px. */
  size?: number;
  /** Quantidade de linhas que se cruzam. */
  lines?: number;
  color?: string;
  /** Duração de uma volta, em segundos. */
  speed?: number;
  /** Meio comprimento de cada linha, em múltiplos do ponto. */
  radius?: number;
  /** Girar o conjunto devagar. */
  spin?: boolean;
  label?: string;
  className?: string;
}

const GooeyCross = ({ size = 20, lines = 2, color = "#3ce97f", speed = 1.8, radius = 2, spin = false, label = "Carregando", className = "" }: GooeyCrossProps) => {
  const id = `goo${useId().replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span className={`${styles.wrap} ${className}`} role="status" aria-label={label}
      style={{ "--s": `${size}px`, "--c": color, "--t": `${speed}s`, "--r": `${size * radius}px`, filter: `url(#${id})` } as CSSProperties}>
      <svg width="0" height="0" className={styles.defs} aria-hidden="true">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.24} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <span className={`${styles.turn} ${spin ? styles.spin : ""}`}>
        {Array.from({ length: lines }, (_, a) => (
          <span key={a} className={styles.line} style={{ transform: `rotate(${(180 / lines) * a}deg)` }}>
            {/* dois pontos por linha, em lados opostos; cada linha um pouco atrasada em relação à anterior */}
            {[0, 1].map((j) => (
              <span key={j} className={styles.dot} style={{ animationDelay: `${-speed * (j / 2 + a / (lines * 2))}s` }} />
            ))}
          </span>
        ))}
      </span>
    </span>
  );
};

export default GooeyCross;
