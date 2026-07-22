"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

interface Props {
  /** Texto (ou função que retorna o texto) a copiar. */
  text: string | (() => string);
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({ text, label = "Copiar", copiedLabel = "Copiado", className }: Props) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    const value = typeof text === "function" ? text() : text;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard indisponível */
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.copyBtn} ${copied ? styles.copied : ""} ${className ?? ""}`}
    >
      <Icon name={copied ? "check" : "copy"} size={13} />
      {copied ? copiedLabel : label}
    </button>
  );
}
