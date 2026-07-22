"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, ComponentType } from "react";
import { defaultsOf, getReactEffect } from "@/lib/backgrounds";
import type { ReactComponentName } from "@/lib/backgrounds";
import type { BgValues } from "@/lib/backgrounds/types";

// Resolve o nome declarado no catálogo para o componente real.
// Imports dinâmicos: cada shader vira um chunk próprio e só baixa quando
// selecionado (o palco renderiza um por vez).
const REGISTRY: Record<ReactComponentName, ComponentType<any>> = {
  Aurora: dynamic(() => import("./shaders/Aurora/Aurora"), { ssr: false }),
  Grainient: dynamic(() => import("./shaders/Grainient/Grainient"), { ssr: false }),
  LightRays: dynamic(() => import("./shaders/LightRays/LightRays"), { ssr: false }),
  GradientBlinds: dynamic(() => import("./shaders/GradientBlinds/GradientBlinds"), { ssr: false }),
  PlasmaWave: dynamic(() => import("./shaders/PlasmaWave/PlasmaWave"), { ssr: false }),
  Ferrofluid: dynamic(() => import("./shaders/Ferrofluid/Ferrofluid"), { ssr: false }),
  Lightfall: dynamic(() => import("./shaders/Lightfall/Lightfall"), { ssr: false }),
  LiquidEther: dynamic(() => import("./shaders/LiquidEther/LiquidEther"), { ssr: false }),
  DotGrid: dynamic(() => import("./shaders/DotGrid/DotGrid"), { ssr: false }),
  FaultyTerminal: dynamic(() => import("./shaders/FaultyTerminal/FaultyTerminal"), { ssr: false }),
  PixelBlast: dynamic(() => import("./shaders/PixelBlast/PixelBlast"), { ssr: false }),
  ColorBends: dynamic(() => import("./shaders/ColorBends/ColorBends"), { ssr: false }),
  Beams: dynamic(() => import("./shaders/Beams/Beams"), { ssr: false }),
  Dither: dynamic(() => import("./shaders/Dither/Dither"), { ssr: false }),
  DotField: dynamic(() => import("./shaders/DotField/DotField"), { ssr: false }),
};

interface Props {
  effectId: string;
  params?: BgValues;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renderiza um fundo baseado em componente React/WebGL (shader) a partir do
 * catálogo unificado, convertendo os valores dos parâmetros em props. Espelha
 * a API do <AnimatedBackground> (canvas) para que a camada de UI trate os dois
 * tipos de fundo de forma intercambiável.
 */
export function ReactBackground({ effectId, params, interactive = true, className, style }: Props) {
  const eff = getReactEffect(effectId);
  if (!eff) return null;
  const Cmp = REGISTRY[eff.component];
  const props = eff.propsFrom({ ...defaultsOf(eff), ...(params ?? {}) });

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
        ...style,
      }}
    >
      <Cmp {...props} />
    </div>
  );
}
