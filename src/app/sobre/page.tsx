import type { Metadata } from "next";
import { profile, skills, experience, education } from "@/data/profile";
import ui from "@/components/ui/ui.module.css";
import s from "./sobre.module.css";

export const metadata: Metadata = {
  title: "Sobre — Gabriel Lauxen",
  description:
    "Desenvolvedor fullstack com 4 anos de experiência. Experiência profissional, formação, stack e fluxo de trabalho.",
};

const CATEGORY_ORDER = ["Front-end", "Back-end & infra", "Criativo & motion", "Design & IA"];

export default function SobrePage() {
  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: skills.filter((sk) => sk.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="wrap section">
      <div className="page-head">
        <span className="eyebrow">Sobre</span>
        <h1 className="page-title">{profile.name}</h1>
        <p className="page-lead">
          {profile.role}
          {profile.location ? ` · ${profile.location}` : ""}
        </p>
      </div>

      <div className={s.facts}>
        <div className={s.fact}>
          <div className={s.factValue}>4 anos</div>
          <div className={s.factLabel}>de experiência</div>
        </div>
        <div className={s.fact}>
          <div className={s.factValue}>Fullstack</div>
          <div className={s.factLabel}>front · back · banco</div>
        </div>
        <div className={s.fact}>
          <div className={s.factValue}>Inglês</div>
          <div className={s.factLabel}>avançado · Austrália</div>
        </div>
        <div className={s.fact}>
          <div className={s.factValue}>RS · BR</div>
          <div className={s.factLabel}>Novo Hamburgo · remoto</div>
        </div>
      </div>

      <p className={s.lead}>
        Desenvolvedor fullstack com <strong>4 anos de experiência</strong>: no dia a dia construo
        aplicações completas com <strong>Node</strong>, <strong>Express</strong>,{" "}
        <strong>React</strong>, <strong>TypeScript</strong>, <strong>Sequelize</strong>,{" "}
        <strong>SQL</strong> e <strong>Docker</strong>, do modelo de dados à interface. Ultimamente
        venho explorando o lado criativo da web — <strong>three.js</strong>, <strong>WebGL</strong>,{" "}
        <strong>motion</strong> e <strong>shaders</strong> — e este site é o laboratório disso.
      </p>
      <p className={s.para}>
        Trabalho orientado a produto: penso primeiro no usuário e na entrega, depois no código.
        No dia a dia uso IA como ferramenta de verdade — construo <strong>agentes com function
        calling</strong> em produção e apoio LLMs (Groq, Cerebras, Gemini) para prototipar e
        refatorar rápido, sempre revisando e finalizando à mão. Gosto de deixar convenções,
        <strong> design tokens</strong> e componentes reutilizáveis para o time inteiro ganhar
        velocidade.
      </p>
      <div className={s.status}>
        <span className={s.statusDot} /> aberto a novas oportunidades
      </div>

      <section className={s.section}>
        <div className={s.sectionLabel}>experiência</div>
        <div className={s.timeline}>
          {experience.map((job) => (
            <article key={job.company} className={`${s.job} cursor-target`}>
              <div className={s.jobHead}>
                <span className={s.jobRole}>
                  {job.role} <span className={s.jobCompany}>@ {job.company}</span>
                </span>
                <span className={s.jobPeriod}>{job.period}</span>
              </div>
              {job.location && <div className={s.jobLoc}>{job.location}</div>}
              <ul className={s.jobBullets}>
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionLabel}>formação</div>
        <div className={s.eduList}>
          {education.map((e) => (
            <div key={e.title} className={s.edu}>
              <div>
                <div className={s.eduTitle}>{e.title}</div>
                <div className={s.eduOrg}>{e.org}</div>
              </div>
              <div className={s.eduMeta}>
                {e.period}
                {e.note ? (
                  <>
                    {" · "}
                    <span className={s.eduNote}>{e.note}</span>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionLabel}>stack</div>
        <div className={s.stackGroups}>
          {groups.map((g) => (
            <div key={g.cat}>
              <div className={s.groupName}>{g.cat}</div>
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
        <div className={s.sectionLabel}>contato</div>
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
              Fale comigo
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
