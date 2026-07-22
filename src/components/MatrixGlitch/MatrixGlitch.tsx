"use client";

import { useMemo } from "react";
import styles from "./matrix.module.css";

// "Digital rain" da Matrix em 1–2 cantos aleatórios: colunas de símbolos/letras
// caindo devagar, na cor de destaque. Decorativo, não bloqueia cliques.
// Portado de nova-notes.

type Corner = "tl" | "tr" | "bl" | "br";
const CORNERS: Corner[] = ["tl", "tr", "bl", "br"];
const POOL =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾋﾌﾍﾎ0123456789ABCDFHKLMNXZ#$%&*<>=+:";
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = () => POOL[Math.floor(Math.random() * POOL.length)];

const WIDTH = 168;
const SLOT = 15;
const DIAGONALS: Corner[][] = [
  ["tl", "br"],
  ["tr", "bl"],
];

function Column({ x, off }: { x: number; off: number }) {
  const { chars, dur, delay } = useMemo(() => {
    const len = 3 + Math.floor(Math.random() * 38);
    return {
      chars: Array.from({ length: len }, pick),
      dur: rand(6, 11).toFixed(1),
      delay: rand(0, 6).toFixed(1),
    };
  }, []);
  return (
    <div className={styles.col} style={{ left: x, top: off }}>
      <div
        className={styles.stream}
        style={{ animationDuration: `${dur}s`, animationDelay: `-${delay}s` }}
      >
        {chars.concat(chars).map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function CornerRain({ pos }: { pos: Corner }) {
  const cols = useMemo(() => {
    const n = Math.floor(WIDTH / SLOT) + 1;
    return Array.from({ length: n }, (_, i) => ({
      x: Math.round(i * SLOT + rand(-8, 8)),
      off: Math.round(rand(-35, 60)),
    }));
  }, []);
  return (
    <div className={`${styles.rain} ${styles[pos]}`} aria-hidden="true">
      {cols.map((c, i) => (
        <Column key={i} x={c.x} off={c.off} />
      ))}
    </div>
  );
}

export default function MatrixGlitch() {
  const corners = useMemo<Corner[]>(() => {
    if (Math.random() < 0.5) return [CORNERS[Math.floor(Math.random() * 4)]];
    return DIAGONALS[Math.floor(Math.random() * 2)];
  }, []);
  return (
    <>
      {corners.map((c) => (
        <CornerRain key={c} pos={c} />
      ))}
    </>
  );
}
