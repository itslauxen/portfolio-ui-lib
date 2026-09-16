"use client";

// Modal de contato: pergunta se a pessoa prefere e-mail ou WhatsApp.
// E-mail abre o mailto normal; WhatsApp abre wa.me com o número do perfil.
import { useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./contactModal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: Props) {
  const { t } = useI18n();
  const firstRef = useRef<HTMLAnchorElement>(null);

  // Esc fecha; foco vai pra primeira opção ao abrir.
  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={t("contact.title")}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>{t("contact.title")}</h2>
        <div className={styles.options}>
          <a
            ref={firstRef}
            className={styles.option}
            href={`mailto:${profile.email}`}
            onClick={onClose}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="m3.5 7 8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.optionName}>E-mail</span>
            <span className={styles.optionHint}>{t("contact.emailHint")}</span>
          </a>
          <a
            className={styles.option}
            href={`https://wa.me/${profile.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9 8.6c-.3 0-.7.1-.9.6-.3.6-.5 1.9.6 3.5 1 1.6 2.6 2.8 4.4 3.3 1 .3 1.8 0 2.2-.6.3-.4.3-.9.2-1.1l-1.6-.8c-.2-.1-.4 0-.6.2l-.4.5c-.1.2-.3.2-.5.1a6 6 0 0 1-2.6-2.3c-.1-.2-.1-.4.1-.5l.4-.4c.2-.2.2-.4.1-.6L9.6 9c-.1-.3-.3-.4-.6-.4Z"
                fill="currentColor"
              />
            </svg>
            <span className={styles.optionName}>WhatsApp</span>
            <span className={styles.optionHint}>{t("contact.whatsHint")}</span>
          </a>
        </div>
        <button type="button" className={styles.close} onClick={onClose}>
          {t("contact.close")}
        </button>
      </div>
    </div>
  );
}
