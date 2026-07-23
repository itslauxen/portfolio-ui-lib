"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/profile";
import { useI18n } from "@/i18n/I18nProvider";
import { LangToggle } from "@/components/LangToggle/LangToggle";
import styles from "./nav.module.css";

const LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/biblioteca", key: "nav.library" },
  { href: "/sobre", key: "nav.about" },
];

export function Nav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={profile.name}>
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.brandName}>gabriel_lauxen</span>
        </Link>

        <nav className={styles.links} aria-label="Navigation">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} cursor-target ${isActive(l.href) ? styles.active : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LangToggle />
          <a className={`${styles.cta} cursor-target`} href={`mailto:${profile.email}`}>
            [ {t("nav.contact")} ]
          </a>
        </div>
      </div>
    </header>
  );
}
