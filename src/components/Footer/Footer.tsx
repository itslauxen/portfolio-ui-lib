"use client";

import { profile } from "@/data/profile";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./footer.module.css";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div>
          <div className={styles.brand}>{profile.name}</div>
          <div className={styles.meta}>
            © {year} · {t("home.role")}
          </div>
        </div>
        <div className={styles.links}>
          {profile.socials.map((soc) => (
            <a key={soc.label} href={soc.url} target="_blank" rel="noreferrer">
              {soc.label}
            </a>
          ))}
          {profile.email && <a href={`mailto:${profile.email}`}>{t("nav.contact")}</a>}
        </div>
      </div>
    </footer>
  );
}
