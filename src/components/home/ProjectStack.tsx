"use client";

import { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { Project } from "@/lib/types";
import { ProjectCase } from "./ProjectCase";
import s from "./projectStack.module.css";

interface Geo {
  top: number;
  h: number;
  /** quanto se rola com o projeto parado na tela antes de o próximo começar a subir */
  folga: number;
}

// Respiro: fração da altura da janela que cada projeto fica inteiro e parado. Sem isso, encaixar o
// projeto na tela já puxava o seguinte.
const FOLGA = 0.7;

/**
 * Os projetos em tela cheia, um por vez: cada mundo fica preso no topo enquanto o próximo sobe por
 * cima dele. Na passagem, o que sai encolhe, arredonda os cantos e escurece, como uma carta indo
 * para o fundo da pilha. É `position: sticky` com transformações ligadas à rolagem: a rolagem
 * continua sendo a do navegador, nada é sequestrado.
 * Em tela estreita ou baixa demais para a vitrine caber inteira, volta a ser uma lista comum.
 */
export function ProjectStack({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const geo = useRef<Geo>({ top: 0, h: 1, folga: 0 });
  const reduced = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1001px) and (min-height: 700px)");
    const medir = () => {
      let top = 0;
      for (let n: HTMLElement | null = ref.current; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop;
      geo.current = { top, h: window.innerHeight, folga: Math.round(window.innerHeight * FOLGA) };
      setPinned(mq.matches);
    };
    medir();
    window.addEventListener("resize", medir);
    mq.addEventListener("change", medir);
    // a altura do que vem antes muda depois da primeira pintura (fontes, imagens)
    const obs = new ResizeObserver(medir);
    obs.observe(document.body);
    return () => {
      window.removeEventListener("resize", medir);
      mq.removeEventListener("change", medir);
      obs.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={s.stack} data-pinned={pinned ? "" : undefined} style={{ "--folga": `${FOLGA * 100}svh` } as React.CSSProperties}>
      {items.map((p, i) => (
        <Slot key={p.id} index={i} geo={geo} scrollY={scrollY} recua={pinned && !reduced && i < items.length - 1}>
          <ProjectCase project={p} />
        </Slot>
      ))}
    </div>
  );
}

function Slot({ index, geo, scrollY, recua, children }: { index: number; geo: MutableRefObject<Geo>; scrollY: MotionValue<number>; recua: boolean; children: ReactNode }) {
  // 0 = este projeto está sozinho na tela; 1 = o próximo já o cobriu por inteiro
  // o próximo começa a subir depois da folga deste: cada projeto ocupa (janela + folga) de rolagem
  const coberto = useTransform(scrollY, (y) => {
    const { top, h, folga } = geo.current;
    return Math.min(1, Math.max(0, (y - (top + index * (h + folga) + folga)) / h));
  });
  const scale = useTransform(coberto, [0, 1], [1, 0.9]);
  // os cantos de cima já são arredondados (CSS); ao recuar, os de baixo também ficam
  const radius = useTransform(coberto, [0, 0.2], ["36px 36px 0px 0px", "36px 36px 36px 36px"]);
  const sombra = useTransform(coberto, [0, 1], [0, 0.62]);
  // já coberto por inteiro: some, para não aparecer por trás de quem tem fundo transparente
  const some = useTransform(coberto, [0.97, 1], [1, 0]);
  return (
    // alterna: um projeto em tela cheia, o seguinte como um painel com margem em volta
    <motion.div className={s.slot} data-inset={index % 2 ? "" : undefined} style={recua ? { scale, borderRadius: radius, opacity: some } : undefined}>
      {children}
      {recua && <motion.div className={s.dim} style={{ opacity: sombra }} aria-hidden="true" />}
    </motion.div>
  );
}
