"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BackgroundSurface } from "@/components/backgrounds/BackgroundSurface";
import { defaultsOf, getEffectMeta } from "@/lib/backgrounds";
import type { BgValues } from "@/lib/backgrounds/types";
import s from "./liveWords.module.css";

interface Box {
  ascent: number;
  family: string;
  size: string;
  weight: string;
  spacing: string;
}

/**
 * Palavra do título feita de um efeito do lab: o shader roda numa camada do tamanho da palavra,
 * recortada pelas próprias letras (clip-path com <text> em SVG, na mesma fonte e medida).
 * Sem recorte possível (palavra quebrada em duas linhas, tela estreita, fonte ainda carregando),
 * a palavra fica no verde de destaque, como texto comum.
 */
export function LiveWords({ text, effectId, params }: { text: string; effectId: string; params?: BgValues }) {
  const ref = useRef<HTMLSpanElement>(null);
  const id = `lw${useId().replace(/[^a-z0-9]/gi, "")}`;
  const [box, setBox] = useState<Box | null>(null);
  // o shader só existe com a palavra na tela: rolou para baixo, ele é desmontado (um contexto WebGL
  // e um laço de animação a menos) e a palavra fica no verde liso até voltar
  const [naTela, setNaTela] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let vivo = true;
    const medir = () => {
      if (!vivo) return;
      if (window.matchMedia("(max-width: 960px)").matches || el.getClientRects().length !== 1) return setBox(null);
      const cs = getComputedStyle(el);
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return setBox(null);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      // a caixa de um trecho de texto em linha tem a altura da fonte (subida + descida): a linha de
      // base fica a uma "subida" do topo dela
      setBox({ ascent: ctx.measureText(text).fontBoundingBoxAscent, family: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight, spacing: cs.letterSpacing });
    };
    document.fonts?.ready.then(medir);
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => {
      vivo = false;
      obs.disconnect();
    };
  }, [text]);

  const meta = getEffectMeta(effectId);
  return (
    <span ref={ref} className={s.word} data-live={box ? "" : undefined}>
      {text}
      {box && meta && (
        <span className={s.layer} aria-hidden="true" style={{ clipPath: `url(#${id})` }}>
          <span className={s.fx}>
            {naTela && <BackgroundSurface key={effectId} effectId={effectId} params={{ ...defaultsOf(meta), ...params }} interactive={false} />}
          </span>
          <svg width="0" height="0" className={s.defs}>
            <defs>
              <clipPath id={id} clipPathUnits="userSpaceOnUse">
                <text x="0" y={box.ascent} style={{ fontFamily: box.family, fontSize: box.size, fontWeight: box.weight, letterSpacing: box.spacing }}>
                  {text}
                </text>
              </clipPath>
            </defs>
          </svg>
        </span>
      )}
    </span>
  );
}
