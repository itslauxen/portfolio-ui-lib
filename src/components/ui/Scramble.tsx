"use client";

// Texto "decrypt" de terminal: começa embaralhado e os caracteres vão
// travando da esquerda para a direita até formar o texto final. Timing GSAP.
// Sem guard de execução única: o efeito pode remontar (StrictMode) que o
// tween é recriado no lugar do que foi morto no cleanup.
import { useEffect, useState } from "react";
import gsap from "gsap";

const GLYPHS = "!<>-_\\/[]{}=+*^?#@$%&01";

interface Props {
  text: string;
  /** Atraso em segundos antes de começar. */
  delay?: number;
  /** Duração total em segundos. */
  duration?: number;
  className?: string;
}

export function Scramble({ text, delay = 0, duration = 1.1, className }: Props) {
  // SSR renderiza o texto real (SEO/no-JS); o efeito troca pro embaralhado.
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }

    const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    const scrambled = () => {
      let s = "";
      for (let i = 0; i < text.length; i++) s += text[i] === " " ? " " : rand();
      return s;
    };

    // Já fica embaralhado durante o delay (ruído de terminal antes de resolver).
    setOut(scrambled());

    const progress = { v: 0 };
    const tween = gsap.to(progress, {
      v: 1,
      delay,
      duration,
      ease: "power2.out",
      onUpdate() {
        const locked = Math.floor(progress.v * text.length);
        let s = text.slice(0, locked);
        for (let i = locked; i < text.length; i++) s += text[i] === " " ? " " : rand();
        setOut(s);
      },
      onComplete() {
        setOut(text);
      },
    });
    return () => {
      tween.kill();
    };
  }, [text, delay, duration]);

  return (
    <span className={className} aria-label={text}>
      {out}
    </span>
  );
}
