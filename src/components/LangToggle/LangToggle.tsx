"use client";

import { useI18n } from "@/i18n/I18nProvider";
import styles from "./langToggle.module.css";

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button
      type="button"
      className={`${styles.toggle} cursor-target`}
      onClick={() => setLang(lang === "pt" ? "en" : "pt")}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para português"}
    >
      <span className={lang === "pt" ? styles.on : styles.off}>PT</span>
      <span className={styles.sep}>/</span>
      <span className={lang === "en" ? styles.on : styles.off}>EN</span>
    </button>
  );
}
