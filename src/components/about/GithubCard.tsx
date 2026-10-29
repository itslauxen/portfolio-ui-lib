"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { profile } from "@/data/profile";
import s from "./githubCard.module.css";

// Card do perfil no GitHub (Sobre, ao lado da bio): avatar, @, bio, empresa e
// local, seguidores (vindos da API pública, com valores fixos de reserva) e
// os repositórios em destaque. Tudo que é texto fica no dicionário (PT/EN).
const LOGIN = "itslauxen";
const URL = `https://github.com/${LOGIN}`;
const FALLBACK = { followers: 3, following: 3, company: "DKW System", location: "BR" };
// repositórios em destaque: nome e stack mostrada
const REPOS = [
  { name: "nova-notes", stack: "React" },
  { name: "myNotch", stack: "Swift" },
  { name: "gym-app", stack: "React · SwiftUI" },
] as const;

function GithubMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function GithubCard() {
  const { t } = useI18n();
  const [stats, setStats] = useState(FALLBACK);
  const cardRef = useRef<HTMLAnchorElement>(null);

  // hover: o brilho segue o cursor (posição em CSS vars, sem re-render)
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // seguidores/empresa ao vivo; sem rede (ou com rate limit) ficam os valores fixos
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${LOGIN}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) return;
        setStats({
          followers: typeof u.followers === "number" ? u.followers : FALLBACK.followers,
          following: typeof u.following === "number" ? u.following : FALLBACK.following,
          company: u.company ? String(u.company).replace(/^@/, "") : FALLBACK.company,
          location: u.location || FALLBACK.location,
        });
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  return (
    // o card inteiro é o link pro perfil (sem botão)
    <a
      ref={cardRef}
      href={URL}
      target="_blank"
      rel="noreferrer"
      className={s.card}
      aria-label={t("gh.cta")}
      onPointerMove={onMove}
    >
      <span className={s.spot} aria-hidden="true" />
      {/* coluna 1: perfil */}
      <div className={s.colA}>
      <div className={s.head}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/gabriel-avatar.webp" alt="" width={200} height={200} className={s.avatar} />
        <div className={s.who}>
          <div className={s.name}>{profile.name}</div>
          <div className={s.login}>@{LOGIN}</div>
        </div>
        <span className={s.mark}>
          <GithubMark />
        </span>
      </div>
      <p className={s.bio}>{t("gh.bio")}</p>
      <div className={s.meta}>
        <span className={s.metaItem}>
          <span className={s.dot} aria-hidden="true" />
          {stats.company} · {stats.location}
        </span>
        <span className={s.metaItem}>
          <strong>{stats.followers}</strong> {t("gh.followers")} · <strong>{stats.following}</strong>{" "}
          {t("gh.following")}
        </span>
      </div>
      </div>
      {/* coluna 2: repositórios */}
      <div className={s.colB}>
      <div className={s.featured}>{t("gh.featured")}</div>
      <ul className={s.repos}>
        {REPOS.map((r) => (
          <li key={r.name} className={s.repo}>
            <span className={s.repoName}>{r.name}</span>
            <span className={s.repoStack}>{r.stack}</span>
          </li>
        ))}
      </ul>
      </div>
    </a>
  );
}
