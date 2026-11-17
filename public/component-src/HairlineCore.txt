"use client";

// Núcleo: figura em linha no estilo Hairline (feita com a skill hairline-create, no mesmo motor do
// pacote @lucasmarkes/hairline). Um núcleo flutuando numa gaiola de três anéis que giram sozinhos,
// com um olho que acompanha o cursor. `energy` (0 a 1) acelera os anéis, como o som de uma conversa.
import { useEffect, useRef, type CSSProperties } from "react";
import { HL } from "./hairline-kernel.js";
import { nucleo } from "./nucleo.js";

interface HairlineCoreProps {
  /** Energia dos anéis, de 0 (calmo) a 1 (agitado). */
  energy?: number;
  /** Largura da figura, em px. */
  size?: number;
  /** Cor do traço de destaque. */
  color?: string;
  /** Cor do fundo onde a figura está (as "chapas" da figura são preenchidas com ela). */
  plate?: string;
  className?: string;
}

const HairlineCore = ({ energy = 0.2, size = 360, color = "#3ce97f", plate = "#101311", className }: HairlineCoreProps) => {
  const stage = useRef<HTMLDivElement>(null);
  const handle = useRef<{ set(v: number): void; destroy(): void } | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    HL.inject(document);
    const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, el);
    const h = nucleo.mount({ stage: el, svg, read: { textContent: "" } }, nucleo.range[1]);
    handle.current = h;
    return () => {
      handle.current = null;
      h.destroy();
      svg.remove();
    };
  }, []);

  useEffect(() => {
    handle.current?.set(energy);
  }, [energy]);

  return (
    <div
      ref={stage}
      data-hairline="nucleo"
      role="img"
      aria-label="Núcleo flutuando numa gaiola de três anéis"
      className={className}
      style={{ width: size, maxWidth: "100%", "--hairline-hi": color, "--hairline-plate": plate } as CSSProperties}
    />
  );
};

export default HairlineCore;
