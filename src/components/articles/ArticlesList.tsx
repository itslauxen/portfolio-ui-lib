"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { articles } from "@/data/articles";
import s from "./articles.module.css";

export function ArticlesList() {
  const { t, lang } = useI18n();
  const L = (o: { pt: string; en: string }) => (lang === "en" ? o.en : o.pt);

  return (
    <div className={s.cards}>
      {articles.map((a) => (
        <Link key={a.slug} href={`/artigos/${a.slug}`} className={`${s.card} cursor-target`}>
          <div className={s.cardMeta}>
            {a.date} · {a.readMins} {t("articles.min")}
          </div>
          <div className={s.cardTitle}>{L(a.title)}</div>
          <div className={s.cardSub}>{L(a.subtitle)}</div>
          <span className={s.cardRead}>{t("articles.readMore")} →</span>
        </Link>
      ))}
    </div>
  );
}
