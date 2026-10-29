"use client";

import Link from "next/link";
import { BACKGROUND_CATALOG } from "@/lib/backgrounds";
import { references } from "@/data/acervo";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";
import s from "./acervo.module.css";

// Acervo: toolbox pessoal — bibliotecas e sites de referência (com preview de
// cada um) + o lab, com efeitos próprios e adaptados dessas referências.
export default function AcervoPage() {
  const { t, lang } = useI18n();
  const en = lang === "en";
  const host = (url: string) => new URL(url).host.replace(/^www\./, "");

  return (
    <div className={s.page}>
      <div className={s.glow} aria-hidden="true" />
      <div className="wrap">
        <header className={s.head}>
          <h1 className={s.title}>{t("acervo.title")}</h1>
          <p className={s.lead}>{t("acervo.lead")}</p>
        </header>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>{t("acervo.refsTitle")}</h2>
          <ul className={s.grid}>
            {references.map((r, i) => (
              <li key={r.slug}>
                <Reveal delay={(i % 2) * 0.06}>
                  <a href={r.url} target="_blank" rel="noreferrer" className={s.card}>
                    <span className={s.shot}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/acervo/${r.slug}.webp`}
                        alt={t("acervo.previewOf").replace("{name}", r.name)}
                        loading="lazy"
                        width={1200}
                        height={750}
                      />
                    </span>
                    <span className={s.body}>
                      <span className={s.nameRow}>
                        <span className={s.name}>{r.name}</span>
                        <span className={s.host}>
                          {host(r.url)} <span aria-hidden="true">↗</span>
                        </span>
                      </span>
                      <span className={s.note}>{en ? r.noteEn : r.note}</span>
                      <span className={s.tags}>
                        {r.tags.map((tag) => (
                          <span key={tag} className={s.tag}>
                            {tag}
                          </span>
                        ))}
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* o lab continua: efeitos reunidos, parametrizados e com código copiável */}
        <section className={`${s.section} ${s.lab}`}>
          <div>
            <h2 className={s.sectionTitle}>{t("acervo.labTitle")}</h2>
            <p className={s.labText}>
              {t("acervo.labText").replace("{n}", String(BACKGROUND_CATALOG.length))}
            </p>
          </div>
          <Link href="/biblioteca" className={s.labCta}>
            {t("acervo.labCta")} <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
