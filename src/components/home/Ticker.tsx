"use client";

// Faixa marquee brutalist reta: itens em loop infinito entre linhas de 1px.
// Puro CSS (2 linhas idênticas p/ loop); pausa no hover; itens traduzíveis.
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./ticker.module.css";

export function Ticker() {
  const { t } = useI18n();

  const ITEMS = [
    t("ticker.fullstack"),
    "node + express",
    "react",
    "docker",
    "sequelize + sql",
    "three.js + webgl",
    "shaders glsl",
    "gsap",
    "react three fiber",
    "framer motion",
    "canvas 2d",
    t("ticker.backgrounds"),
    "postgresql",
    t("ticker.aiAgents"),
  ];

  const row = ITEMS.map((label, i) => (
    <span key={i} className={styles.item}>
      {label}
      <span className={styles.sep} aria-hidden="true">
        ///
      </span>
    </span>
  ));

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.row}>{row}</div>
        <div className={styles.row}>{row}</div>
      </div>
    </div>
  );
}
