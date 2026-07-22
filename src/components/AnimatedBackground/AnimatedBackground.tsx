"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { EFFECTS } from "@/lib/backgrounds/engine";
import type { BgValues } from "@/lib/backgrounds/types";

// Forma mínima de um efeito do motor (a lógica real vive em engine.js).
interface EngineEffect {
  id: string;
  params: { key: string; default: number | string | boolean }[];
  fn: (canvas: HTMLCanvasElement, getP: () => BgValues) => { stop: () => void };
}

const effects = EFFECTS as unknown as EngineEffect[];

/** Props aceitas por todos os componentes de background (sem o id). */
export interface BackgroundOwnProps {
  /** Sobrescreve parâmetros específicos; o resto usa o padrão do efeito. */
  params?: BgValues;
  /** Interação por mouse/toque. Use false para deixar atrás do conteúdo. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface BackgroundProps extends BackgroundOwnProps {
  effectId: string;
}

/**
 * Runner genérico dos efeitos de canvas (motor).
 *
 * IMPORTANTE: cria um <canvas> NOVO a cada execução do efeito e o remove na
 * limpeza. Alguns efeitos WebGL chamam `WEBGL_lose_context.loseContext()` ao
 * parar, e um canvas nunca devolve um contexto novo depois disso. Reaproveitar
 * o mesmo canvas (troca de efeito ou double-invoke do StrictMode) entregaria um
 * contexto morto e o shader falharia ("shader null"). Um canvas novo por
 * execução garante sempre um contexto limpo, mesmo padrão dos shaders OGL.
 *
 * Parâmetros são lidos a cada frame (via ref), então mudanças em `params`
 * refletem AO VIVO sem reiniciar a animação.
 */
export function AnimatedBackground({
  effectId,
  params,
  interactive = true,
  className,
  style,
}: BackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef<BgValues | undefined>(params);
  paramsRef.current = params;

  useEffect(() => {
    const container = containerRef.current;
    const eff = effects.find((e) => e.id === effectId);
    if (!container || !eff) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const defaults: BgValues = {};
    for (const p of eff.params) defaults[p.key] = p.default;
    const getP = (): BgValues => ({ ...defaults, ...(paramsRef.current || {}) });

    let ctrl: { stop: () => void } | undefined;
    try {
      ctrl = eff.fn(canvas, getP);
    } catch (err) {
      console.warn("AnimatedBackground:", effectId, err);
    }
    return () => {
      try {
        ctrl?.stop();
      } catch {
        /* ignore */
      }
      try {
        container.removeChild(canvas);
      } catch {
        /* ignore */
      }
    };
  }, [effectId]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
        ...style,
      }}
    />
  );
}
