"use client";

import type { CSSProperties } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground/AnimatedBackground";
import { ReactBackground } from "./ReactBackground";
import { DemoStage } from "./DemoStage";
import { isDemoEffect, isReactEffect } from "@/lib/backgrounds";
import type { BgValues } from "@/lib/backgrounds/types";

interface Props {
  effectId: string;
  params?: BgValues;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Superfície unificada: escolhe o renderizador certo pelo tipo do item
 * (canvas via motor, fundo React/WebGL, ou demo de componente centrada).
 * O resto da UI (palco, editor) não precisa saber a diferença.
 */
export function BackgroundSurface({ effectId, params, interactive = true, className, style }: Props) {
  if (isDemoEffect(effectId)) {
    return <DemoStage effectId={effectId} params={params} className={className} style={style} />;
  }
  if (isReactEffect(effectId)) {
    return (
      <ReactBackground
        effectId={effectId}
        params={params}
        interactive={interactive}
        className={className}
        style={style}
      />
    );
  }
  return (
    <AnimatedBackground
      effectId={effectId}
      params={params}
      interactive={interactive}
      className={className}
      style={style}
    />
  );
}
