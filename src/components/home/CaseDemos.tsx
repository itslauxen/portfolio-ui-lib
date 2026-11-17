"use client";

import { useEffect, useRef, useState } from "react";
import s from "./caseDemos.module.css";

type Txt = (o: { pt: string; en: string }) => string;

/* ---------- Gym App: concluir uma série e ver o descanso contar ---------- */
const SERIES = [
  { kg: 11, reps: 12 },
  { kg: 12, reps: 10 },
  { kg: 12, reps: 9 },
];
const DESCANSO = 45;

export function GymDemo({ L }: { L: Txt }) {
  const [feitas, setFeitas] = useState(0);
  const [resta, setResta] = useState(0);
  useEffect(() => {
    if (resta <= 0) return;
    const t = window.setTimeout(() => setResta((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resta]);
  const fim = feitas === SERIES.length;
  const concluir = (i: number) => {
    if (i !== feitas) return;
    setFeitas(i + 1);
    setResta(i + 1 < SERIES.length ? DESCANSO : 0);
  };
  const mmss = `${Math.floor(resta / 60)}:${String(resta % 60).padStart(2, "0")}`;
  return (
    <div className={s.gym}>
      <p className={s.gymKicker}>{L({ pt: "Treino B", en: "Workout B" })}</p>
      <p className={s.gymName}>{L({ pt: "Supino inclinado", en: "Incline press" })}</p>
      <ul className={s.gymSets}>
        {SERIES.map((x, i) => (
          <li key={i} data-done={i < feitas || undefined} data-next={i === feitas || undefined}>
            <span>
              {x.kg} kg <i>×</i> {x.reps}
            </span>
            <button type="button" onClick={() => concluir(i)} disabled={i !== feitas}
              aria-label={L({ pt: `Concluir a série ${i + 1}`, en: `Complete set ${i + 1}` })}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className={s.gymFoot} aria-live="polite">
        {resta > 0 ? (
          <>
            <span className={s.gymTimer}>{mmss}</span>
            <span className={s.gymBar}><span style={{ width: `${(resta / DESCANSO) * 100}%` }} /></span>
            <button type="button" className={s.gymSkip} onClick={() => setResta(0)}>{L({ pt: "Pular descanso", en: "Skip rest" })}</button>
          </>
        ) : fim ? (
          <>
            <span className={s.gymDone}>{L({ pt: "Exercício concluído", en: "Exercise done" })}</span>
            <button type="button" className={s.gymSkip} onClick={() => setFeitas(0)}>{L({ pt: "Refazer", en: "Again" })}</button>
          </>
        ) : (
          <span className={s.gymHint}>{L({ pt: "Toque no ✓ para concluir a série", en: "Tap ✓ to complete the set" })}</span>
        )}
      </div>
    </div>
  );
}

/* ---------- Nova Notes: digitar uma nota e vê-la formatada ---------- */
const NOTA_PT = "# Ideias para o portfólio\n- hero com o efeito no título\n- um mundo por projeto\n[ ] publicar\n\nEscreva aqui: # vira título, - vira lista, [ ] vira tarefa.";
const NOTA_EN = "# Portfolio ideas\n- hero with the effect in the title\n- one world per project\n[ ] ship it\n\nType here: # becomes a title, - a list, [ ] a task.";

export function NotesDemo({ L, en }: { L: Txt; en: boolean }) {
  const [texto, setTexto] = useState(en ? NOTA_EN : NOTA_PT);
  const [feitas, setFeitas] = useState<Record<number, boolean>>({});
  const mexeu = useRef(false);
  // troca de idioma: troca a nota de exemplo, a não ser que a pessoa já tenha escrito
  useEffect(() => {
    if (!mexeu.current) setTexto(en ? NOTA_EN : NOTA_PT);
  }, [en]);
  const linhas = texto.split("\n");
  return (
    <div className={s.notes}>
      <label className={s.notesEdit}>
        <span>{L({ pt: "Escreva", en: "Write" })}</span>
        <textarea value={texto} spellCheck={false}
          onChange={(e) => { mexeu.current = true; setTexto(e.target.value); }} />
      </label>
      <div className={s.notesView} aria-live="polite">
        <span>{L({ pt: "Nota", en: "Note" })}</span>
        <div>
          {linhas.map((l, i) => {
            if (l.startsWith("# ")) return <h4 key={i}>{l.slice(2)}</h4>;
            if (l.startsWith("- ")) return <p key={i} className={s.notesItem}>{l.slice(2)}</p>;
            const tarefa = /^\[( |x)?\] ?(.*)$/.exec(l);
            if (tarefa) {
              const ok = feitas[i] ?? tarefa[1] === "x";
              return (
                <button key={i} type="button" className={s.notesTask} data-done={ok || undefined}
                  onClick={() => setFeitas((f) => ({ ...f, [i]: !ok }))}>
                  <i aria-hidden="true" />
                  {tarefa[2]}
                </button>
              );
            }
            return l.trim() ? <p key={i}>{l}</p> : <br key={i} />;
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- myNotch: o notch de verdade, sobre o papel de parede ---------- */
// Os recortes reais de cada aba do painel (tamanho nativo), na ordem dos ícones do app. `xs` é o
// centro de cada ícone de aba e `gear` o da engrenagem, em px do recorte; todos a 32 px do topo.
const ABAS = [
  { src: "/projects/mynotch/player.webp", w: 1040, h: 420 },
  { src: "/projects/mynotch/prints.webp", w: 1040, h: 420 },
  { src: "/projects/mynotch/notas.webp", w: 1040, h: 480 },
  { src: "/projects/mynotch/nova.webp", w: 1440, h: 860, xs: [250, 330, 410, 490], gear: 1190 },
  { src: "/projects/mynotch/ajustes.webp", w: 1040, h: 840 },
];
const XS = [49, 131, 212, 290];
const GEAR = 989;
const ICONE_Y = 32;
const ALVO = 68; // lado da área sensível de cada ícone
const NOMES = [
  { pt: "Player", en: "Player" },
  { pt: "Bandeja", en: "Shelf" },
  { pt: "Nota rápida", en: "Quick note" },
  { pt: "Nova Notes", en: "Nova Notes" },
  { pt: "Ajustes", en: "Settings" },
];

/**
 * O notch funcionando no lugar do vídeo: fechado no topo do "papel de parede", abre ao passar o mouse
 * e, como no app, passar o mouse num ícone troca de aba (o painel muda de tamanho junto).
 * `tab` e `open` vêm de fora para a lista ao lado também poder abrir uma aba.
 */
export function NotchStage({ L, tab, onTab, open, onOpen }: { L: Txt; tab: number; onTab: (i: number) => void; open: boolean; onOpen: (v: boolean) => void }) {
  const a = ABAS[Math.min(tab, ABAS.length - 1)];
  const centros = [...(a.xs ?? XS), a.gear ?? GEAR];
  return (
    <div className={s.nStage}>
      <div className={s.nNotch} data-open={open || undefined}
        style={{ "--w": a.w, "--h": a.h } as React.CSSProperties}
        onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && onOpen(false)}
        onClick={() => !open && onOpen(true)}>
        {ABAS.map((x, i) => (
          // cada recorte fica no próprio tamanho, centrado no topo: o painel só revela, não estica
          // eslint-disable-next-line @next/next/no-img-element
          <img key={x.src} src={x.src} alt="" data-on={i === tab || undefined} loading="lazy" style={{ "--iw": x.w } as React.CSSProperties} />
        ))}
        {open &&
          centros.map((cx, i) => (
            <button key={i} type="button" className={s.nIcone} aria-label={L(NOMES[i])} aria-pressed={i === tab}
              // medido a partir do centro do painel, na escala fixa: os ícones ficam no mesmo lugar em
              // todas as abas (o painel cresce para os lados e para baixo, a fileira não anda)
              style={{ "--dx": cx - a.w / 2 - ALVO / 2, "--dy": ICONE_Y - ALVO / 2, "--lado": ALVO } as React.CSSProperties}
              onPointerEnter={() => onTab(i)} onFocus={() => onTab(i)} onClick={() => onTab(i)} />
          ))}
      </div>
      <span className={s.nHint} data-hide={open || undefined}>{L({ pt: "passe o mouse no notch", en: "hover the notch" })}</span>
    </div>
  );
}
