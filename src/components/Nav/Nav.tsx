"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { profile } from "@/data/profile";
import { useI18n } from "@/i18n/I18nProvider";
import { LangToggle } from "@/components/LangToggle/LangToggle";
import { ContactModal } from "@/components/ContactModal/ContactModal";
import styles from "./nav.module.css";

const LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/#projetos", key: "nav.projects" },
  { href: "/sobre", key: "nav.about" },
  { href: "/biblioteca", key: "nav.library" },
];

// Desfoque progressivo sob o header (design 2a): quatro camadas de
// backdrop-filter, cada uma com máscara mais curta — o blur acumula perto
// da barra e some gradualmente ~150px abaixo dela.
const BLUR_LAYERS: CSSProperties[] = [
  { blur: 2, solid: 55, fade: 90 },
  { blur: 5, solid: 40, fade: 70 },
  { blur: 10, solid: 28, fade: 52 },
  { blur: 18, solid: 18, fade: 38 },
].map(({ blur, solid, fade }) => {
  const mask = `linear-gradient(to bottom, black 0%, black ${solid}%, transparent ${fade}%)`;
  return {
    maskImage: mask,
    WebkitMaskImage: mask,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  };
});

export function Nav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // O desfoque gradual só liga depois que a página começa a rolar (no topo
  // do hero ele não é necessário e escurecia/borrava a primeira dobra).
  useEffect(() => {
    // gatilho imediato (2px): o desfoque acompanha o primeiro movimento de
    // rolagem, estilo YouTube, em vez de esperar a página andar
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname.startsWith(href);
  // O estúdio da biblioteca é layout de app (nada rola por baixo do header):
  // lá o desfoque fica confinado à barra, pra não cortar a sidebar.
  const isApp = pathname?.startsWith("/biblioteca") ?? false;

  // Navegação na própria home: rolagem suave manual. Usamos offsetTop
  // acumulado (posição de LAYOUT, imune aos transforms da animação de
  // entrada do painel) — scrollIntoView media a posição transformada e
  // fazia o alvo "descer de soco" depois.
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduced ? ("auto" as const) : ("smooth" as const);
    // "Início" na própria home: rola suave até o topo (sem teleporte).
    if (href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior });
      window.history.pushState(null, "", "/");
      setOpen(false);
      return;
    }
    if (!href.includes("#")) return;
    const el = document.getElementById(href.split("#")[1]);
    if (!el) return;
    e.preventDefault();
    let top = 0;
    let node: HTMLElement | null = el;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop || "0") || 0;
    window.scrollTo({ top: top - margin, behavior });
    window.history.pushState(null, "", `#${href.split("#")[1]}`);
    setOpen(false);
  };

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
    <header className={styles.header} data-app={isApp || undefined}>
      <div
        className={`${styles.blurZone} ${scrolled ? styles.blurZoneOn : ""}`}
        aria-hidden="true"
      >
        {BLUR_LAYERS.map((style, i) => (
          <span key={i} className={styles.band} style={style} />
        ))}
        <span className={styles.scrim} />
      </div>

      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={profile.name}>
          {profile.name}
        </Link>

        <nav className={styles.links} aria-label="Navigation">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${isActive(l.href) ? styles.active : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
              onClick={(e) => handleAnchor(e, l.href)}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <LangToggle />
          <button type="button" className={styles.cta} onClick={() => setContactOpen(true)}>
            {t("nav.contact")}
          </button>
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
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.mobileLink} ${isActive(l.href) ? styles.mobileLinkActive : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
              onClick={(e) => {
                handleAnchor(e, l.href);
                setOpen(false);
              }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
        <div className={styles.mobileFoot}>
          <LangToggle />
          <button
            type="button"
            className={styles.cta}
            onClick={() => {
              setOpen(false);
              setContactOpen(true);
            }}
          >
            {t("nav.contact")}
          </button>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
}
