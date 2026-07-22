import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundStudio } from "@/components/backgrounds/BackgroundStudio";
import { BACKGROUND_CATALOG, getEffectMeta } from "@/lib/backgrounds";

export function generateStaticParams() {
  return BACKGROUND_CATALOG.map((e) => ({ id: e.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const eff = getEffectMeta(params.id);
  if (!eff) return { title: "Biblioteca" };
  return {
    title: `${eff.name} · Biblioteca`,
    description: eff.desc,
  };
}

export default function BibliotecaItemPage({ params }: { params: { id: string } }) {
  const eff = getEffectMeta(params.id);
  if (!eff) notFound();

  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">Biblioteca</span>
        <h1 className="page-title gradient-text">Biblioteca</h1>
        <p className="page-lead">
          Backgrounds, componentes e animações num só lugar. Escolha um item na lateral para
          vê-lo no palco e ajustar cada parâmetro pelos sliders, ao vivo. Cada item tem seu
          próprio link, então recarregar mantém a seleção.
        </p>
      </div>
      <BackgroundStudio selectedId={params.id} />
    </div>
  );
}
