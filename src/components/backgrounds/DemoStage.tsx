"use client";

// Palco das demos de componente (seções Componentes / Animações / Texto):
// resolve o componente no REGISTRY e o renderiza centrado sobre o palco,
// com as props vindas dos sliders. Espelha a API do <ReactBackground>.
import dynamic from "next/dynamic";
import type { CSSProperties, ComponentType } from "react";
import { defaultsOf, getDemoEffect } from "@/lib/backgrounds";
import type { BgValues } from "@/lib/backgrounds/types";

// Imports dinâmicos: cada demo vira um chunk próprio e só baixa quando
// selecionada (o palco renderiza uma por vez).
const REGISTRY: Record<string, ComponentType<any>> = {
  Antigravity: dynamic(() => import("@/components/demos/Antigravity/Antigravity"), { ssr: false }),
  ASCIIText: dynamic(() => import("@/components/demos/ASCIIText/ASCIIText"), { ssr: false }),
  BlurText: dynamic(() => import("@/components/demos/BlurText/BlurText"), { ssr: false }),
  BorderGlow: dynamic(() => import("@/components/demos/BorderGlow/BorderGlow"), { ssr: false }),
  ClickSpark: dynamic(() => import("@/components/demos/ClickSpark/ClickSpark"), { ssr: false }),
  CurvedLoop: dynamic(() => import("@/components/demos/CurvedLoop/CurvedLoop"), { ssr: false }),
  DecryptedText: dynamic(() => import("@/components/demos/DecryptedText/DecryptedText"), { ssr: false }),
  Dock: dynamic(() => import("@/components/demos/Dock/Dock"), { ssr: false }),
  FluidGlass: dynamic(() => import("@/components/demos/FluidGlass/FluidGlass"), { ssr: false }),
  GhostCursor: dynamic(() => import("@/components/demos/GhostCursor/GhostCursor"), { ssr: false }),
  GlareHover: dynamic(() => import("@/components/demos/GlareHover/GlareHover"), { ssr: false }),
  GlassSurface: dynamic(() => import("@/components/demos/GlassSurface/GlassSurface"), { ssr: false }),
  GooeyNav: dynamic(() => import("@/components/demos/GooeyNav/GooeyNav"), { ssr: false }),
  GradientText: dynamic(() => import("@/components/demos/GradientText/GradientText"), { ssr: false }),
  GradualBlur: dynamic(() => import("@/components/demos/GradualBlur/GradualBlur"), { ssr: false }),
  LogoLoop: dynamic(() => import("@/components/demos/LogoLoop/LogoLoop"), { ssr: false }),
  MagicBento: dynamic(() => import("@/components/demos/MagicBento/MagicBento"), { ssr: false }),
  Magnet: dynamic(() => import("@/components/demos/Magnet/Magnet"), { ssr: false }),
  MagnetLines: dynamic(() => import("@/components/demos/MagnetLines/MagnetLines"), { ssr: false }),
  Masonry: dynamic(() => import("@/components/demos/Masonry/Masonry"), { ssr: false }),
  MetaBalls: dynamic(() => import("@/components/demos/MetaBalls/MetaBalls"), { ssr: false }),
  MetallicPaint: dynamic(() => import("@/components/demos/MetallicPaint/MetallicPaint"), { ssr: false }),
  Noise: dynamic(() => import("@/components/demos/Noise/Noise"), { ssr: false }),
  PixelCard: dynamic(() => import("@/components/demos/PixelCard/PixelCard"), { ssr: false }),
  PixelTransition: dynamic(() => import("@/components/demos/PixelTransition/PixelTransition"), { ssr: false }),
  ShapeBlur: dynamic(() => import("@/components/demos/ShapeBlur/ShapeBlur"), { ssr: false }),
  ShinyText: dynamic(() => import("@/components/demos/ShinyText/ShinyText"), { ssr: false }),
  SplitText: dynamic(() => import("@/components/demos/SplitText/SplitText"), { ssr: false }),
  SpotlightCard: dynamic(() => import("@/components/demos/SpotlightCard/SpotlightCard"), { ssr: false }),
  StarBorder: dynamic(() => import("@/components/demos/StarBorder/StarBorder"), { ssr: false }),
  Stepper: dynamic(() => import("@/components/demos/Stepper/Stepper"), { ssr: false }),
  TargetCursor: dynamic(() => import("@/components/demos/TargetCursor/TargetCursor"), { ssr: false }),
  TextType: dynamic(() => import("@/components/demos/TextType/TextType"), { ssr: false }),
  TiltedCard: dynamic(() => import("@/components/demos/TiltedCard/TiltedCard"), { ssr: false }),
  VariableProximity: dynamic(() => import("@/components/demos/VariableProximity/VariableProximity"), { ssr: false }),
};

interface Props {
  effectId: string;
  params?: BgValues;
  className?: string;
  style?: CSSProperties;
}

export function DemoStage({ effectId, params, className, style }: Props) {
  const eff = getDemoEffect(effectId);
  if (!eff) return null;
  const Cmp = REGISTRY[eff.component];
  if (!Cmp) return null;
  const props = eff.propsFrom({ ...defaultsOf(eff), ...(params ?? {}) });

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // fullBleed: a demo ocupa o palco inteiro (ex.: rolagem interna própria).
        padding: eff.fullBleed ? 0 : "clamp(16px, 4vw, 48px)",
        overflow: "hidden",
        ...style,
      }}
    >
      <Cmp {...props} />
    </div>
  );
}
