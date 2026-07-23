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
import { useI18n } from "@/i18n/I18nProvider";
import ui from "@/components/ui/ui.module.css";
import styles from "./studio.module.css";

interface Props {
  selectedId: string;
}

const SEC_KEY: Record<string, string> = {
  backgrounds: "lib.secBackgrounds",
  componentes: "lib.secComponentes",
  animacoes: "lib.secAnimacoes",
  texto: "lib.secTexto",
};

export function BackgroundStudio({ selectedId: routeId }: Props) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState(routeId);
  const eff = getEffectMeta(selectedId);
  const [values, setValues] = useState<BgValues>(() => (eff ? defaultsOf(eff) : {}));
  const [term, setTerm] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const rid = pathname?.split("/").filter(Boolean).pop();
    if (rid && getEffectMeta(rid) && rid !== selectedId) setSelectedId(rid);
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

  const groups = useMemo(() => {
    const q = term.trim().toLowerCase();
    const match = (e: (typeof BACKGROUND_CATALOG)[number]) =>
      !q || `${e.name} ${e.cat} ${e.desc}`.toLowerCase().includes(q);
    return LIB_SECTIONS.map((sec) => ({
      ...sec,
      items: BACKGROUND_CATALOG.filter((e) => sectionOf(e) === sec.key && match(e)),
    })).filter((g) => g.items.length > 0);
  }, [term]);

  const total = useMemo(() => groups.reduce((sum, g) => sum + g.items.length, 0), [groups]);

  const select = (id: string) => {
    if (id === selectedId || !getEffectMeta(id)) return;
    setSelectedId(id);
    window.history.pushState(null, "", `/biblioteca/${id}`);
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
    const code = isJsx ? buildReactSnippet(selectedId, values) : buildExportHTML(selectedId, values);
    try {
      await navigator.clipboard.writeText(code);
      showToast(isJsx ? t("lib.tCopiedComp") : t("lib.tCopiedCode"));
    } catch {
      showToast(t("lib.tCopyFail"));
    }
  };

  return (
    <div className={styles.studio}>
      <aside className={styles.sidebar}>
        <div className={styles.sideHead}>
          <label className={ui.searchbox}>
            <Icon name="search" size={15} />
            <input
              className={ui.searchInput}
              type="text"
              placeholder={t("lib.searchBg")}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </label>
          <span className={styles.count}>
            {total} {t("lib.items")}
          </span>
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
                  onClick={() => select(e.id)}
                  aria-current={e.id === selectedId ? "true" : undefined}
                >
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>{e.name}</span>
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
                  {e.heavy && <span className={styles.gpu}>GPU</span>}
                </button>
              ))}
            </div>
          ))}
          {groups.length === 0 && <p className={styles.empty}>{t("lib.emptyFull")}</p>}
        </div>
      </aside>

      {eff && (
        <section className={styles.main}>
          <div className={styles.stage}>
            <BackgroundSurface effectId={selectedId} params={values} interactive />
            <div className={styles.stageTop}>
              <div className={styles.stageTitle}>
                {eff.name}
                <small>
                  {eff.cat} · {eff.params.length} {t("lib.paramsCount")}
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
