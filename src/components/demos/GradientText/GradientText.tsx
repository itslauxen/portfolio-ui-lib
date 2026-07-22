"use client";

// Texto com gradiente animado (magia de gradiente), com borda opcional.
import { useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "motion/react";
import styles from "./GradientText.module.css";

interface GradientTextProps {
  /** Texto padrao da demo; `children` tem prioridade quando informado. */
  text?: string;
  children?: ReactNode;
  className?: string;
  colors?: string[];
  /** Duracao de um ciclo do gradiente, em segundos. */
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

export default function GradientText({
  text = "Interfaces vivas",
  children,
  className = "",
  colors = ["#c6ff3a", "#ededed", "#c6ff3a"],
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = animationSpeed * 1000;

  useAnimationFrame(time => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
      }
    } else {
      // Posicao sempre crescente para o loop continuo sem salto.
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationSpeed, yoyo]);

  const backgroundPosition = useTransform(progress, p => {
    if (direction === "horizontal") {
      return `${p}% 50%`;
    } else if (direction === "vertical") {
      return `50% ${p}%`;
    } else {
      // No diagonal, move so no eixo horizontal para evitar padroes de interferencia.
      return `${p}% 50%`;
    }
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "to bottom right";
  // Duplica a primeira cor no final para o loop ficar continuo.
  const gradientColors = [...colors, colors[0]].join(", ");

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === "horizontal" ? "300% 100%" : direction === "vertical" ? "100% 300%" : "300% 300%",
    backgroundRepeat: "repeat"
  };

  return (
    <motion.div
      className={`${styles.root} ${showBorder ? styles.withBorder : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && <motion.div className={styles.overlay} style={{ ...gradientStyle, backgroundPosition }} />}
      <motion.div className={styles.text} style={{ ...gradientStyle, backgroundPosition }}>
        {children ?? text}
      </motion.div>
    </motion.div>
  );
}
