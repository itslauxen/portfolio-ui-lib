"use client";

// Loader "gooey" de carrossel: pontos que parecem girar uns em volta dos outros. Cada um vai e
// volta de lado enquanto cresce (quando passa "pela frente") e encolhe (quando passa "por trás"),
// e eles se fundem ao se cruzar. É só deslocamento + escala: a profundidade é ilusão.
import { useId, type CSSProperties } from "react";
import styles from "./GooeyCarousel.module.css";

interface GooeyCarouselProps {
  /** Diâmetro do ponto no tamanho médio, em px. */
  size?: number;
  /** Quantidade de pontos. */
  dots?: number;
  color?: string;
  /** Duração de uma volta, em segundos. */
  speed?: number;
  /** Raio da órbita, em múltiplos do ponto. */
  radius?: number;
  label?: string;
  className?: string;
}

const GooeyCarousel = ({ size = 22, dots = 3, color = "#3ce97f", speed = 1.6, radius = 1.5, label = "Carregando", className = "" }: GooeyCarouselProps) => {
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
      {Array.from({ length: dots }, (_, i) => (
        // cada ponto está numa fase diferente da mesma volta
        <span key={i} className={styles.dot} style={{ animationDelay: `${(-speed * i) / dots}s` }} />
      ))}
    </span>
  );
};

export default GooeyCarousel;
