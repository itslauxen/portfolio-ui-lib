"use client";

// Cursor de mira que gira em repouso e trava as quatro quinas em qualquer
// elemento com a classe alvo. Diferente da ideia original de cursor global,
// aqui todo o efeito (listeners, coordenadas e ocultacao do cursor nativo)
// fica confinado ao container do componente.

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import styles from "./TargetCursor.module.css";

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
  /** true = cursor de página inteira: listeners no document, posição fixed
   *  (cobre também o header/nav fora do wrapper). */
  fullPage?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = "#ffffff",
  cursorColorOnTarget = "#c6ff3a",
  fullPage = false,
  children,
  className = "",
  style,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);

  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  // Em telas de toque o cursor customizado nao faz sentido
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    const hasTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
    }),
    []
  );

  // Move o cursor customizado (coordenadas relativas ao container)
  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const cursor = cursorRef.current;
    // Copia estavel do objeto de forca para o cleanup (evita ler o ref depois)
    const activeStrength = activeStrengthRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(`.${styles.corner}`);

    // Modo página inteira: eventos no document, limite de busca = <html>,
    // cursor nativo escondido no site todo via classe no <body>.
    const listenRoot: HTMLElement = fullPage ? document.documentElement : wrapper;
    const boundary: HTMLElement = fullPage ? document.documentElement : wrapper;
    if (fullPage && hideDefaultCursor) {
      document.body.classList.add("tc-fullpage");
    }

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    // Comeca no centro do container/viewport, invisivel ate o ponteiro entrar
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: fullPage ? window.innerWidth / 2 : wrapper.clientWidth / 2,
      y: fullPage ? window.innerHeight / 2 : wrapper.clientHeight / 2,
      opacity: 0,
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" });
    };

    createSpinTimeline();

    // Ticker do parallax: aproxima as quinas das posicoes alvo
    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return;
      }

      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;

      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, "x") as number;
        const currentY = gsap.getProperty(corner, "y") as number;

        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => {
      if (fullPage) {
        // Cursor fixed: coordenadas de viewport direto.
        moveCursor(e.clientX, e.clientY);
        return;
      }
      const rect = wrapper.getBoundingClientRect();
      moveCursor(e.clientX - rect.left, e.clientY - rect.top);
    };

    const enterWrapperHandler = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    const leaveWrapperHandler = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
      currentLeaveHandler?.();
    };

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    // Delegacao: detecta quando o ponteiro entra em um alvo dentro do limite
    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as Element;
      const allTargets: Element[] = [];
      let current: Element | null = directTarget;
      while (current && current !== boundary) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner) => gsap.killTweensOf(corner, "x,y"));

      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      if (cursorColorOnTarget) {
        gsap.to(corners, {
          borderColor: cursorColorOnTarget,
          duration: 0.15,
          ease: "power2.out",
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColorOnTarget,
            duration: 0.15,
            ease: "power2.out",
          });
        }
      }

      // Posicoes das quinas relativas ao container (ou ao viewport no fullPage)
      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      let relLeft = rect.left;
      let relTop = rect.top;
      let relRight = rect.right;
      let relBottom = rect.bottom;
      if (!fullPage) {
        const wRect = wrapper.getBoundingClientRect();
        relLeft -= wRect.left;
        relTop -= wRect.top;
        relRight -= wRect.left;
        relBottom -= wRect.top;
      }

      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;

      targetCornerPositionsRef.current = [
        { x: relLeft - borderWidth, y: relTop - borderWidth },
        { x: relRight + borderWidth - cornerSize, y: relTop - borderWidth },
        { x: relRight + borderWidth - cornerSize, y: relBottom + borderWidth - cornerSize },
        { x: relLeft - borderWidth, y: relBottom + borderWidth - cornerSize },
      ];

      gsap.ticker.add(tickerFnRef.current!);

      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: "power2.out",
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);

        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;

        if (cursorColorOnTarget && cornersRef.current) {
          gsap.to(Array.from(cornersRef.current), {
            borderColor: cursorColor,
            duration: 0.15,
            ease: "power2.out",
          });
          if (dotRef.current) {
            gsap.to(dotRef.current, {
              backgroundColor: cursorColor,
              duration: 0.15,
              ease: "power2.out",
            });
          }
        }

        // Quinas voltam para a formacao padrao ao redor do ponto central
        if (cornersRef.current) {
          const allCorners = Array.from(cornersRef.current);
          gsap.killTweensOf(allCorners, "x,y");
          const { cornerSize: cs } = constants;
          const positions = [
            { x: -cs * 1.5, y: -cs * 1.5 },
            { x: cs * 0.5, y: -cs * 1.5 },
            { x: cs * 0.5, y: cs * 0.5 },
            { x: -cs * 1.5, y: cs * 0.5 },
          ];
          const tl = gsap.timeline();
          allCorners.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: "power3.out",
              },
              0
            );
          });
        }

        // Retoma o giro continuando da rotacao atual
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, "rotation") as number;
            const normalizedRotation = currentRotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: "+=360", duration: spinDuration, ease: "none" });
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => {
                spinTl.current?.restart();
              },
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener("mouseleave", leaveHandler);
    };

    listenRoot.addEventListener("mousemove", moveHandler);
    listenRoot.addEventListener("mouseover", enterHandler as EventListener, { passive: true });
    listenRoot.addEventListener("mouseenter", enterWrapperHandler);
    listenRoot.addEventListener("mouseleave", leaveWrapperHandler);
    listenRoot.addEventListener("mousedown", mouseDownHandler);
    listenRoot.addEventListener("mouseup", mouseUpHandler);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }

      listenRoot.removeEventListener("mousemove", moveHandler);
      listenRoot.removeEventListener("mouseover", enterHandler as EventListener);
      listenRoot.removeEventListener("mouseenter", enterWrapperHandler);
      listenRoot.removeEventListener("mouseleave", leaveWrapperHandler);
      listenRoot.removeEventListener("mousedown", mouseDownHandler);
      listenRoot.removeEventListener("mouseup", mouseUpHandler);
      document.body.classList.remove("tc-fullpage");

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }

      spinTl.current?.kill();

      targetCornerPositionsRef.current = null;
      activeStrength.current = 0;
    };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    isMobile,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget,
    fullPage,
    hideDefaultCursor,
  ]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: "+=360", duration: spinDuration, ease: "none" });
    }
  }, [spinDuration, isMobile]);

  const conteudoPadrao = (
    <div className={styles.demo}>
      <span className={styles.demoTitle}>Mire nos alvos</span>
      <div className={styles.demoRow}>
        <button type="button" className={`cursor-target ${styles.demoBtn}`}>
          Projetos
        </button>
        <button type="button" className={`cursor-target ${styles.demoBtn}`}>
          Biblioteca
        </button>
        <button type="button" className={`cursor-target ${styles.demoBtn}`}>
          Contato
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={`${styles.container} ${className}`}
      style={{ cursor: hideDefaultCursor && !isMobile ? "none" : undefined, ...style }}
    >
      {children ?? conteudoPadrao}
      {!isMobile && (
        <div
          ref={cursorRef}
          className={styles.cursor}
          // fullPage: cursor fixado ao viewport (coordenadas de clientX/Y).
          style={fullPage ? { position: "fixed" } : undefined}
        >
          <div ref={dotRef} className={styles.dot} style={{ backgroundColor: cursorColor }} />
          <div className={`${styles.corner} ${styles.tl}`} style={{ borderColor: cursorColor }} />
          <div className={`${styles.corner} ${styles.tr}`} style={{ borderColor: cursorColor }} />
          <div className={`${styles.corner} ${styles.br}`} style={{ borderColor: cursorColor }} />
          <div className={`${styles.corner} ${styles.bl}`} style={{ borderColor: cursorColor }} />
        </div>
      )}
    </div>
  );
};

export default TargetCursor;
