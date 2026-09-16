"use client";

import { usePathname } from "next/navigation";
import { profile } from "@/data/profile";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./footer.module.css";

export function Footer() {
  const { t } = useI18n();
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // O estúdio da biblioteca é um layout de app (ocupa a viewport inteira,
  // sidebar fixa): sem footer lá, senão a página ganha scroll extra.
  if (pathname?.startsWith("/biblioteca")) return null;

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <span>
          © {year} {profile.name}
        </span>
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
