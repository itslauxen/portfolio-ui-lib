"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArticlesList } from "@/components/articles/ArticlesList";
import { BackgroundSurface } from "@/components/backgrounds/BackgroundSurface";
import { ContactModal } from "@/components/ContactModal/ContactModal";
import LogoLoop from "@/components/demos/LogoLoop/LogoLoop";
import { HeroChip } from "@/components/home/HeroChip";
import { ProjectCase } from "@/components/home/ProjectCase";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { Reveal } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";
import { useI18n } from "@/i18n/I18nProvider";
import { experienceLabel } from "@/lib/experience";
import { profile, skills } from "@/data/profile";
import { projects } from "@/data/projects";
import s from "./page.module.css";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Fundo do hero: Grainient da própria biblioteca (/biblioteca/grainient),
// tematizado na paleta verde-noite do site. Mude aqui pra reestilizar.
const HERO_GRAINIENT = {
  color1: "#101311",
  color2: "#1c6b3f",
  color3: "#4ef08c",
  colorBalance: -0.2,
  timeSpeed: 0.2,
  grainAmount: 0.12,
  contrast: 1.4,
  zoom: 0.9,
};

// Camada de textura por cima: Dither (/biblioteca/dither) em verde, mesclado
// via blend no CSS (.heroBgBlend) — ondas retrô pixeladas sobre o gradiente.
const HERO_DITHER = {
  waveColor: "#4ef08c",
  colorNum: 4,
  pixelSize: 2,
};

// Cards da seção "O que eu domino" (design 2a): 4 categorias, a criativa
// destacada em verde sólido. Os nomes vêm de profile.skills.
const SKILL_CARDS = [
  { cat: "Front-end", key: "about.catFront" },
  { cat: "Back-end & infra", key: "about.catBack" },
  { cat: "Criativo & motion", key: "about.catCreative" },
  { cat: "Design & IA", key: "about.catDesign" },
] as const;

// Skills que não são nomes técnicos universais precisam de versão em inglês.
const SKILL_EN: Record<string, string> = {
  "Design de Interface": "Interface Design",
  "IA generativa": "Generative AI",
};

// Tamanhos do muro tipográfico (design 3a): ciclo de três corpos.
const WALL_SIZES = [48, 36, 40, 36, 48, 36, 40, 36] as const;

// Passos do processo ("Como eu trabalho") — sequência real, números fazem sentido.
const STEPS = [
  { t: "home.step1t", d: "home.step1d" },
  { t: "home.step2t", d: "home.step2d" },
  { t: "home.step3t", d: "home.step3d" },
  { t: "home.step4t", d: "home.step4d" },
] as const;

// Marquee de stack: logos monocromáticas cinza.
const LOOP_TECHS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "Vue.js",
  "Docker",
  "PostgreSQL",
  "MongoDB",
  "Three.js",
  "GSAP",
  "Sequelize",
] as const;

export default function HomePage() {
  const { t, lang } = useI18n();
  const en = lang === "en";
  const reduced = useReducedMotion();
  const [contactOpen, setContactOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState(0);
  // 3a: auto-rotação entre as frentes a cada 4s até o primeiro clique.
  const [skillAuto, setSkillAuto] = useState(true);
  useEffect(() => {
    if (!skillAuto || reduced) return;
    const id = setInterval(() => setActiveSkill((v) => (v + 1) % SKILL_CARDS.length), 4000);
    return () => clearInterval(id);
  }, [skillAuto, reduced]);

  // Scroll horizontal do touchpad também navega o carrossel. Listener
  // manual não-passivo: o onWheel do React é passivo e não deixaria
  // prevenir o gesto de voltar página do macOS. Delta acumulado + cooldown
  // pra um gesto contar como UMA troca, não uma rajada.
  const stackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    let accum = 0;
    let lockUntil = 0;
    let lastEvent = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastEvent > 300) accum = 0;
      lastEvent = now;
      if (now < lockUntil) return;
      accum += e.deltaX;
      if (Math.abs(accum) < 60) return;
      const forward = accum > 0;
      accum = 0;
      lockUntil = now + 650;
      setSkillAuto(false);
      setActiveSkill((v) => (v + (forward ? 1 : SKILL_CARDS.length - 1)) % SKILL_CARDS.length);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  const featured = projects.filter((p) => p.featured);

  const years = experienceLabel();
  const HERO_STATS = [
    { value: t("home.stat1v").replace("{years}", years), label: t("home.stat1l") },
    { value: t("home.stat2v"), label: t("home.stat2l") },
    { value: t("home.stat3v"), label: t("home.stat3l") },
  ];

  // Entrada em cascata do hero (riseIn do design 2a).
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  // Painel de projetos sobe e aparece conforme entra na tela, ligado ao
  // progresso do scroll e reversível ao rolar de volta. (Sem scale: com 4
  // vitrines o painel tem ~4 telas, e re-rasterizar isso a cada frame travava
  // a rolagem rápida.)
  const projectsRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: projectsRef,
    // curso longo (termina só perto do topo): o painel viaja mais, fica fluido
    offset: ["start end", "start 0.18"],
  });
  // Mecânica estilo Stitch: o painel SOBE (y) enquanto aparece, com molas
  // por cima dos valores crus pra ter inércia em vez do 1:1 travado.
  const rawY = useTransform(scrollYProgress, [0, 1], [110, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const spring = { stiffness: 90, damping: 24, mass: 0.6 };
  const panelY = useSpring(rawY, spring);
  const panelOpacity = useSpring(rawOpacity, spring);

  // "Como eu trabalho": o trilho vertical se desenha conforme a lista
  // passa pela tela — scaleY 0→1 com mola por cima pra ter inércia.
  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const trackScale = useSpring(processProgress, { stiffness: 120, damping: 28, mass: 0.5 });

  // Rolagem suave até os projetos: posição de LAYOUT via offsetTop (imune
  // aos transforms da animação de entrada) menos o scroll-margin-top.
  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("projects");
    if (!el) return;
    e.preventDefault();
    const behavior = reduced ? ("auto" as const) : ("smooth" as const);
    let top = 0;
    let node: HTMLElement | null = el;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop || "0") || 0;
    window.scrollTo({ top: top - margin, behavior });
    window.history.pushState(null, "", "#projects");
  };


  return (
    <>
      {/* PALCO: o fundo Grainient+Dither cobre hero E painel de projetos,
          pra o vidro do painel ter o que desfocar (uma instância só). */}
      <div className={s.stage}>
      <div className={s.heroBg} aria-hidden="true">
        <BackgroundSurface effectId="grainient" interactive={false} params={HERO_GRAINIENT} />
        <div className={s.heroBgBlend}>
          <BackgroundSurface effectId="dither" interactive={false} params={HERO_DITHER} />
        </div>
      </div>

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroScrim} aria-hidden="true" />
        {/* fronteira "lava": degradê de base + blobs bem suaves derivando —
            orgânico, ondulado, sem nenhuma ponta */}
        <div className={s.heroMelt} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={`wrap ${s.heroContent}`}>
          <div className={s.heroTop}>
            <motion.h1 className={s.heroTitle} {...rise(0.12)}>
              {t("home.titleLine1")}
              <br />
              {t("home.t2pre")}
              <span className={s.hl}>{t("home.t2hl")}</span>
              {t("home.t2post")}
            </motion.h1>
            <motion.div className={s.heroAsset} {...rise(0.3)}>
              <HeroChip />
            </motion.div>
          </div>
          <motion.div className={s.heroRow} {...rise(0.26)}>
            <p className={s.heroLead}>{t("home.lead").replace("{years}", years)}</p>
            <div className={s.heroActions}>
              <Link href="/#projects" className={s.btnSolid} onClick={scrollToProjects}>
                {t("home.ctaProjects")}
              </Link>
              <Link href="/biblioteca" className={s.btnOutline}>
                {t("home.ctaLibrary")}
              </Link>
            </div>
          </motion.div>
          <motion.dl className={s.heroStats} {...rise(0.4)}>
            {HERO_STATS.map((st, i) => (
              <div key={i} className={s.heroStat}>
                <dt className={s.heroStatValue}>{st.value}</dt>
                <dd className={s.heroStatLabel}>{st.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* PROJETOS: painel de vidro que cresce sutilmente ao entrar na tela */}
      <motion.section
        ref={projectsRef}
        className={s.projects}
        id="projects"
        style={reduced ? undefined : { opacity: panelOpacity, y: panelY }}
      >
        <div className="wrap">
          <Reveal>
            <h2 className={s.sectionTitle}>{t("home.worksTitle")}</h2>
          </Reveal>
          {/* uma vitrine grande por projeto: telas reais (web, celular,
              app nativo, efeitos ao vivo) em vez de cards pequenos */}
          <div className={s.projectList}>
            {featured.map((p) => (
              <Reveal key={p.id}>
                <ProjectCase project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </motion.section>
      </div>

      {/* MARQUEE DE STACK: logos cinza em loop, logo após os projetos */}
      <section className={s.logosBand} aria-label="Stack">
        <LogoLoop
          logos={LOOP_TECHS.map((name) => ({
            node: (
              <span className={s.logoItem}>
                <TechIcon name={name} size={20} />
                {name}
              </span>
            ),
            title: name,
          }))}
          speed={60}
          logoHeight={24}
          gap={56}
          pauseOnHover
          fadeOut
          fadeOutColor="#101311"
        />
      </section>

      {/* O QUE EU CONSTRUO (design 1b): lista + micro-interface do serviço ativo */}
      <section className="wrap">
        <div className={s.services}>
          <Reveal>
            <ServicesShowcase />
          </Reveal>
        </div>
      </section>

      {/* O QUE EU DOMINO: painel 3a — numeral fantasma, descrição por
          frente, barrinha nos botões e auto-rotação até o primeiro clique */}
      <section className="wrap">
        <div className={s.skills}>
          <Reveal>
            <h2 className={s.sectionTitle}>{t("home.skillsTitle")}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className={s.skillsPanel}>
              {/* pilha de slides no MESMO grid cell: o container fica com a
                  altura do slide mais alto — trocar de página não empurra o
                  resto. Arrastável no eixo X (swipe) via Motion. */}
              <motion.div
                ref={stackRef}
                className={s.slideStack}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) < 60) return;
                  setSkillAuto(false);
                  setActiveSkill(
                    (v) =>
                      (v + (info.offset.x < 0 ? 1 : SKILL_CARDS.length - 1)) % SKILL_CARDS.length
                  );
                }}
              >
                <motion.div
                  key={`ghost-${activeSkill}`}
                  className={s.ghostNum}
                  aria-hidden="true"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {String(activeSkill + 1).padStart(2, "0")}
                </motion.div>
                {SKILL_CARDS.map((c, ci) => {
                  const active = ci === activeSkill;
                  return (
                    <div
                      key={c.cat}
                      className={s.slide}
                      data-active={active || undefined}
                      aria-hidden={!active}
                    >
                      <h3 className={s.catTitle}>{t(c.key)}</h3>
                      <p className={s.wallDesc}>{t(`home.cat${ci + 1}d`)}</p>
                      <div className={s.techWall}>
                        {skills
                          .filter((sk) => sk.category === c.cat)
                          .map((sk, i) => (
                            <motion.span
                              key={sk.name}
                              className={`${s.techWord} ${i % 3 === 0 ? s.techWordHot : ""}`}
                              style={{ "--ws": `${WALL_SIZES[i % WALL_SIZES.length]}px` } as React.CSSProperties}
                              animate={
                                reduced
                                  ? undefined
                                  : { opacity: active ? 1 : 0, y: active ? 0 : 14 }
                              }
                              transition={{
                                duration: 0.45,
                                ease: EASE,
                                delay: active ? i * 0.045 : 0,
                              }}
                            >
                              {en ? SKILL_EN[sk.name] ?? sk.name : sk.name}
                            </motion.span>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
              {/* navegação do carrossel: barrinhas, uma por frente */}
              <div className={s.dots}>
                {SKILL_CARDS.map((c, i) => (
                  <button
                    key={c.cat}
                    type="button"
                    aria-label={t(c.key)}
                    className={`${s.dot} ${i === activeSkill ? s.dotOn : ""}`}
                    onClick={() => {
                      setActiveSkill(i);
                      setSkillAuto(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMO EU TRABALHO: 4 etapas numa lista vertical com trilho à esquerda */}
      <section className="wrap">
        <div className={s.process}>
          <Reveal>
            <h2 className={s.sectionTitle}>{t("home.processTitle")}</h2>
          </Reveal>
          <div className={s.stepTrack} ref={processRef}>
            <motion.span
              className={s.trackLine}
              aria-hidden="true"
              style={reduced ? undefined : { scaleY: trackScale }}
            />
            <div className={s.stepRow}>
              {STEPS.map((st, i) => (
                <Reveal key={st.t} delay={i * 0.08}>
                  <div className={s.step}>
                    <span
                      className={`${s.stepDot} ${[s.dotA, s.dotB, s.dotC, s.dotD][i]}`}
                      aria-hidden="true"
                    />
                    <span className={s.stepBigNum}>{String(i + 1).padStart(2, "0")}</span>
                    <div className={s.stepBody}>
                      <div className={s.stepName}>{t(st.t)}</div>
                      <p className={s.stepDesc}>{t(st.d)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARTIGO EM DESTAQUE */}
      <section className="wrap">
        <div className={s.articleSec}>
          <Reveal>
            <h2 className={s.sectionTitle}>{t("home.articleTitle")}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className={s.articleGrid}>
              <ArticlesList />
            </div>
          </Reveal>
        </div>
      </section>

      {/* VAMOS TRABALHAR JUNTOS */}
      <section className="wrap">
        <Reveal>
          <div className={s.ctaBand}>
            <div>
              <h2 className={s.ctaTitle}>{t("home.ctaTitle")}</h2>
              <p className={s.ctaSub}>{t("home.ctaSub")}</p>
            </div>
            <button type="button" className={s.ctaEmail} onClick={() => setContactOpen(true)}>
              <span className={s.ctaEmailFull}>{profile.email}</span>
              <span className={s.ctaEmailShort}>{t("nav.contact")}</span>
            </button>
          </div>
        </Reveal>
      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
