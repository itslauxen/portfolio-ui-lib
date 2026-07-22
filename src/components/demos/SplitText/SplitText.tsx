"use client";

// Texto dividido em letras/palavras/linhas com entrada animada via GSAP.
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import styles from "./SplitText.module.css";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text?: string;
  className?: string;
  /** Atraso entre cada elemento, em ms. */
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text = "Gabriel Lauxen",
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  // Mantem a callback mais recente sem reiniciar a animacao.
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!ref.current || !text || !fontsLoaded) return;
    // Evita reanimar depois de concluido.
    if (animationCompletedRef.current) return;

    const el = ref.current as HTMLElement & {
      _splitInstance?: GSAPSplitText;
    };

    if (el._splitInstance) {
      try {
        el._splitInstance.revert();
      } catch (_) {}
      el._splitInstance = undefined;
    }

    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
    const sign =
      marginValue === 0
        ? ""
        : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;
    let targets: Element[] = [];
    const assignTargets = (self: GSAPSplitText) => {
      if (splitType.includes("chars") && self.chars.length) targets = self.chars;
      if (!targets.length && splitType.includes("words") && self.words.length) targets = self.words;
      if (!targets.length && splitType.includes("lines") && self.lines.length) targets = self.lines;
      if (!targets.length) targets = self.chars || self.words || self.lines;
    };
    const splitInstance = new GSAPSplitText(el, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      reduceWhiteSpace: false,
      onSplit: (self: GSAPSplitText) => {
        assignTargets(self);
        return gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4
            },
            onComplete: () => {
              animationCompletedRef.current = true;
              onCompleteRef.current?.();
            },
            willChange: "transform, opacity",
            force3D: true
          }
        );
      }
    });
    el._splitInstance = splitInstance;
    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
      try {
        splitInstance.revert();
      } catch (_) {}
      el._splitInstance = undefined;
    };
    // JSON.stringify captura mudancas nos objetos from/to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(from),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(to),
    threshold,
    rootMargin,
    fontsLoaded
  ]);

  const renderTag = () => {
    const style: React.CSSProperties = {
      textAlign,
      overflow: "hidden",
      display: "inline-block",
      whiteSpace: "normal",
      wordWrap: "break-word",
      willChange: "transform, opacity"
    };
    const classes = `${styles.splitParent} ${className}`;
    const Tag = (tag || "p") as React.ElementType;

    return (
      <Tag ref={ref} style={style} className={classes}>
        {text}
      </Tag>
    );
  };
  return renderTag();
};

export default SplitText;
