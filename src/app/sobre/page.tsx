"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile, skills, experience, education } from "@/data/profile";
import { useI18n } from "@/i18n/I18nProvider";
import { ArticlesList } from "@/components/articles/ArticlesList";
import { TechIcon } from "@/components/ui/TechIcon";
import s from "./sobre.module.css";

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

export default function SobrePage() {
  const { t, lang } = useI18n();
  const en = lang === "en";
  const rootRef = useRef<HTMLDivElement>(null);

  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: skills.filter((sk) => sk.category === cat),
  })).filter((g) => g.items.length > 0);

  // Motion com GSAP: intro do cabeçalho em cascata, seções revelando ao
  // entrar na viewport (ScrollTrigger) e a linha da timeline se desenhando
  // conforme o scroll. Nada roda com prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('[data-anim="head"] > *', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.09,
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
      gsap.from('[data-anim="line"]', {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: '[data-anim="timeline"]',
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={s.page} ref={rootRef}>
      <div className={s.glow} aria-hidden="true" />
      <div className="wrap">
        {/* -------- cabeçalho -------- */}
        <header className={s.head} data-anim="head">
          <span className="eyebrow">{t("about.eyebrow")}</span>
          <h1 className={s.name}>{profile.name}</h1>
          <p className={s.role}>
            {t("home.role")}
            <span className={s.status}>
              <span className={s.statusDot} aria-hidden="true" /> {t("about.status")}
            </span>
          </p>
          <dl className={s.facts}>
            {[
              [t("about.factExpV"), t("about.factExpL")],
              [t("about.factStackV"), t("about.factStackL")],
              [t("about.factEnV"), t("about.factEnL")],
              [t("about.factLocV"), t("about.factLocL")],
            ].map(([v, l]) => (
              <div key={l} className={s.fact}>
                <dt className={s.factValue}>{v}</dt>
                <dd className={s.factLabel}>{l}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* -------- bio -------- */}
        <section className={s.section} data-anim="section">
          {en ? (
            <>
              <p className={s.lead}>
                Fullstack developer with <strong>3+ years of experience</strong>: day to day I
                build complete applications with <strong>Node</strong>, <strong>Express</strong>,{" "}
                <strong>React</strong>, <strong>TypeScript</strong>, <strong>Sequelize</strong>,{" "}
                <strong>SQL</strong> and <strong>Docker</strong>, from data model to interface.
                Lately I&apos;ve been exploring the creative side of the web —{" "}
                <strong>three.js</strong>, <strong>WebGL</strong>, <strong>motion</strong> and{" "}
                <strong>shaders</strong> — and this site is the lab for it.
              </p>
              <p className={s.para}>
                Product-oriented: I think about the user and the delivery first, code second. I use
                AI as a real tool — I build <strong>agents with function calling</strong> in
                production and lean on LLMs to prototype and refactor fast, always reviewing and
                finishing by hand. I like leaving conventions,{" "}
                <strong>design tokens</strong> and reusable components so the whole team moves
                faster.
              </p>
            </>
          ) : (
            <>
              <p className={s.lead}>
                Desenvolvedor fullstack com <strong>3+ anos de experiência</strong>: no dia a dia
                construo aplicações completas com <strong>Node</strong>, <strong>Express</strong>,{" "}
                <strong>React</strong>, <strong>TypeScript</strong>, <strong>Sequelize</strong>,{" "}
                <strong>SQL</strong> e <strong>Docker</strong>, do modelo de dados à interface.
                Ultimamente venho explorando o lado criativo da web — <strong>three.js</strong>,{" "}
                <strong>WebGL</strong>, <strong>motion</strong> e <strong>shaders</strong> — e este
                site é o laboratório disso.
              </p>
              <p className={s.para}>
                Trabalho orientado a produto: penso primeiro no usuário e na entrega, depois no
                código. No dia a dia uso IA como ferramenta de verdade — construo{" "}
                <strong>agentes com function calling</strong> em produção e apoio LLMs para
                prototipar e refatorar rápido, sempre revisando e finalizando à mão. Gosto de deixar convenções, <strong>design tokens</strong> e
                componentes reutilizáveis para o time inteiro ganhar velocidade.
              </p>
            </>
          )}
        </section>

        {/* -------- experiência -------- */}
        <section className={s.section} data-anim="section">
          <div className={s.sectionLabel}>{t("about.labelExperience")}</div>
          <div className={s.timeline} data-anim="timeline">
            <span className={s.timelineLine} data-anim="line" aria-hidden="true" />
            {experience.map((job) => (
              <article key={job.company} className={s.job}>
                <div className={s.jobHead}>
                  <span className={s.jobRole}>
                    {en ? job.roleEn : job.role}{" "}
                    <span className={s.jobCompany}>@ {job.company}</span>
                  </span>
                  <span className={s.jobPeriod}>{en ? job.periodEn : job.period}</span>
                </div>
                {job.location && (
                  <div className={s.jobLoc}>{en ? job.locationEn ?? job.location : job.location}</div>
                )}
                <ul className={s.jobBullets}>
                  {(en ? job.bulletsEn : job.bullets).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
            {/* a graduação fecha a timeline: onde tudo começou (2022 — 2026) */}
            <article className={s.job}>
              <div className={s.jobHead}>
                <span className={s.jobRole}>
                  {en
                    ? "Systems Analysis and Development"
                    : "Análise e Desenvolvimento de Sistemas"}{" "}
                  <span className={s.jobCompany}>@ UNISINOS</span>
                </span>
                <span className={s.jobPeriod}>2022 — 2026</span>
              </div>
              <div className={s.jobLoc}>
                {en ? "São Leopoldo, RS, Brazil" : "São Leopoldo, RS, Brasil"}
              </div>
              <ul className={s.jobBullets}>
                <li>
                  {en
                    ? "Undergraduate degree — software engineering, databases and web development."
                    : "Graduação — engenharia de software, banco de dados e desenvolvimento web."}
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* -------- artigos -------- */}
        <section className={s.section} data-anim="section">
          <div className={s.sectionLabel}>{t("about.labelArticles")}</div>
          <ArticlesList />
        </section>

        {/* -------- formação -------- */}
        <section className={s.section} data-anim="section">
          <div className={s.sectionLabel}>{t("about.labelEducation")}</div>
          <div className={s.eduGrid}>
            {education.map((e) => {
              const note = en ? e.noteEn : e.note;
              return (
                <div key={e.title} className={s.edu}>
                  <div className={s.eduTitle}>{en ? e.titleEn : e.title}</div>
                  <div className={s.eduOrg}>{e.org}</div>
                  <div className={s.eduMeta}>
                    {e.period}
                    {note ? <span className={s.eduNote}> · {note}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* -------- stack -------- */}
        <section className={s.section} data-anim="section">
          <div className={s.sectionLabel}>{t("about.labelStack")}</div>
          <div className={s.stackGroups}>
            {groups.map((g) => (
              <div key={g.cat} className={s.stackCard}>
                <div className={s.groupName}>{t(CAT_KEY[g.cat] ?? g.cat)}</div>
                <div className={s.techGrid}>
                  {g.items.map((sk) => (
                    <span key={sk.name} className={s.tech}>
                      <TechIcon name={sk.name} size={15} />
                      {en ? SKILL_EN[sk.name] ?? sk.name : sk.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
