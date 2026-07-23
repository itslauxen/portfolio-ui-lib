"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { messages, type Lang } from "./dict";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<Ctx>({ lang: "pt", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    let initial: Lang = "pt";
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "pt" || saved === "en") {
        initial = saved;
      } else if (typeof navigator !== "undefined" && !navigator.language.toLowerCase().startsWith("pt")) {
        initial = "en";
      }
    } catch {
      /* ignore */
    }
    setLangState(initial);
    document.documentElement.lang = initial === "pt" ? "pt-BR" : "en";
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  };

  const t = (key: string) => messages[key]?.[lang] ?? key;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
