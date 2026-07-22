"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BackgroundSurface } from "./BackgroundSurface";
import { BackgroundControls } from "./BackgroundControls";
import {
  BACKGROUND_CATALOG,
  LIB_SECTIONS,
  buildExportHTML,
  buildReactSnippet,
  defaultsOf,
  getEffectMeta,
  randomizeParams,
  sectionOf,
} from "@/lib/backgrounds";
import type { BgValues } from "@/lib/backgrounds/types";
import { Icon } from "@/components/ui/Icon";
import ui from "@/components/ui/ui.module.css";
import styles from "./studio.module.css";

interface Props {
  /** Efeito selecionado (vem da rota /backgrounds/[id]). */
  selectedId: string;
}

/**
 * Estúdio de fundos: barra lateral para escolher, um preview grande do fundo
 * selecionado e os sliders de parâmetros abaixo. Renderiza UM fundo por vez,
 * o que também mantém apenas um contexto WebGL vivo.
 *
 * O fundo selecionado vive na URL (/backgrounds/[id]), então recarregar a
 * página mantém a seleção e cada fundo tem seu próprio link.
 */
export function BackgroundStudio({ selectedId: routeId }: Props) {
  const pathname = usePathname();
  // A seleção vive em estado local para que trocar de fundo NÃO remonte o
  // estúdio (o que zeraria o scroll da barra lateral). A URL é atualizada com
  // a History API, então recarregar a página ainda mantém a seleção e cada
  // fundo continua tendo seu próprio link.
  const [selectedId, setSelectedId] = useState(routeId);
  const eff = getEffectMeta(selectedId);
  const [values, setValues] = useState<BgValues>(() => (eff ? defaultsOf(eff) : {}));
  const [term, setTerm] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // Sincroniza com a URL: voltar/avançar do navegador ou entrar por deep-link.
  useEffect(() => {
    const rid = pathname?.split("/").filter(Boolean).pop();
    if (rid && getEffectMeta(rid) && rid !== selectedId) setSelectedId(rid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Ao trocar de fundo, volta os parâmetros para o padrão dele.
  useEffect(() => {
    const m = getEffectMeta(selectedId);
    if (m) setValues(defaultsOf(m));
  }, [selectedId]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  // Fundos (canvas/react) exportam JSX/HTML; demos de componente copiam JSX.
  const isJsx = eff?.kind === "react" || eff?.kind === "component";
  const isCanvas = !eff?.kind || eff?.kind === "canvas";

  // Grupos fixos por seção da biblioteca, filtrados pela busca.
  const groups = useMemo(() => {
    const t = term.trim().toLowerCase();
    const match = (e: (typeof BACKGROUND_CATALOG)[number]) =>
      !t || `${e.name} ${e.cat} ${e.desc}`.toLowerCase().includes(t);
    return LIB_SECTIONS.map((sec) => ({
      ...sec,
      items: BACKGROUND_CATALOG.filter((e) => sectionOf(e) === sec.key && match(e)),
    })).filter((g) => g.items.length > 0);
  }, [term]);

  const total = useMemo(() => groups.reduce((sum, g) => sum + g.items.length, 0), [groups]);

  const select = (id: string) => {
    if (id === selectedId || !getEffectMeta(id)) return;
    setSelectedId(id);
    // Atualiza a URL sem navegar (sem remontar), preservando o scroll da lista.
    window.history.pushState(null, "", `/biblioteca/${id}`);
  };

  const change = (key: string, v: number | string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const doRandomize = () => {
    if (!eff) return;
    setValues(randomizeParams(eff));
    showToast("Parâmetros aleatorizados");
  };
  const doReset = () => {
    if (!eff) return;
    setValues(defaultsOf(eff));
    showToast("Padrão restaurado");
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
    showToast("HTML exportado");
  };
  const doCopy = async () => {
    const code = isJsx ? buildReactSnippet(selectedId, values) : buildExportHTML(selectedId, values);
    try {
      await navigator.clipboard.writeText(code);
      showToast(isJsx ? "Componente copiado" : "Código copiado");
    } catch {
      showToast("Não foi possível copiar");
    }
  };

  return (
    <div className={styles.studio}>
      {/* -------- SIDEBAR -------- */}
      <aside className={styles.sidebar}>
        <div className={styles.sideHead}>
          <label className={ui.searchbox}>
            <Icon name="search" size={15} />
            <input
              className={ui.searchInput}
              type="text"
              placeholder="Buscar fundo..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </label>
          <span className={styles.count}>{total} itens</span>
        </div>

        <div className={styles.list}>
          {groups.map((g) => (
            <div key={g.key} className={styles.group}>
              <div className={styles.groupLabel}>{g.label}</div>
              {g.items.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={`${styles.item} ${e.id === selectedId ? styles.itemActive : ""}`}
                  onClick={() => select(e.id)}
                  aria-current={e.id === selectedId ? "true" : undefined}
                >
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>{e.name}</span>
                    <span className={styles.itemCat}>
                      {e.kind === "component"
                        ? "Componente"
                        : e.kind === "react"
                          ? "Shader WebGL"
                          : e.gl
                            ? "Shader"
                            : "Canvas"}
                    </span>
                  </span>
                  {e.heavy && <span className={styles.gpu}>GPU</span>}
                </button>
              ))}
            </div>
          ))}
          {groups.length === 0 && <p className={styles.empty}>Nenhum item encontrado.</p>}
        </div>
      </aside>

      {/* -------- MAIN -------- */}
      {eff && (
        <section className={styles.main}>
          <div className={styles.stage}>
            <BackgroundSurface effectId={selectedId} params={values} interactive />
            <div className={styles.stageTop}>
              <div className={styles.stageTitle}>
                {eff.name}
                <small>
                  {eff.cat} · {eff.params.length} parâmetros
                </small>
              </div>
              <div className={styles.stageActions}>
                <button type="button" className={ui.iconBtn} onClick={doRandomize} title="Aleatorizar" aria-label="Aleatorizar">
                  <Icon name="shuffle" size={16} />
                </button>
                <button type="button" className={ui.iconBtn} onClick={doReset} title="Resetar" aria-label="Resetar">
                  <Icon name="reset" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Parâmetros</span>
              <div className={styles.panelActions}>
                <button type="button" className={ui.btn} onClick={doCopy}>
                  <Icon name="copy" size={15} /> {isJsx ? "Copiar componente" : "Copiar código"}
                </button>
                {isCanvas && (
                  <button type="button" className={ui.btnPrimary} onClick={doExport}>
                    <Icon name="download" size={15} /> Exportar
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
