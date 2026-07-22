"use client";

// Moldura dos cards de projeto da home (borda estelar: partículas de luz
// orbitando a borda) e wrapper <Tilt> (cartão inclinado 3D via springs do
// motion), usado nos cards de preview. O conteúdo vem como children.
import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import styles from "./project-card.module.css";

const SPRING = { damping: 30, stiffness: 120, mass: 1.4 };

interface TiltProps {
  children: ReactNode;
  /** Amplitude da inclinação em graus. */
  rotateAmplitude?: number;
  /** Escala no hover. */
  scaleOnHover?: number;
  className?: string;
}

/** Inclinação 3D que segue o cursor (mecânica do cartão inclinado). */
export function Tilt({
  children,
  rotateAmplitude = 8,
  scaleOnHover = 1.03,
  className = "",
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const scale = useSpring(1, SPRING);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  };
  const onEnter = () => scale.set(scaleOnHover);
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div ref={ref} className={`${styles.perspective} ${className}`}>
      <motion.div
        className={styles.tiltBody}
        style={{ rotateX, rotateY, scale }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Moldura com borda estelar (sem tilt) para os cards de projeto. */
export function ProjectCard({ children, className = "" }: CardProps) {
  return (
    <div className={`${styles.cardWrap} ${className}`}>
      <div className={styles.card}>
        <div className={styles.starBottom} aria-hidden="true" />
        <div className={styles.starTop} aria-hidden="true" />
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
