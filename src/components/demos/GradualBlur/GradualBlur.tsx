"use client";

// Desfoque progressivo: varias faixas de backdrop-filter mascaradas por
// gradiente criam um blur que aumenta gradualmente em uma das bordas.
// A demo embute um conteudo colorido padrao para o efeito ficar visivel.

import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import styles from "./GradualBlur.module.css";

type Posicao = "top" | "bottom" | "left" | "right";
type Curva = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

export interface GradualBlurProps {
  children?: ReactNode;
  /** Borda onde o desfoque se acumula. */
  position?: Posicao;
  /** Intensidade geral do desfoque. */
  strength?: number;
  /** Extensao da faixa desfocada (CSS, ex.: "8rem"). */
  height?: string;
  /** Quantidade de faixas (mais faixas = transicao mais suave). */
  divCount?: number;
  /** Crescimento exponencial do desfoque entre as faixas. */
  exponential?: boolean;
  /** Curva de distribuicao do desfoque. */
  curve?: Curva;
  opacity?: number;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
}

const CURVAS: Record<Curva, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const DIRECOES: Record<Posicao, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

// Conteudo padrao da demo: 4 cards, palavras gigantes vazadas com blobs
// coloridos (cena igual a da superficie de vidro) e um bloco de gradiente
// granulado no final. Tudo com scroll interno, rolando por baixo do desfoque.
function ConteudoPadrao() {
  const blocos = [
    ["Interfaces", "#c6ff3a"],
    ["Movimento", "#5ff2d8"],
    ["Cores", "#ff5ea8"],
    ["Tipografia", "#7c5cff"],
  ] as const;

  const palavras = ["desfoque", "gradual", "foco", "camadas"];

  return (
    <div className={styles.demoGrid}>
      <span className={styles.demoBlobA} aria-hidden="true" />
      <span className={styles.demoBlobB} aria-hidden="true" />
      <span className={styles.demoBlobC} aria-hidden="true" />

      <p className={styles.demoLegenda}>
        Role este conteúdo: ele passa por baixo da faixa de desfoque fixada na borda, sumindo
        num degrade de foco.
      </p>
      {blocos.map(([rotulo, cor]) => (
        <div key={rotulo} className={styles.demoBloco} style={{ borderColor: cor }}>
          <span className={styles.demoPonto} style={{ background: cor }} />
          <span className={styles.demoRotulo}>{rotulo}</span>
        </div>
      ))}

      {/* Imagem colorida: gradiente granulado com as cores primárias do app,
          para ver o filtro de desfoque agindo sobre cores vivas. */}
      <div className={styles.demoGradiente} aria-hidden="true" />

      {palavras.map((p) => (
        <span key={p} className={styles.demoWord} aria-hidden="true">
          {p}
        </span>
      ))}

      <p className={styles.demoLegenda}>
        Fim da lista. O desfoque continua fixo na borda enquanto tudo rola sob ele.
      </p>
    </div>
  );
}

export default function GradualBlur({
  children,
  position = "bottom",
  strength = 2,
  height = "8rem",
  divCount = 6,
  exponential = false,
  curve = "linear",
  opacity = 1,
  zIndex = 10,
  className = "",
  style,
}: GradualBlurProps) {
  // Constroi as faixas de desfoque, cada uma com sua mascara em gradiente.
  const faixas = useMemo(() => {
    const divs: ReactNode[] = [];
    const incremento = 100 / divCount;
    const curva = CURVAS[curve] ?? CURVAS.linear;
    const direcao = DIRECOES[position] ?? "to bottom";

    for (let i = 1; i <= divCount; i++) {
      const progresso = curva(i / divCount);

      const blurValue = exponential
        ? Math.pow(2, progresso * 4) * 0.0625 * strength
        : 0.0625 * (progresso * divCount + 1) * strength;

      const p1 = Math.round((incremento * i - incremento) * 10) / 10;
      const p2 = Math.round(incremento * i * 10) / 10;
      const p3 = Math.round((incremento * i + incremento) * 10) / 10;
      const p4 = Math.round((incremento * i + incremento * 2) * 10) / 10;

      let gradiente = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradiente += `, black ${p3}%`;
      if (p4 <= 100) gradiente += `, transparent ${p4}%`;

      const estilo: CSSProperties = {
        position: "absolute",
        inset: 0,
        maskImage: `linear-gradient(${direcao}, ${gradiente})`,
        WebkitMaskImage: `linear-gradient(${direcao}, ${gradiente})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity,
      };

      divs.push(<div key={i} style={estilo} />);
    }

    return divs;
  }, [divCount, curve, position, exponential, strength, opacity]);

  // Posiciona a camada de desfoque na borda escolhida.
  const estiloCamada = useMemo<CSSProperties>(() => {
    const vertical = position === "top" || position === "bottom";
    const base: CSSProperties = { position: "absolute", pointerEvents: "none", zIndex };
    if (vertical) {
      base.height = height;
      base.left = 0;
      base.right = 0;
      base[position as "top" | "bottom"] = 0;
    } else {
      base.width = height;
      base.top = 0;
      base.bottom = 0;
      base[position as "left" | "right"] = 0;
    }
    return base;
  }, [position, height, zIndex]);

  return (
    <div className={`${styles.container} ${className}`} style={style}>
      <div className={styles.conteudo}>{children ?? <ConteudoPadrao />}</div>
      <div className={styles.camada} style={estiloCamada}>
        <div className={styles.camadaInterna}>{faixas}</div>
      </div>
    </div>
  );
}
