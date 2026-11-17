"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BACKGROUND_CATALOG, defaultsOf, getEffectMeta } from "@/lib/backgrounds";
import { BackgroundSurface } from "@/components/backgrounds/BackgroundSurface";
import { references } from "@/data/acervo";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";
import s from "./acervo.module.css";

// O painel do lab é um efeito do próprio lab rodando ao vivo (Gradient Blinds nas cores do site).
const LAB_EFFECT = "gradientblinds";
const LAB_PARAMS = { color1: "#3ce97f", color2: "#14522e", color3: "#7bffb9", angle: 28, blindCount: 14, noise: 0.3 };
// atalhos para dentro do estúdio
const LAB_PICKS = ["plasmawave", "ferrofluid", "dither", "lightrays"];

// Acervo: toolbox pessoal. Primeiro o lab (efeitos próprios e adaptados, ao vivo), depois as
// bibliotecas e sites de referência, com a prévia de cada um.
export default function AcervoPage() {
  const { t, lang } = useI18n();
  const en = lang === "en";
  const host = (url: string) => new URL(url).host.replace(/^www\./, "");

  // o shader do painel só roda perto da tela (um contexto WebGL a menos quando se rola a página)
  const labRef = useRef<HTMLElement>(null);
  const [labOn, setLabOn] = useState(false);
  useEffect(() => {
    const el = labRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return setLabOn(true);
    const io = new IntersectionObserver(([e]) => setLabOn(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const labMeta = getEffectMeta(LAB_EFFECT);
  const picks = LAB_PICKS.map((id) => getEffectMeta(id)).filter((e) => !!e);

  return (
    <div className={s.page}>
      <div className={s.glow} aria-hidden="true" />
      <div className="wrap">
        <header className={s.head}>
          <h1 className={s.title}>{t("acervo.title")}</h1>
          <p className={s.lead}>{t("acervo.lead")}</p>
        </header>

        {/* o lab vem primeiro: efeitos reunidos, parametrizados e com código copiável */}
        <section ref={labRef} className={`${s.section} ${s.lab}`}>
          <div className={s.labLive} aria-hidden="true">
            {labOn && labMeta && (
              <BackgroundSurface effectId={LAB_EFFECT} params={{ ...defaultsOf(labMeta), ...LAB_PARAMS }} />
            )}
          </div>
          <div className={s.labBody}>
            <h2 className={s.labTitle}>{t("acervo.labTitle")}</h2>
            <p className={s.labText}>
              {t("acervo.labText").replace("{n}", String(BACKGROUND_CATALOG.length))}
            </p>
            <Link href="/biblioteca" className={s.labCta}>
              {t("acervo.labCta")} <span aria-hidden="true">→</span>
            </Link>
            {picks.length > 0 && (
              <p className={s.labPicks}>
                <span>{t("acervo.labPicks")}</span>
                {picks.map((e) => (
                  <Link key={e!.id} href={`/biblioteca/${e!.id}`}>
                    {e!.name}
                  </Link>
                ))}
              </p>
            )}
          </div>
        </section>

        <section className={s.section}>
          <div className={s.sectionHead}>
            <h2 className={s.sectionTitle}>{t("acervo.refsTitle")}</h2>
            <span className={s.count}>{references.length}</span>
          </div>
          <ul className={s.grid}>
            {references.map((r, i) => (
              <li key={r.slug}>
                <Reveal delay={(i % 3) * 0.05}>
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
                      <span className={s.tags}>{r.tags.join(" · ")}</span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
