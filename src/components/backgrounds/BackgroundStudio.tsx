"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BackgroundSurface } from "./BackgroundSurface";
import { BackgroundControls } from "./BackgroundControls";
import {
  BACKGROUND_CATALOG,
  LIB_SECTIONS,
  previewParamsOf,
  buildExportHTML,
  buildReactSnippet,
  componentNameOf,
  defaultsOf,
  getEffectMeta,
  randomizeParams,
  sectionOf,
} from "@/lib/backgrounds";
import type { BgValues } from "@/lib/backgrounds/types";
import { CATALOG_EN, CAT_EN } from "@/lib/backgrounds/catalog-en";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import { StudioSkeleton } from "@/components/ui/StudioSkeleton/StudioSkeleton";
import ui from "@/components/ui/ui.module.css";
import styles from "./studio.module.css";

interface Props {
  /** ausente = a grade com todos os itens */
  selectedId?: string;
}

const SEC_KEY: Record<string, string> = {
  backgrounds: "lib.secBackgrounds",
  componentes: "lib.secComponentes",
  animacoes: "lib.secAnimacoes",
  texto: "lib.secTexto",
  loaders: "lib.secLoaders",
};

type Tipo = (typeof LIB_SECTIONS)[number]["key"] | "all";
// versão das fotos da grade: aumente ao regerar (scripts/gen-lab-thumbs.mjs) para o navegador não
// mostrar as antigas do cache
const THUMBS_V = 3;

// ícones das abas de filtro (traço fino, 20px)
const ic = (d: React.ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const TIPO_ICON: Record<Tipo, React.ReactNode> = {
  all: ic(<><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></>),
  backgrounds: ic(<><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="M21 15.5l-4.6-4.6a1.5 1.5 0 0 0-2.1 0L5.5 19.7" /></>),
  componentes: ic(<path d="M14.5 4.8a2 2 0 1 0-4 0c0 .6.2 1 .2 1.4 0 .5-.4.8-.9.8H6.5A1.5 1.5 0 0 0 5 8.5v2.800c0 .5.300.9.800.9.400 0 .8-.2 1.400-.2a2 2 0 1 1 0 4c-.6 0-1-.2-1.400-.2-.5 0-.8.4-.8.9V18.5A1.500 1.500 0 0 0 6.500 20h3.300c.5 0 .9-.3.9-.8 0-.4-.2-.8-.2-1.400a2 2 0 1 1 4 0c0 .6-.2 1-.2 1.400 0 .5.4.8.9.8h3.300a1.500 1.500 0 0 0 1.500-1.500V8.500A1.500 1.500 0 0 0 18.500 7h-3.300c-.5 0-.9-.3-.9-.8 0-.4.2-.8.2-1.400Z" />),
  animacoes: ic(<><path d="M9.500 9.500l9 3.400-3.900 1.700-1.700 3.900-3.400-9Z" /><path d="M4 4l2.200 2.200M9.500 2.500v3M2.500 9.500h3M4.300 14.700l2-2M14.700 4.300l-2 2" /></>),
  texto: ic(<><path d="M3.500 18L8.200 6h.6l4.700 12M5.200 14h6.600" /><path d="M20.500 18v-5.200a2.500 2.500 0 0 0-4.700-1.200M20.500 15.200a2.700 2.700 0 1 1-2.700-2.400c1.200 0 2.200.4 2.700 1.200" /></>),
  loaders: ic(<><path d="M12 3v3.500M12 17.500V21M3 12h3.500M17.500 12H21" /><path d="M5.600 5.600l2.500 2.500M15.900 15.900l2.500 2.500M5.600 18.400l2.500-2.500M15.900 8.100l2.500-2.500" opacity=".55" /></>),
};

export function BackgroundStudio({ selectedId: routeId = "" }: Props) {
  const pathname = usePathname();
  const { t, lang } = useI18n();
  const en = lang === "en";
  // Nome/categoria traduzidos em runtime (os catálogos-fonte são pt-BR).
  const locName = (e: { id: string; name: string }) =>
    en ? CATALOG_EN[e.id]?.name ?? e.name : e.name;
  const locCat = (c: string) => (en ? CAT_EN[c] ?? c : c);
  const [selectedId, setSelectedId] = useState(routeId);
  const eff = getEffectMeta(selectedId);
  const [values, setValues] = useState<BgValues>(() => (eff ? defaultsOf(eff) : {}));
  const [term, setTerm] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  // Enquanto o cliente não montou (bundle + WebGL pesados), mostra o loader —
  // reserva altura pra o footer não subir e cobre a demora em produção.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const rid = pathname?.split("/").filter(Boolean).pop();
    if (rid && getEffectMeta(rid)) { if (rid !== selectedId) setSelectedId(rid); }
    // /biblioteca sem item: a grade com todos
    else if (selectedId) setSelectedId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const m = getEffectMeta(selectedId);
    if (m) setValues(defaultsOf(m));
  }, [selectedId]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  const isJsx = eff?.kind === "react" || eff?.kind === "component";
  const isCanvas = !eff?.kind || eff?.kind === "canvas";

  // filtro por tipo (as seções da biblioteca), nos chips embaixo da busca
  const [tipo, setTipo] = useState<Tipo>("all");
  // prévia flutuante do item sob o mouse na lista (um efeito por vez: cabe até os que usam WebGL)
  const [espia, setEspia] = useState<{ id: string; x: number; y: number } | null>(null);
  const espiaTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(espiaTimer.current), []);
  const espiado = espia ? getEffectMeta(espia.id) : undefined;
  // cartão da grade com o efeito rodando (o que está sob o mouse)
  const [vivo, setVivo] = useState<string | null>(null);
  const vivoTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(vivoTimer.current), []);
  const groups = useMemo(() => {
    const q = term.trim().toLowerCase();
    // busca casa PT e EN, independentemente do idioma ativo
    const match = (e: (typeof BACKGROUND_CATALOG)[number]) =>
      !q ||
      `${e.name} ${e.cat} ${e.desc} ${CATALOG_EN[e.id]?.name ?? ""} ${CATALOG_EN[e.id]?.desc ?? ""} ${CAT_EN[e.cat] ?? ""}`
        .toLowerCase()
        .includes(q);
    return LIB_SECTIONS.filter((sec) => tipo === "all" || sec.key === tipo).map((sec) => ({
      ...sec,
      items: BACKGROUND_CATALOG.filter((e) => sectionOf(e) === sec.key && match(e)),
    })).filter((g) => g.items.length > 0);
  }, [term, tipo]);

  const total = useMemo(() => groups.reduce((sum, g) => sum + g.items.length, 0), [groups]);

  const select = (id: string) => {
    // "" = a grade com todos os itens
    if (id === selectedId || (id && !getEffectMeta(id))) return;
    setSelectedId(id);
    window.history.pushState(null, "", id ? `/biblioteca/${id}` : "/biblioteca");
  };

  const change = (key: string, v: number | string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const doRandomize = () => {
    if (!eff) return;
    setValues(randomizeParams(eff));
    showToast(t("lib.tRandom"));
  };
  const doReset = () => {
    if (!eff) return;
    setValues(defaultsOf(eff));
    showToast(t("lib.tReset"));
  };
  const doExport = () => {
    if (!isCanvas) return;
    const html = buildExportHTML(selectedId, values);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedId}.html`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1500);
    showToast(t("lib.tExport"));
  };
  const doCopy = async () => {
    // Componentes React (shaders/demos): copia o Uso + o CÓDIGO-FONTE do
    // componente (buscado de /component-src), pra pessoa ter o arquivo inteiro.
    if (isJsx) {
      const usage = buildReactSnippet(selectedId, values);
      const name = componentNameOf(selectedId);
      let payload = usage;
      if (name) {
        try {
          const res = await fetch(`/component-src/${name}.txt`);
          if (res.ok) {
            const src = await res.text();
            payload =
              `/* ${name} — uso (com os parâmetros atuais) */\n${usage}\n\n` +
              `/* ============================================================\n` +
              `   ${name} — código-fonte do componente\n` +
              `   Cole em src/components/${name}/${name}.tsx (CSS module ao final)\n` +
              `   ============================================================ */\n${src}`;
          }
        } catch {
          /* sem a fonte, copia só o uso */
        }
      }
      try {
        await navigator.clipboard.writeText(payload);
        showToast(t("lib.tCopiedComp"));
      } catch {
        showToast(t("lib.tCopyFail"));
      }
      return;
    }
    // Fundos de canvas (motor): copia o HTML independente.
    try {
      await navigator.clipboard.writeText(buildExportHTML(selectedId, values));
      showToast(t("lib.tCopiedCode"));
    } catch {
      showToast(t("lib.tCopyFail"));
    }
  };

  if (!mounted) return <StudioSkeleton grid={!selectedId} />;

  return (
    <div className={styles.studio}>
      <aside className={styles.sidebar}>
        <div className={styles.sideHead}>
          {/* o que está na tela: clicar volta para a grade com todos os itens */}
          <button type="button" className={styles.viewing} onClick={() => select("")} aria-current={!selectedId ? "page" : undefined}>
            {TIPO_ICON[tipo]}
            <span>{tipo === "all" ? t("lib.viewingAll") : t(SEC_KEY[tipo] ?? tipo)}</span>
          </button>
          {/* filtro por tipo, em abas de ícone */}
          <div className={styles.tabs} role="group" aria-label={t("lib.filterType")}>
            {(["all", ...LIB_SECTIONS.map((x) => x.key)] as Tipo[]).map((k) => (
              <button key={k} type="button" className={styles.tabIcon} aria-pressed={tipo === k} onClick={() => setTipo(k)}
                aria-label={k === "all" ? t("lib.filterAll") : t(SEC_KEY[k] ?? k)} title={k === "all" ? t("lib.filterAll") : t(SEC_KEY[k] ?? k)}>
                {/* o fundo do ativo é um só e desliza de uma aba para a outra */}
                {tipo === k && (
                  <motion.span layoutId="lab-tab-on" className={styles.tabOn} transition={{ type: "spring", stiffness: 520, damping: 40 }} />
                )}
                <span className={styles.tabGlyph}>{TIPO_ICON[k]}</span>
              </button>
            ))}
          </div>
          <label className={styles.search}>
            <Icon name="search" size={15} />
            <input type="text" placeholder={t("lib.filterN").replace("{n}", String(total))} value={term} onChange={(e) => setTerm(e.target.value)} />
          </label>
        </div>

        <div className={styles.list}>
          {groups.map((g) => (
            <div key={g.key} className={styles.group}>
              <div className={styles.groupLabel}>{t(SEC_KEY[g.key] ?? g.key)}</div>
              {g.items.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={`${styles.item} ${e.id === selectedId ? styles.itemActive : ""}`}
                  onClick={() => { setEspia(null); select(e.id); }}
                  // passar o mouse num item mostra o efeito rodando num cartão ao lado, sem sair do atual
                  onPointerEnter={(ev) => {
                    if (ev.pointerType !== "mouse" || e.id === selectedId) return;
                    const r = ev.currentTarget.getBoundingClientRect();
                    window.clearTimeout(espiaTimer.current);
                    espiaTimer.current = window.setTimeout(() => setEspia({ id: e.id, x: r.right + 14, y: r.top + r.height / 2 }), 140);
                  }}
                  onPointerLeave={() => { window.clearTimeout(espiaTimer.current); setEspia(null); }}
                  aria-current={e.id === selectedId ? "true" : undefined}
                >
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>{locName(e)}</span>
                    <span className={styles.itemCat}>
                      {e.kind === "component"
                        ? t("lib.typeComponent")
                        : e.kind === "react"
                          ? t("lib.typeShaderWebgl")
                          : e.gl
                            ? t("lib.typeShader")
                            : t("lib.typeCanvas")}
                    </span>
                  </span>
                  {e.heavy && <span className={styles.gpu} title="GPU">GPU</span>}
                </button>
              ))}
            </div>
          ))}
          {groups.length === 0 && <p className={styles.empty}>{t("lib.emptyFull")}</p>}
        </div>
      </aside>

      {espia && espiado && (
        <div className={styles.peek} aria-hidden="true"
          style={{ left: espia.x, top: Math.min(Math.max(espia.y - 120, 76), window.innerHeight - 256) }}>
          {/* componentes são desenhados no dobro do tamanho e reduzidos à metade: cabem inteiros */}
          <div className={espiado.kind === "component" ? styles.peekHalf : styles.peekStage}>
            <BackgroundSurface key={espia.id} effectId={espia.id} params={previewParamsOf(espiado)} interactive={false} />
          </div>
          <span className={styles.peekName}>{locName(espiado)}</span>
        </div>
      )}

      {!selectedId && (
        <section className={styles.main}>
          {/* a grade: uma foto de cada item (geradas por scripts/gen-lab-thumbs.mjs); clicar abre o
              item no estúdio, com os parâmetros e o código */}
          <ul className={styles.grid}>
            {groups.flatMap((g) => g.items).map((e) => (
              <li key={e.id}>
                <button type="button" className={styles.card} onClick={() => { setVivo(null); setEspia(null); select(e.id); }}
                  // o mouse em cima do cartão põe o efeito de verdade para rodar sobre a foto (um por vez)
                  onPointerEnter={(ev) => {
                    if (ev.pointerType !== "mouse") return;
                    window.clearTimeout(vivoTimer.current);
                    vivoTimer.current = window.setTimeout(() => setVivo(e.id), 110);
                  }}
                  onPointerLeave={() => { window.clearTimeout(vivoTimer.current); setVivo(null); }}>
                  <span className={styles.shot}>
                    {vivo === e.id && (
                      <span className={e.kind === "component" ? styles.liveHalf : styles.live}>
                        <BackgroundSurface effectId={e.id} params={previewParamsOf(e)} interactive={false} />
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/lab-thumbs/${e.id}.webp?v=${THUMBS_V}`} alt="" loading="lazy" width={640} height={400}
                      onError={(ev) => { ev.currentTarget.style.visibility = "hidden"; }} />
                  </span>
                  <span className={styles.cardMeta}>
                    <span className={styles.cardName}>{locName(e)}</span>
                    <span className={styles.cardCat}>{locCat(e.cat)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {groups.length === 0 && <p className={styles.empty}>{t("lib.emptyFull")}</p>}
        </section>
      )}

      {eff && (
        <section className={styles.main}>
          <div className={styles.stage}>
            {/* key troca o nó a cada componente: o novo entra num fade suave */}
            <div key={selectedId} className={styles.stageFade}>
              <BackgroundSurface effectId={selectedId} params={values} interactive />
            </div>
            <div className={styles.stageTop}>
              <div className={styles.stageTitle}>
                {locName(eff)}
                <small>
                  {locCat(eff.cat)} · {eff.params.length} {t("lib.paramsCount")}
                </small>
              </div>
              <div className={styles.stageActions}>
                <button
                  type="button"
                  className={ui.iconBtn}
                  onClick={doRandomize}
                  title={t("lib.randomize")}
                  aria-label={t("lib.randomize")}
                >
                  <Icon name="shuffle" size={16} />
                </button>
                <button
                  type="button"
                  className={ui.iconBtn}
                  onClick={doReset}
                  title={t("lib.reset")}
                  aria-label={t("lib.reset")}
                >
                  <Icon name="reset" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>{t("lib.params")}</span>
              <div className={styles.panelActions}>
                <button type="button" className={ui.btn} onClick={doCopy}>
                  <Icon name="copy" size={15} /> {isJsx ? t("lib.copyComponent") : t("lib.copyCode")}
                </button>
                {isCanvas && (
                  <button type="button" className={ui.btnPrimary} onClick={doExport}>
                    <Icon name="download" size={15} /> {t("lib.export")}
                  </button>
                )}
              </div>
            </div>
            <BackgroundControls eff={eff} values={values} onChange={change} layout="grid" />
          </div>
        </section>
      )}

      <div className={`${styles.toast} ${toast ? styles.toastShow : ""}`}>{toast}</div>
    </div>
  );
}
