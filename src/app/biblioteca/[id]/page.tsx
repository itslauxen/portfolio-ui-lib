import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundStudio } from "@/components/backgrounds/BackgroundStudio";
import { LibraryHeader } from "@/components/backgrounds/LibraryHeader";
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
      <LibraryHeader />
      <BackgroundStudio selectedId={params.id} />
    </div>
  );
}
