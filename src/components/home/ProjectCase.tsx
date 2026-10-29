"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BackgroundSurface } from "@/components/backgrounds/BackgroundSurface";
import { useI18n } from "@/i18n/I18nProvider";
import type { Localized, Project, ProjectShot } from "@/lib/types";
import s from "./projectCase.module.css";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Vitrine de um projeto na home: cabeçalho (título, descrição, tags, links)
// e as telas reais — grupos por versão (Web / iOS…) com uma galeria de uma
// tela grande por vez ou uma fileira de celulares.
export function ProjectCase({ project }: { project: Project }) {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const L = (o: Localized) => (lang === "en" ? o.en : o.pt);
  const groups = project.media ?? [];
  const [gi, setGi] = useState(0);
  const [si, setSi] = useState(0);
  const group = groups[Math.min(gi, groups.length - 1)];
  const desc = lang === "en" && project.descriptionEn ? project.descriptionEn : project.description;
  const external = (url: string) => /^https?:\/\//.test(url);

  const pickGroup = (i: number) => {
    setGi(i);
    setSi(0);
  };

  // Efeitos WebGL e vídeos só rodam enquanto a vitrine está perto da tela:
  // fora dela o shader é desmontado e o vídeo pausado (CPU/GPU e bateria).
  const rootRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: "600px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={rootRef} className={s.case} id={`project-${project.id}`} data-case="">
      <header className={s.head}>
        <div className={s.headText}>
          <h3 className={s.title}>
            {project.title}
            <span className={s.year}>{project.year}</span>
          </h3>
          <p className={s.desc}>{desc}</p>
        </div>
        <div className={s.headSide}>
          <ul className={s.tags} aria-label="Stack">
            {project.tags.map((tag) => (
              <li key={tag} className={s.tag}>
                {tag}
              </li>
            ))}
          </ul>
          <div className={s.links}>
            {project.url ? (
              external(project.url) ? (
                <a href={project.url} target="_blank" rel="noreferrer" className={s.btn}>
                  {t("proj.visit")}
                </a>
              ) : (
                <Link href={project.url} className={s.btn}>
                  {t("proj.open")}
                </Link>
              )
            ) : (
              !project.repo && <span className={s.note}>{t("proj.private")}</span>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className={s.btnQuiet}>
                {t("proj.code")}
                <svg className={s.ghMark} width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </header>

      {groups.length > 1 && (
        <div className={s.groupSwitch} role="tablist" aria-label={project.title}>
          {groups.map((g, i) => (
            <button
              key={L(g.label)}
              type="button"
              role="tab"
              aria-selected={i === gi}
              className={`${s.groupBtn} ${i === gi ? s.groupBtnOn : ""}`}
              onClick={() => pickGroup(i)}
            >
              {L(g.label)}
            </button>
          ))}
        </div>
      )}

      {group &&
        (group.layout === "phones" ? (
          // fileira de celulares: troca de grupo com um fade curto
          <motion.ul
            key={gi}
            className={s.phones}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {group.shots.map((shot) => (
              <li key={shot.src} className={s.phone}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shot.src} alt={L(shot.alt)} loading="lazy" className={s.phoneImg} />
                <span className={s.phoneLabel}>{L(shot.label)}</span>
              </li>
            ))}
          </motion.ul>
        ) : (
          <div className={s.gallery}>
            <div className={s.stage}>
              <motion.div
                key={`${gi}-${si}`}
                className={s.stageInner}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Shot shot={group.shots[Math.min(si, group.shots.length - 1)]} alt={L} active={near} />
              </motion.div>
            </div>
            <div className={s.tabs} role="tablist" aria-label={L(group.label)}>
              {group.shots.map((shot, i) => (
                <button
                  key={L(shot.label)}
                  type="button"
                  role="tab"
                  aria-selected={i === si}
                  className={`${s.tab} ${i === si ? s.tabOn : ""}`}
                  onClick={() => setSi(i)}
                >
                  {L(shot.label)}
                </button>
              ))}
            </div>
          </div>
        ))}
    </article>
  );
}

function Shot({
  shot,
  alt,
  active,
}: {
  shot: ProjectShot;
  alt: (o: Localized) => string;
  /** false = vitrine fora da tela: vídeo pausado, shader desmontado */
  active: boolean;
}) {
  switch (shot.kind) {
    case "video":
      return <LoopVideo shot={shot} label={alt(shot.alt)} active={active} />;
    case "live":
      // efeito real da biblioteca, com o mouse ligado: a demo é a própria coisa
      return <div className={s.live}>{active && <BackgroundSurface effectId={shot.effect!} />}</div>;
    case "panel":
      // recorte com transparência (painel do notch): centrado numa superfície
      return (
        <div className={s.panelStage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot.src} alt={alt(shot.alt)} loading="lazy" className={s.panelImg} />
        </div>
      );
    default:
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={shot.src} alt={alt(shot.alt)} loading="lazy" className={s.media} />;
  }
}

// Loop mudo sem controles (como demo de produto): toca só com a vitrine
// visível. `preload="metadata"` evita baixar os mp4 de tudo na primeira dobra.
function LoopVideo({ shot, label, active }: { shot: ProjectShot; label: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);
  return (
    <video
      ref={ref}
      className={s.media}
      src={shot.src}
      poster={shot.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
