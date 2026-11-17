"use client";

// Página técnica: um item do lab em tela cheia sobre preto, sem menu nem texto. Existe só para o
// script scripts/gen-lab-thumbs.mjs fotografar cada item e gerar as miniaturas da galeria do lab
// (public/lab-thumbs/<id>.webp). Componentes são desenhados em 1280×800 e a foto é reduzida.
import { BackgroundSurface } from "@/components/backgrounds/BackgroundSurface";
import { getEffectMeta, previewParamsOf } from "@/lib/backgrounds";

export default function ThumbPage({ params }: { params: { id: string } }) {
  const eff = getEffectMeta(params.id);
  if (!eff) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "#000" }}>
      <BackgroundSurface effectId={eff.id} params={previewParamsOf(eff)} interactive={false} />
    </div>
  );
}
