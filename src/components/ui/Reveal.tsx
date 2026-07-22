"use client";

// Wrapper de entrada com Framer Motion (pacote `motion`).
// mode="mount": anima ao montar (acima da dobra, ex.: hero).
// mode="scroll": anima quando entra na viewport (seções abaixo da dobra).
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface Props {
  children: ReactNode;
  /** Atraso em segundos. */
  delay?: number;
  /** Deslocamento vertical inicial em px. */
  y?: number;
  mode?: "mount" | "scroll";
  className?: string;
}

export function Reveal({ children, delay = 0, y = 26, mode = "scroll", className }: Props) {
  const reduced = useReducedMotion();
  const hidden = { opacity: 0, y: reduced ? 0 : y };
  const shown = { opacity: 1, y: 0 };
  const transition = { duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] as const };

  if (mode === "mount") {
    return (
      <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
