"use client";

import { useEffect, useRef, useState } from "react";
import { BackgroundSurface } from "./BackgroundSurface";
import { getEffectMeta, previewParamsOf, isReactEffect } from "@/lib/backgrounds";
import type { BackgroundEffect, BgValues } from "@/lib/backgrounds/types";

/** Gradiente estático (poster) derivado das cores do efeito, mostrado antes/depois de rodar. */
export function posterFor(eff: BackgroundEffect): string {
  const cols = eff.params
    .filter((p) => p.type === "color" && p.key !== "bg")
    .map((p) => p.default as string);
  const bg = (eff.params.find((p) => p.key === "bg")?.default as string) || "#0d0d1a";
  if (cols.length >= 2) return `linear-gradient(135deg, ${cols[0]} 0%, ${cols[1]} 55%, ${bg} 100%)`;
  if (cols.length === 1) return `linear-gradient(135deg, ${cols[0]}, ${bg})`;
  return bg;
}

interface Props {
  effectId: string;
  params?: BgValues;
  /** Só roda a animação quando visível na viewport (poupa contextos WebGL). */
  lazy?: boolean;
  className?: string;
}

/**
 * Preview de um background no grid.
 *
 * Efeitos de canvas 2D são baratos e rodam ao vivo assim que ficam visíveis.
 * Efeitos WebGL (shaders do motor + shaders React) exigem um contexto GL cada;
 * rodar um grid inteiro deles estoura o limite de contextos do navegador (~16)
 * e eles renderizam quebrados. Por isso, os WebGL só animam ao passar o mouse
 *, fora disso mostram o poster de cores. Assim há no máximo 1–2 contextos vivos.
 */
export function BackgroundPreview({ effectId, params, lazy = true, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!lazy);
  const [hover, setHover] = useState(false);
  const meta = getEffectMeta(effectId);
  const webgl = !!meta && (meta.gl === true || isReactEffect(effectId));

  useEffect(() => {
    if (!lazy) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setVisible(e.isIntersecting)),
      { rootMargin: "220px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  const poster = meta ? posterFor(meta) : "#0d0d1a";
  const p = params ?? (meta ? previewParamsOf(meta) : undefined);
  // WebGL: só quando o mouse está em cima. Canvas 2D: sempre que visível.
  const run = !!meta && visible && (webgl ? hover : true);

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={webgl ? () => setHover(true) : undefined}
      onMouseLeave={webgl ? () => setHover(false) : undefined}
      style={{ position: "absolute", inset: 0, background: poster }}
    >
      {run && <BackgroundSurface effectId={effectId} params={p} interactive={false} />}
    </div>
  );
}
