"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function LibraryHeader() {
  const { t } = useI18n();
  return (
    <div className="page-head">
      <span className="eyebrow">{t("lib.eyebrow")}</span>
      <h1 className="page-title gradient-text">{t("lib.headerTitle")}</h1>
      <p className="page-lead">{t("lib.headerLead")}</p>
    </div>
  );
}
