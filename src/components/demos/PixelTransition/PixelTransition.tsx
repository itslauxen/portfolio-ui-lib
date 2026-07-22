"use client";

// Cartao que alterna entre dois conteudos com uma varredura de pixels
// aleatorios (hover no desktop, toque no mobile). Usa GSAP para o stagger.

import React, { useRef, useEffect, useState, CSSProperties } from "react";
import { gsap } from "gsap";
import styles from "./PixelTransition.module.css";

interface PixelTransitionProps {
  firstContent?: React.ReactNode | string;
  secondContent?: React.ReactNode | string;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 8,
  pixelColor = "#c6ff3a",
  animationStepDuration = 0.4,
  once = false,
  aspectRatio = "100%",
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);

  // Detecta touch apenas no cliente (evita erro de SSR)
  const [isTouchDevice] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches)
  );

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = "";

    // Monta a grade de pixels que cobre o cartao
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add(styles.pixel);
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean): void => {
    setIsActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(`.${styles.pixel}`);
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: "none" });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    // Fase 1: pixels aparecem em ordem aleatoria cobrindo o conteudo
    gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });

    // Troca o conteudo no meio da varredura
    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? "block" : "none";
      activeEl.style.pointerEvents = activate ? "none" : "";
    });

    // Fase 2: pixels somem revelando o novo conteudo
    gsap.to(pixels, {
      display: "none",
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });
  };

  const handleEnter = (): void => {
    if (!isActive) animatePixels(true);
  };
  const handleLeave = (): void => {
    if (isActive && !once) animatePixels(false);
  };
  const handleClick = (): void => {
    if (!isActive) animatePixels(true);
    else if (isActive && !once) animatePixels(false);
  };

  const primeiroPadrao = (
    <div className={styles.demoFaceFirst}>
      <span className={styles.demoTitle}>Passe o mouse</span>
      <span className={styles.demoText}>Transicao em pixels</span>
    </div>
  );

  const segundoPadrao = (
    <div className={styles.demoFaceSecond}>
      <span className={styles.demoTitleDark}>Surpresa!</span>
      <span className={styles.demoTextDark}>Conteudo revelado pixel a pixel</span>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.card} ${className}`}
      style={style}
      onMouseEnter={!isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
      onFocus={!isTouchDevice ? handleEnter : undefined}
      onBlur={!isTouchDevice ? handleLeave : undefined}
      tabIndex={0}
    >
      <div style={{ paddingTop: aspectRatio }} />
      <div className={styles.layerDefault} aria-hidden={isActive}>
        {firstContent ?? primeiroPadrao}
      </div>
      <div className={styles.layerActive} ref={activeRef} aria-hidden={!isActive}>
        {secondContent ?? segundoPadrao}
      </div>
      <div className={styles.pixelGrid} ref={pixelGridRef} />
    </div>
  );
};

export default PixelTransition;
