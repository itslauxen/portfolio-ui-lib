import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/articles";
import { ArticleReader } from "@/components/articles/ArticleReader";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  if (!a) return { title: "Artigo" };
  return {
    title: `${a.title.en} · Gabriel Lauxen`,
    description: a.subtitle.en,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();
  return (
    <div className="wrap">
      <ArticleReader article={a} />
    </div>
  );
}
