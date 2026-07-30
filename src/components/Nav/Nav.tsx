"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Fecha o menu ao trocar de rota.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Trava o scroll do fundo enquanto o menu está aberto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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

        <div className={styles.actions}>
          <LangToggle />
          <a className={`${styles.cta} cursor-target`} href={`mailto:${profile.email}`}>
            [ {t("nav.contact")} ]
          </a>
        </div>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.mobileLinks} aria-label="Navigation">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.mobileLink} ${isActive(l.href) ? styles.mobileLinkActive : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              <span className={styles.mobileLinkIdx}>0{i + 1}</span>
              {t(l.key)}
            </Link>
          ))}
        </nav>
        <div className={styles.mobileFoot}>
          <LangToggle />
          <a className={styles.cta} href={`mailto:${profile.email}`}>
            [ {t("nav.contact")} ]
          </a>
        </div>
      </div>
    </header>
  );
}
