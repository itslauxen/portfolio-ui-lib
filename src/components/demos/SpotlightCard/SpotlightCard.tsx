"use client";

// Cartão com holofote que segue o cursor via variáveis CSS.
import React, { useRef } from "react";
import styles from "./SpotlightCard.module.css";

export interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  /** Cor do holofote (qualquer cor CSS válida). */
  spotlightColor?: string;
  /** Cor de fundo do cartão. */
  backgroundColor?: string;
  /** Cor da borda do cartão. */
  borderColor?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(198, 255, 58, 0.25)",
  backgroundColor = "#0c0c0e",
  borderColor = "rgba(255, 255, 255, 0.12)",
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`${styles.cardSpotlight} ${className}`}
      style={{ backgroundColor, borderColor }}
    >
      {children ?? (
        <div className={styles.demoContent}>
          <span className={styles.demoLabel}>Interativo</span>
          <h3 className={styles.demoTitle}>Holofote</h3>
          <p className={styles.demoText}>
            Passe o mouse sobre o cartão para revelar o brilho que acompanha o
            cursor.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpotlightCard;
