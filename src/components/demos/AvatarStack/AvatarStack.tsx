"use client";

// Pilha de avatares para filtrar por pessoa. Fechada: os primeiros avatares sobrepostos e um "+N"
// (com um ponto quando há selecionados escondidos). Aberta: uma faixa que rola de lado, com setas,
// esmaecer nas bordas, arrasto com o mouse, rodinha e botão de recolher. Ao recolher, os selecionados
// que estavam escondidos vêm para a frente.
//
// Só React e CSS, sem biblioteca de UI. Abrir e fechar é o MESMO elemento mudando de largura (não há
// troca entre duas árvores), e nada é posicionado com número mágico: por isso a animação não sai do
// lugar quando o resto da página muda de estilo.
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./AvatarStack.module.css";

export interface StackUser {
  id: string | number;
  name: string;
  /** Foto. Sem ela, mostra as iniciais sobre uma cor derivada do nome. */
  src?: string;
}

interface AvatarStackProps {
  users?: StackUser[];
  /** Ids selecionados (controlado). Sem isto o componente guarda a seleção sozinho. */
  selected?: (string | number)[];
  onToggle?: (user: StackUser) => void;
  /** Chamado pelo botão de limpar a seleção (obrigatório se `selected` for controlado). */
  onClear?: () => void;
  /** Quantos avatares aparecem com a pilha fechada. */
  max?: number;
  /** Quantos cabem na faixa aberta antes de rolar. */
  visible?: number;
  /** Diâmetro do avatar, em px. */
  size?: number;
  /** Cor de destaque (selecionado, "+N"). */
  color?: string;
  /** Reserva desde já a largura da pilha aberta. Use quando ela está centralizada (ou alinhada à
   *  direita): sem isso o conjunto se recentra ao abrir e o botão sai de baixo do mouse. */
  reserve?: boolean;
  /** Cor do fundo onde a pilha está: é a cor do contorno que separa os avatares. */
  surface?: string;
  className?: string;
}

const NOMES = ["Ana Lima", "Bruno Reis", "Carla Dias", "Diego Sá", "Elisa Mota", "Fábio Luz", "Gabi Nunes", "Hugo Paz", "Íris Rocha", "João Vaz", "Kátia Melo", "Leo Brito", "Mari Costa", "Nando Cruz", "Olga Pires", "Pedro Maia"];
const PADRAO: StackUser[] = NOMES.map((name, i) => ({ id: i + 1, name }));

const OVERLAP = 8; // quanto cada avatar entra sobre o vizinho
const BORDA = 2;
const FADE = 28; // esmaecer das bordas da faixa
const SETA = 24; // faixa da seta esquerda: ali os avatares já sumiram por completo
const PASSO = 140; // quanto as setas rolam
const LIMIAR = 4; // px até um clique virar arrasto

const iniciais = (n: string) => n.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const matiz = (n: string) => [...n].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

const AvatarStack = ({ users = PADRAO, selected, onToggle, onClear, max = 5, visible = 8, size = 34, color = "#3ce97f", surface = "#101311", reserve = false, className = "" }: AvatarStackProps) => {
  const [aberta, setAberta] = useState(false);
  const [interna, setInterna] = useState<(string | number)[]>([2, 9]);
  const sel = selected ?? interna;
  const [frente, setFrente] = useState<(string | number)[]>([]); // quem veio para a frente ao recolher
  const [esq, setEsq] = useState(false);
  const [dir, setDir] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const faixa = useRef<HTMLDivElement>(null);
  const arrasto = useRef({ ativo: false, x: 0, rolagem: 0, moveu: false });

  const ordenados = useMemo(() => {
    if (!frente.length) return users;
    const pos = new Map(frente.map((id, i) => [id, i]));
    return [...users].sort((a, b) => (pos.get(a.id) ?? 1e6) - (pos.get(b.id) ?? 1e6));
  }, [users, frente]);

  const passo = size + BORDA * 2 - OVERLAP; // de um avatar ao seguinte
  const larguraDe = (n: number) => size + BORDA * 2 + (n - 1) * passo;
  const mostrados = Math.min(max, users.length);
  const resto = users.length - mostrados;
  const largura = aberta ? Math.min(larguraDe(users.length), larguraDe(visible) + FADE) : larguraDe(mostrados);
  // tudo o que a pilha ocupa quando aberta: limpar + faixa + seta direita + recolher
  const larguraAberta = 36 + Math.min(larguraDe(users.length), larguraDe(visible) + FADE) + (resto > 0 ? 60 : 0);
  const escondidosMarcados = ordenados.slice(mostrados).filter((u) => sel.includes(u.id)).length;

  const medir = useCallback(() => {
    const el = faixa.current;
    if (!el) return;
    setEsq(el.scrollLeft > 1);
    setDir(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);
  // mede no fim da transição de largura também (o que cabe muda enquanto abre)
  useEffect(() => {
    if (!aberta) return;
    const t = window.setTimeout(medir, 300);
    window.addEventListener("resize", medir);
    return () => { window.clearTimeout(t); window.removeEventListener("resize", medir); };
  }, [aberta, medir, users.length]);

  const recolher = () => {
    const el = faixa.current;
    if (el) el.scrollTo({ left: 0, behavior: "smooth" });
    // os selecionados que estavam escondidos vêm para a frente
    const sobem = ordenados.filter((u, i) => i >= mostrados && sel.includes(u.id)).map((u) => u.id);
    if (sobem.length) setFrente((f) => [...sobem, ...f.filter((id) => !sobem.includes(id))]);
    setEsq(false);
    setDir(false);
    setAberta(false);
  };

  const alternar = (u: StackUser) => {
    if (onToggle) onToggle(u);
    if (!selected) setInterna((s) => (s.includes(u.id) ? s.filter((x) => x !== u.id) : [...s, u.id]));
  };

  // arrastar com o mouse rola a faixa (só aberta)
  useEffect(() => {
    if (!aberta) return;
    const mover = (e: MouseEvent) => {
      const a = arrasto.current, el = faixa.current;
      if (!a.ativo || !el) return;
      const d = e.pageX - a.x;
      if (Math.abs(d) > LIMIAR) a.moveu = true;
      el.scrollLeft = a.rolagem - d;
    };
    const soltar = () => { if (arrasto.current.ativo) { arrasto.current.ativo = false; setArrastando(false); } };
    window.addEventListener("mousemove", mover);
    window.addEventListener("mouseup", soltar);
    return () => { window.removeEventListener("mousemove", mover); window.removeEventListener("mouseup", soltar); };
  }, [aberta]);

  // a rodinha (vertical) rola a faixa de lado; listener não passivo para segurar a página
  useEffect(() => {
    const el = faixa.current;
    if (!aberta || !el) return;
    const roda = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!d) return;
      el.scrollLeft += d;
      e.preventDefault();
    };
    el.addEventListener("wheel", roda, { passive: false });
    return () => el.removeEventListener("wheel", roda);
  }, [aberta]);

  const avatar = (u: StackUser, i: number, fora: boolean) => (
    <button key={u.id} type="button" className={styles.avatar} title={u.name} aria-label={u.name} aria-pressed={sel.includes(u.id)}
      tabIndex={fora ? -1 : 0} data-out={fora || undefined} style={{ zIndex: users.length - i, "--h": matiz(u.name) } as CSSProperties} onClick={() => alternar(u)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {u.src ? <img src={u.src} alt="" draggable={false} /> : iniciais(u.name)}
    </button>
  );

  const mascara = aberta && (esq || dir)
    ? `linear-gradient(to right, ${esq ? `transparent 0, transparent ${SETA}px, #000 ${SETA + FADE}px` : "#000 0"}, ${dir ? `#000 calc(100% - ${FADE}px), transparent 100%` : "#000 100%"})`
    : "none";

  return (
    <div className={`${styles.root} ${className}`} data-open={aberta || undefined}
      style={{ "--s": `${size}px`, "--c": color, "--bg": surface, "--o": `${OVERLAP}px`, minWidth: reserve ? larguraAberta : undefined } as CSSProperties}>
      {/* limpar a seleção: só existe enquanto há alguém selecionado; fica à esquerda da pilha, com o lugar
          sempre reservado */}
      <button type="button" className={`${styles.arrow} ${styles.clear}`} data-show={sel.length > 0 || undefined} tabIndex={sel.length ? 0 : -1}
        title="Limpar seleção" aria-label="Limpar seleção"
        onClick={() => { onClear?.(); if (!selected) setInterna([]); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.500" /><path d="M9.200 9.200l5.600 5.600M14.800 9.200l-5.600 5.600" /></svg>
      </button>
      <div className={styles.window}>
        <button type="button" className={`${styles.arrow} ${styles.left}`} data-show={(aberta && esq) || undefined} tabIndex={aberta && esq ? 0 : -1}
          aria-label="Rolar para a esquerda" onClick={() => faixa.current?.scrollBy({ left: -PASSO, behavior: "smooth" })}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.500 6l-6 6 6 6" /></svg>
        </button>
        <div ref={faixa} className={styles.strip} data-drag={arrastando || undefined}
          style={{ width: largura, maskImage: mascara, WebkitMaskImage: mascara }}
          onScroll={medir}
          onMouseDown={(e) => {
            if (!aberta || !faixa.current) return;
            e.preventDefault();
            arrasto.current = { ativo: true, x: e.pageX, rolagem: faixa.current.scrollLeft, moveu: false };
            setArrastando(true);
          }}
          // um arrasto não pode virar clique no avatar que estava embaixo do mouse
          onClickCapture={(e) => { if (arrasto.current.moveu) { e.preventDefault(); e.stopPropagation(); arrasto.current.moveu = false; } }}>
          <div className={styles.row}>
            {ordenados.map((u, i) => avatar(u, i, !aberta && i >= mostrados))}
          </div>
        </div>
      </div>

      {resto > 0 && (
        <button type="button" className={styles.more} data-dot={escondidosMarcados > 0 || undefined} tabIndex={aberta ? -1 : 0}
          title={escondidosMarcados ? `Ver todos · ${escondidosMarcados} selecionado${escondidosMarcados > 1 ? "s" : ""} escondido${escondidosMarcados > 1 ? "s" : ""}` : "Ver todos"}
          aria-label="Ver todos" aria-expanded={aberta} onClick={() => setAberta(true)}>
          +{resto}
        </button>
      )}
      <button type="button" className={`${styles.arrow} ${styles.right}`} data-show={(aberta && dir) || undefined} tabIndex={aberta && dir ? 0 : -1}
        aria-label="Rolar para a direita" onClick={() => faixa.current?.scrollBy({ left: PASSO, behavior: "smooth" })}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.500 6l6 6-6 6" /></svg>
      </button>
      <button type="button" className={`${styles.arrow} ${styles.close}`} tabIndex={aberta ? 0 : -1} title="Recolher" aria-label="Recolher" onClick={recolher}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.500 8l4 4-4 4M19.500 8l-4 4 4 4" /></svg>
      </button>
    </div>
  );
};

export default AvatarStack;
