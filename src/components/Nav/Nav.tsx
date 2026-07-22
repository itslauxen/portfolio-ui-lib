"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/profile";
import styles from "./nav.module.css";

const LINKS = [
  { href: "/", label: "início" },
  { href: "/biblioteca", label: "biblioteca" },
  { href: "/sobre", label: "sobre" },
];

export function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${profile.name}, início`}>
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.brandName}>gabriel_lauxen</span>
        </Link>

        <nav className={styles.links} aria-label="Navegação principal">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} cursor-target ${isActive(l.href) ? styles.active : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a className={`${styles.cta} cursor-target`} href={`mailto:${profile.email}`}>
          [ contato ]
        </a>
      </div>
    </header>
  );
}
