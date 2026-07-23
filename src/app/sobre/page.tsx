"use client";

import { profile, skills, experience, education } from "@/data/profile";
import { useI18n } from "@/i18n/I18nProvider";
import TargetCursor from "@/components/demos/TargetCursor/TargetCursor";
import ui from "@/components/ui/ui.module.css";
import s from "./sobre.module.css";

const CATEGORY_ORDER = ["Front-end", "Back-end & infra", "Criativo & motion", "Design & IA"];
const CAT_KEY: Record<string, string> = {
  "Front-end": "about.catFront",
  "Back-end & infra": "about.catBack",
  "Criativo & motion": "about.catCreative",
  "Design & IA": "about.catDesign",
};

export default function SobrePage() {
  const { t, lang } = useI18n();
  const en = lang === "en";
  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: skills.filter((sk) => sk.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <TargetCursor
      fullPage
      targetSelector=".cursor-target"
      cursorColor="#ededed"
      cursorColorOnTarget="#c6ff3a"
      spinDuration={3}
    >
      <div className="wrap section">
      <div className="page-head">
        <span className="eyebrow">{t("about.eyebrow")}</span>
        <h1 className="page-title">{profile.name}</h1>
        <p className="page-lead">
          {t("home.role")}
          {profile.location ? ` · ${profile.location}` : ""}
        </p>
      </div>

      <div className={s.facts}>
        <div className={s.fact}>
          <div className={s.factValue}>{t("about.factExpV")}</div>
          <div className={s.factLabel}>{t("about.factExpL")}</div>
        </div>
        <div className={s.fact}>
          <div className={s.factValue}>{t("about.factStackV")}</div>
          <div className={s.factLabel}>{t("about.factStackL")}</div>
        </div>
        <div className={s.fact}>
          <div className={s.factValue}>{t("about.factEnV")}</div>
          <div className={s.factLabel}>{t("about.factEnL")}</div>
        </div>
        <div className={s.fact}>
          <div className={s.factValue}>{t("about.factLocV")}</div>
          <div className={s.factLabel}>{t("about.factLocL")}</div>
        </div>
      </div>

      {en ? (
        <>
          <p className={s.lead}>
            Fullstack developer with <strong>4 years of experience</strong>: day to day I build
            complete applications with <strong>Node</strong>, <strong>Express</strong>,{" "}
            <strong>React</strong>, <strong>TypeScript</strong>, <strong>Sequelize</strong>,{" "}
            <strong>SQL</strong> and <strong>Docker</strong>, from data model to interface. Lately
            I&apos;ve been exploring the creative side of the web — <strong>three.js</strong>,{" "}
            <strong>WebGL</strong>, <strong>motion</strong> and <strong>shaders</strong> — and this
            site is the lab for it.
          </p>
          <p className={s.para}>
            Product-oriented: I think about the user and the delivery first, code second. I use AI
            as a real tool — I build <strong>agents with function calling</strong> in production and
            lean on LLMs (Groq, Cerebras, Gemini) to prototype and refactor fast, always reviewing
            and finishing by hand. I like leaving conventions, <strong>design tokens</strong> and
            reusable components so the whole team moves faster.
          </p>
        </>
      ) : (
        <>
          <p className={s.lead}>
            Desenvolvedor fullstack com <strong>4 anos de experiência</strong>: no dia a dia
            construo aplicações completas com <strong>Node</strong>, <strong>Express</strong>,{" "}
            <strong>React</strong>, <strong>TypeScript</strong>, <strong>Sequelize</strong>,{" "}
            <strong>SQL</strong> e <strong>Docker</strong>, do modelo de dados à interface.
            Ultimamente venho explorando o lado criativo da web — <strong>three.js</strong>,{" "}
            <strong>WebGL</strong>, <strong>motion</strong> e <strong>shaders</strong> — e este site
            é o laboratório disso.
          </p>
          <p className={s.para}>
            Trabalho orientado a produto: penso primeiro no usuário e na entrega, depois no código.
            No dia a dia uso IA como ferramenta de verdade — construo <strong>agentes com function
            calling</strong> em produção e apoio LLMs (Groq, Cerebras, Gemini) para prototipar e
            refatorar rápido, sempre revisando e finalizando à mão. Gosto de deixar convenções,
            <strong> design tokens</strong> e componentes reutilizáveis para o time inteiro ganhar
            velocidade.
          </p>
        </>
      )}

      <div className={s.status}>
        <span className={s.statusDot} /> {t("about.status")}
      </div>

      <section className={s.section}>
        <div className={s.sectionLabel}>{t("about.labelExperience")}</div>
        <div className={s.timeline}>
          {experience.map((job) => (
            <article key={job.company} className={`${s.job} cursor-target`}>
              <div className={s.jobHead}>
                <span className={s.jobRole}>
                  {en ? job.roleEn : job.role}{" "}
                  <span className={s.jobCompany}>@ {job.company}</span>
                </span>
                <span className={s.jobPeriod}>{en ? job.periodEn : job.period}</span>
              </div>
              {job.location && <div className={s.jobLoc}>{job.location}</div>}
              <ul className={s.jobBullets}>
                {(en ? job.bulletsEn : job.bullets).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionLabel}>{t("about.labelEducation")}</div>
        <div className={s.eduList}>
          {education.map((e) => {
            const note = en ? e.noteEn : e.note;
            return (
              <div key={e.title} className={s.edu}>
                <div>
                  <div className={s.eduTitle}>{en ? e.titleEn : e.title}</div>
                  <div className={s.eduOrg}>{e.org}</div>
                </div>
                <div className={s.eduMeta}>
                  {e.period}
                  {note ? (
                    <>
                      {" · "}
                      <span className={s.eduNote}>{note}</span>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionLabel}>{t("about.labelStack")}</div>
        <div className={s.stackGroups}>
          {groups.map((g) => (
            <div key={g.cat}>
              <div className={s.groupName}>{t(CAT_KEY[g.cat] ?? g.cat)}</div>
              <div className={s.tags}>
                {g.items.map((sk) => (
                  <span key={sk.name} className={ui.pill}>
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionLabel}>{t("about.labelContact")}</div>
        <div className={s.contact}>
          {profile.socials.map((soc) => (
            <a
              key={soc.label}
              href={soc.url}
              target="_blank"
              rel="noreferrer"
              className={`${ui.btn} cursor-target`}
            >
              {soc.label}
            </a>
          ))}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className={`${ui.btn} ${ui.btnPrimary} cursor-target`}>
              {t("about.contact")}
            </a>
          )}
        </div>
      </section>
      </div>
    </TargetCursor>
  );
}
