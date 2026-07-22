"use client";

import type { BackgroundEffect, BgValues } from "@/lib/backgrounds/types";
import styles from "./controls.module.css";

function decimals(step: number): number {
  const s = String(step).split(".")[1];
  return s ? s.length : 0;
}
function fmt(v: number | string | boolean, step = 1): string {
  return typeof v === "number" ? v.toFixed(decimals(step)) : String(v);
}

interface Props {
  eff: BackgroundEffect;
  values: BgValues;
  onChange: (key: string, value: number | string | boolean) => void;
  /** "grid" espalha os controles em colunas (estilo painel "Customize"). */
  layout?: "list" | "grid";
}

/** Painel de parâmetros ao vivo (range, cor, seleção, switch). */
export function BackgroundControls({ eff, values, onChange, layout = "list" }: Props) {
  return (
    <div className={`${styles.body} ${layout === "grid" ? styles.bodyGrid : ""}`.trim()}>
      {eff.params.map((p) => {
        if (p.type === "range") {
          return (
            <div key={p.key} className={styles.ctrl}>
              <div className={styles.lab}>
                <span>{p.label}</span>
                <span className={styles.val}>{fmt(values[p.key], p.step)}</span>
              </div>
              <input
                type="range"
                className={styles.range}
                min={p.min}
                max={p.max}
                step={p.step}
                value={Number(values[p.key])}
                onChange={(e) => onChange(p.key, parseFloat(e.target.value))}
              />
            </div>
          );
        }
        if (p.type === "color") {
          return (
            <div key={p.key} className={`${styles.ctrl} ${styles.ctrlRow}`}>
              <span className={styles.labText}>{p.label}</span>
              <div className={styles.swatch}>
                <input
                  type="color"
                  className={styles.color}
                  value={String(values[p.key])}
                  onChange={(e) => onChange(p.key, e.target.value)}
                />
                <span className={styles.hex}>{String(values[p.key])}</span>
              </div>
            </div>
          );
        }
        if (p.type === "select") {
          return (
            <div key={p.key} className={styles.ctrl}>
              <div className={styles.lab}>
                <span>{p.label}</span>
              </div>
              <select
                className={styles.select}
                value={String(values[p.key])}
                onChange={(e) => onChange(p.key, e.target.value)}
              >
                {(p.options ?? []).map((o) => (
                  <option key={o[0]} value={o[0]}>
                    {o[1]}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        // bool
        return (
          <div key={p.key} className={`${styles.ctrl} ${styles.ctrlRow}`}>
            <span className={styles.labText}>{p.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(values[p.key])}
              aria-label={p.label}
              className={`${styles.switch} ${values[p.key] ? styles.switchOn : ""}`}
              onClick={() => onChange(p.key, !values[p.key])}
            >
              <span className={styles.knob} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
