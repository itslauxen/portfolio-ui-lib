"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";

// Atualiza o título da aba conforme rota + idioma (o metadata do servidor é
// estático e não reage ao toggle de idioma no cliente).
export function RouteTitle() {
  const pathname = usePathname();
  const { t, lang } = useI18n();

  useEffect(() => {
    let key = "meta.home";
    if (pathname.startsWith("/sobre")) key = "meta.about";
    else if (pathname.startsWith("/biblioteca")) key = "meta.library";
    else if (pathname.startsWith("/artigos")) key = "meta.articles";
    document.title = t(key);
  }, [pathname, lang, t]);

  return null;
}
