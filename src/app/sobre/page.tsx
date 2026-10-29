"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AsciiPortrait } from "@/components/about/AsciiPortrait";
import { GithubCard } from "@/components/about/GithubCard";
import { profile, skills, experience } from "@/data/profile";
import { experienceLabel } from "@/lib/experience";
import { useI18n } from "@/i18n/I18nProvider";
import s from "./sobre.module.css";

// Sobre no design 1d do canvas "Explorações" (revista: nome gigante, bio como
// texto de abertura, experiência em tabela tipográfica, hierarquia pelo tipo e
// por uma coluna de 200px) com a Stack do 1e (pílulas por frente + muro
// tipográfico).
const CATEGORY_ORDER = ["Front-end", "Back-end & infra", "Criativo & motion", "Design & IA"];
const CAT_KEY: Record<string, string> = {
  "Front-end": "about.catFront",
  "Back-end & infra": "about.catBack",
  "Criativo & motion": "about.catCreative",
  "Design & IA": "about.catDesign",
};
// Skills que não são nomes técnicos universais precisam de versão em inglês.
const SKILL_EN: Record<string, string> = {
  "Design de Interface": "Interface Design",
  "IA generativa": "Generative AI",
};
// Muro tipográfico (2a): ciclo de corpos; a cada 3 palavras uma em verde/bold.
const WALL_SIZES = [44, 32, 36, 32] as const;

export default function SobrePage() {
  const { t, lang } = useI18n();
  const en = lang === "en";
  const years = experienceLabel();
  const rootRef = useRef<HTMLDivElement>(null);
  const [stackTab, setStackTab] = useState(0);
  const [first, ...rest] = profile.name.split(" ");

  // Motion com GSAP: intro do cabeçalho em cascata e seções revelando ao
  // entrar na viewport (ScrollTrigger). Nada roda com prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('[data-anim="head"] > * > *', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.09,
      });
      // fatos + bio (logo abaixo da foto): entram junto com a abertura, sem
      // esperar o scroll — na maioria das telas já estão na primeira dobra
      gsap.from('[data-anim="intro"] > a, [data-anim="intro"] p', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.35,
      });
      gsap.utils.toArray<HTMLElement>('[data-anim="section"]').forEach((el) => {
        gsap.from(el.children, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const facts = [
    [t("about.factExpV").replace("{years}", years), t("about.factExpL")],
    [t("about.factStackV"), t("about.factStackL")],
    [t("about.factEnV"), t("about.factEnL")],
    [t("about.factLocV"), t("about.factLocL")],
  ];
  const stackWords = skills.filter((sk) => sk.category === CATEGORY_ORDER[stackTab]);

  return (
    <div className={s.page} ref={rootRef}>
      <div className={s.glow} aria-hidden="true" />
      <div className="wrap">
        {/* -------- abertura (5a): nome girado na margem esquerda como lombada
            de livro, retrato grande no centro, cargo + fatos 2×2 à direita -------- */}
        <header className={s.hero} data-anim="head">
          <h1 className={s.name}>
            {first} <span className={s.nameOutline}>{rest.join(" ")}</span>
          </h1>
          <div className={s.portrait}>
            {/* retrato em ASCII verde: clique/toque revela a foto (versão quase P&B) */}
            <AsciiPortrait
              src="/gabriel.webp"
              photoSrc="/gabriel-dim.webp"
              alt={profile.name}
              label={t("about.photoToggle")}
            />
          </div>
          <div className={s.heroText}>
            <span className={s.eyebrow}>{t("about.eyebrow")}</span>
            <p className={s.role}>{t("home.role")}</p>
            <dl className={s.facts}>
              {facts.map(([v, l]) => (
                <div key={l} className={s.fact}>
                  <dt className={s.factValue}>{v}</dt>
                  <dd className={s.factLabel}>{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {/* -------- card do GitHub | bio de abertura -------- */}
        <section className={s.intro} data-anim="intro">
          <GithubCard />
          <div className={s.bio}>
            {en ? (
              <>
                <p className={s.lead}>
                  Fullstack developer with <strong>{years} years of experience</strong>: day to day I
                  build complete applications with Node, Express, React, TypeScript, Sequelize, SQL
                  and Docker, from data model to interface.
                </p>
                <p className={s.para}>
                  Today my focus is <strong>AI agent orchestration</strong> — agents with tools,
                  function calling and MCP working together in production — and complete products:
                  web apps with Next.js and React, and <strong>native Swift and SwiftUI apps</strong>{" "}
                  that sync with the same backend. This site is the lab for the creative side:
                  three.js, WebGL, motion and shaders.
                </p>
              </>
            ) : (
              <>
                <p className={s.lead}>
                  Desenvolvedor fullstack com <strong>{years} anos de experiência</strong>: no dia a
                  dia construo aplicações completas com Node, Express, React, TypeScript, Sequelize,
                  SQL e Docker, do modelo de dados à interface.
                </p>
                <p className={s.para}>
                  Hoje meu foco é <strong>orquestração de agentes de IA</strong> — agentes com
                  tools, function calling e MCP trabalhando juntos em produção — e produtos
                  completos: aplicativos web com Next.js e React, e{" "}
                  <strong>apps nativos em Swift e SwiftUI</strong> que sincronizam com a mesma base.
                  Este site é o laboratório do lado criativo: three.js, WebGL, motion e shaders.
                </p>
              </>
            )}
          </div>
        </section>

        {/* -------- experiência: tabela tipográfica -------- */}
        <section className={s.section} data-anim="section">
          <h2 className={s.sectionTitle}>{t("about.expTitle")}</h2>
          <div className={s.jobs}>
            {experience.map((job) => (
              <article key={job.company} className={s.job}>
                <span className={s.jobYear} aria-hidden="true">
                  {job.year}
                </span>
                <div className={s.jobWho}>
                  <div className={s.jobCompany}>{job.company}</div>
                  <div className={s.jobRole}>{en ? job.roleEn : job.role}</div>
                  <div className={s.jobPeriod}>{en ? job.periodEn : job.period}</div>
                </div>
                <p className={s.jobSummary}>{en ? job.summaryEn : job.summary}</p>
              </article>
            ))}
            {/* a graduação fecha a tabela: onde tudo começou (2022 — 2026) */}
            <article className={s.job}>
              <span className={s.jobYear} aria-hidden="true">
                2022
              </span>
              <div className={s.jobWho}>
                <div className={s.jobCompany}>UNISINOS</div>
                <div className={s.jobRole}>{t("about.uniRole")}</div>
                <div className={s.jobPeriod}>{t("about.uniPeriod")}</div>
              </div>
              <p className={s.jobSummary}>{t("about.uniSummary")}</p>
            </article>
          </div>
        </section>

        {/* -------- stack (2a): frentes numeradas na coluna de 200px, à direita
            a descrição da frente ativa, numeral vazado e o muro de palavras -------- */}
        <section className={s.section} data-anim="section">
          <h2 className={s.sectionTitle}>{t("about.stackTitle")}</h2>
          <div className={s.stack}>
            <div className={s.stackCats} role="tablist" aria-label={t("about.stackTitle")}>
              {CATEGORY_ORDER.map((cat, i) => {
                const on = i === stackTab;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className={`${s.stackCat} ${on ? s.stackCatOn : ""}`}
                    onClick={() => setStackTab(i)}
                    onMouseEnter={() => setStackTab(i)}
                  >
                    <span className={s.stackNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.stackName}>{t(CAT_KEY[cat])}</span>
                  </button>
                );
              })}
            </div>
            <div className={s.stackPanel} key={stackTab}>
              <span className={s.ghostNum} aria-hidden="true">
                {String(stackTab + 1).padStart(2, "0")}
              </span>
              <p className={s.stackDesc}>{t(`home.cat${stackTab + 1}d`)}</p>
              <div className={s.wall}>
                {stackWords.map((sk, i) => (
                  <span
                    key={sk.name}
                    className={`${s.word} ${i % 3 === 0 ? s.wordHot : ""}`}
                    style={{ fontSize: `${WALL_SIZES[i % WALL_SIZES.length]}px` }}
                  >
                    {en ? SKILL_EN[sk.name] ?? sk.name : sk.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
