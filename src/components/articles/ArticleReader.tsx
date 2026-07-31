"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import type { Article } from "@/data/articles";
import s from "./articles.module.css";

export function ArticleReader({ article }: { article: Article }) {
  const { t, lang } = useI18n();
  const L = (o: { pt: string; en: string }) => (lang === "en" ? o.en : o.pt);

  return (
    <article className={s.article}>
      <Link href="/sobre" className={`${s.back} cursor-target`}>
        {t("articles.back")}
      </Link>

      <header className={s.head}>
        <span className="eyebrow">
          {article.date} · {article.readMins} {t("articles.min")}
        </span>
        <h1 className={s.title}>{L(article.title)}</h1>
        <p className={s.subtitle}>{L(article.subtitle)}</p>
      </header>

      <div className={s.body}>
        {article.blocks.map((b, i) => {
          if (b.type === "h2") {
            return (
              <h2 key={i} className={s.h2}>
                {L(b)}
              </h2>
            );
          }
          if (b.type === "p") {
            return (
              <p key={i} className={s.p}>
                {L(b)}
              </p>
            );
          }
          if (b.type === "ul") {
            const items = lang === "en" ? b.en : b.pt;
            return (
              <ul key={i} className={s.ul}>
                {items.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            );
          }
          // table
          return (
            <div key={i} className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    {b.head.map((h, j) => (
                      <th key={j}>{L(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((c, k) => (
                        <td key={k}>{L(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </article>
  );
}
