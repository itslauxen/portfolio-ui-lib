"use client";

import Link from "next/link";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { CursorDither } from "@/components/home/CursorDither";
import { ProjectCard, Tilt } from "@/components/home/ProjectCard";
import { BackgroundSurface } from "@/components/backgrounds/BackgroundSurface";
import PixelTransition from "@/components/demos/PixelTransition/PixelTransition";
import TargetCursor from "@/components/demos/TargetCursor/TargetCursor";
import { Ticker } from "@/components/home/Ticker";
import { Reveal } from "@/components/ui/Reveal";
import { Scramble } from "@/components/ui/Scramble";
import { useI18n } from "@/i18n/I18nProvider";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import ui from "@/components/ui/ui.module.css";
import s from "./page.module.css";

export default function HomePage() {
  const { t } = useI18n();
  const featured = projects.filter((p) => p.featured);
  const isExternal = (url?: string) => !!url && /^https?:\/\//.test(url);
  const nameParts = profile.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || nameParts[0];

  const HERO_STATS = [
    { value: t("home.stat1v"), label: t("home.stat1l") },
    { value: t("home.stat2v"), label: t("home.stat2l") },
    { value: t("home.stat3v"), label: t("home.stat3l") },
  ];

  return (
    <TargetCursor
      fullPage
      className={s.cursorZone}
      targetSelector=".cursor-target"
      cursorColor="#ededed"
      cursorColorOnTarget="#c6ff3a"
      spinDuration={3}
    >
      <CursorDither />

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroBg}>
          <HeroBackdrop />
        </div>
        <div className={s.heroScrim} />
        <div className={`wrap ${s.heroContent}`}>
          <Reveal mode="mount" y={14}>
            <span className="eyebrow">
              {profile.location ? `${profile.location} · ` : ""}
              {t("home.eyebrow")}
            </span>
            <p className={s.heroPrompt}>
              <span className={s.heroPromptSign}>$</span> whoami
              <span className="caret" />
            </p>
          </Reveal>
          <h1 className={s.heroTitle}>
            <Scramble text={firstName} delay={0.2} duration={1.5} className={s.heroTitleLine} />
            <Scramble
              text={lastName}
              delay={0.45}
              duration={1.5}
              className={`${s.heroTitleLine} ${s.heroTitleOutline}`}
            />
          </h1>
          <Reveal mode="mount" delay={0.4}>
            <p className={s.heroRole}>{t("home.role")}</p>
            <p className={s.heroTagline}>{t("home.tagline")}</p>
          </Reveal>
          <Reveal mode="mount" delay={0.6}>
            <div className={s.heroActions}>
              <Link href="/biblioteca" className={`${ui.btn} ${ui.btnPrimary} cursor-target`}>
                {t("home.ctaLibrary")}
              </Link>
              <Link href="#projetos" className={`${ui.btn} cursor-target`}>
                {t("home.ctaProjects")}
              </Link>
            </div>
          </Reveal>
          <Reveal mode="mount" delay={0.8}>
            <dl className={s.heroStats}>
              {HERO_STATS.map((st, i) => (
                <div key={i} className={`${s.heroStat} cursor-target`}>
                  <span className={s.heroStatIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <dt className={s.heroStatValue}>{st.value}</dt>
                  <dd className={s.heroStatLabel}>{st.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* TICKER */}
      <Ticker />

      {/* PROJETOS */}
      <section className="wrap section" id="projetos">
        <Reveal>
          <div className={s.sectionHead}>
            <div>
              <span className="eyebrow">{t("home.worksEyebrow")}</span>
              <h2 className={s.sectionTitle}>{t("home.worksTitle")}</h2>
              <p className={s.sectionSub}>{t("home.worksSub")}</p>
            </div>
          </div>
        </Reveal>
        <div className={s.projectRows}>
          {featured.map((p, pi) => (
            <Reveal key={p.id} delay={pi * 0.08}>
              <div className={`${s.projectRow} ${pi % 2 === 1 ? s.projectRowFlip : ""}`}>
                <ProjectCard>
                  <article className={s.project}>
                    <div className={s.projectHead}>
                      <h3 className={s.projectTitle}>{p.title}</h3>
                      <span className={s.projectYear}>{p.year}</span>
                    </div>
                    <p className={s.projectDesc}>{p.description}</p>
                    <div className={s.tags}>
                      {p.tags.map((tag) => (
                        <span key={tag} className={s.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {p.url && (
                      <div className={s.projectLinks}>
                        {isExternal(p.url) ? (
                          <a href={p.url} target="_blank" rel="noreferrer" className={`${ui.btn} ${ui.btnPrimary} cursor-target`}>
                            {t("home.liveNow")}
                          </a>
                        ) : (
                          <Link href={p.url} className={`${ui.btn} ${ui.btnPrimary} cursor-target`}>
                            {t("home.open")}
                          </Link>
                        )}
                        {p.repo && (
                          <a href={p.repo} target="_blank" rel="noreferrer" className={`${ui.btn} cursor-target`}>
                            {t("home.code")}
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                </ProjectCard>

                <Tilt>
                  <PixelTransition
                    className={s.projectMedia}
                    aspectRatio="62%"
                    gridSize={20}
                    pixelColor="#c6ff3a"
                    animationStepDuration={0.4}
                    firstContent={
                      <div className={s.mediaFirst}>
                        <span className={s.mediaHint}>{t("home.hoverReveal")}</span>
                        <span className={s.mediaName}>{p.title}</span>
                      </div>
                    }
                    secondContent={
                      p.previewEffect ? (
                        <div className={s.mediaLive}>
                          <BackgroundSurface effectId={p.previewEffect} interactive={false} />
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.cover} alt={p.title} className={s.mediaImg} />
                      )
                    }
                  />
                </Tilt>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wrap section">
        <Reveal>
          <div className={s.ctaBand}>
            <h2 className={s.ctaTitle}>{t("home.ctaTitle")}</h2>
            <p className={s.ctaSub}>{t("home.ctaSub")}</p>
            <div className={s.ctaActions}>
              <Link href="/biblioteca" className={`${ui.btn} ${ui.btnPrimary} cursor-target`}>
                {t("home.ctaOpenLib")}
              </Link>
              <Link href="/sobre" className={`${ui.btn} cursor-target`}>
                {t("home.ctaAbout")}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </TargetCursor>
  );
}
