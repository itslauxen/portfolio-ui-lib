"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import s from "./servicesShowcase.module.css";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// "O que eu construo" (design 1b do canvas Explorações): lista à esquerda e,
// à direita, uma micro-interface por serviço mostrando o RESULTADO — agente
// respondendo com tool call, site com notas altas, fluxo de automação e
// modelo de dados. Mostra em vez de dizer. No celular (2b): pílulas roláveis
// no topo, demo em 4:5 logo abaixo, barrinhas de posição e a descrição.
const SERVICES = [
  { t: "home.srv1t", d: "home.srv1d", short: "srv.short1", tags: ["Function calling", "RAG", "MCP"] },
  { t: "home.srv2t", d: "home.srv2d", short: "srv.short2", tags: ["Next.js", "SEO", "Motion"] },
  { t: "home.srv3t", d: "home.srv3d", short: "srv.short3", tags: ["APIs", "Webhooks", "Bots"] },
  { t: "home.srv4t", d: "home.srv4d", short: "srv.short4", tags: ["Node", "SQL", "Docker"] },
] as const;

const SCORES = [
  { v: 100, k: "srv.scoreSeo", ks: "srv.scoreSeoS" },
  { v: 98, k: "srv.scorePerf", ks: "srv.scorePerfS" },
  { v: 100, k: "srv.scoreA11y", ks: "srv.scoreA11yS" },
  { v: 100, k: "srv.scoreBest", ks: "srv.scoreBestS" },
] as const;

// nós do fluxo de automação (desktop): kind, label, posição
const FLOW_NODES = [
  { kind: "srv.flowTrigger", label: "srv.flowOrder", x: "8%", y: "24%" },
  { kind: "srv.flowWebhook", label: "srv.flowForm", x: "8%", y: "64%" },
  { kind: "srv.flowApi", label: "srv.flowSheet", x: "auto", y: "24%", right: "6%" },
  { kind: "srv.flowBot", label: "srv.flowWhats", x: "auto", y: "64%", right: "6%" },
] as const;
// passos do log de execução (celular)
const FLOW_STEPS = [
  { kind: "webhook", title: "srv.stepWebhook", time: "0,2s", done: true },
  { kind: "bot", title: "srv.stepBot", time: "0,6s", done: true },
  { kind: "api", title: "srv.stepApi", time: "0,9s", done: true },
  { kind: "whatsapp", title: "srv.stepWhats", time: "…", done: false },
] as const;

const TABLES = [
  { name: "srv.tblCustomers", x: "8%", y: "16%", end: false, cols: [["id", "uuid"], ["nome", "text"], ["marca_id", "fk"]] },
  { name: "srv.tblMessages", x: "8%", y: "56%", end: true, cols: [["id", "uuid"], ["canal", "enum"], ["cliente_id", "fk"]] },
  { name: "srv.tblTickets", x: "58%", y: "38%", end: false, cols: [["id", "uuid"], ["status", "enum"], ["agente", "text"], ["criado_em", "ts"]] },
] as const;

const RING_C = 2 * Math.PI * 25; // circunferência do anel SVG (r=25)

function useMobile(query = "(max-width: 960px)") {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return mobile;
}

export function ServicesShowcase() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const mobile = useMobile();
  const [active, setActive] = useState(0);
  const cur = SERVICES[active];

  const demo = (
    <motion.div
      key={`${active}-${mobile ? "m" : "d"}`}
      className={s.demo}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {active === 0 && <AgentDemo t={t} />}
      {active === 1 && (mobile ? <SiteDemoMobile t={t} /> : <SiteDemo t={t} />)}
      {active === 2 && (mobile ? <FlowDemoMobile t={t} /> : <FlowDemo t={t} />)}
      {active === 3 && (mobile ? <SchemaDemoMobile t={t} /> : <SchemaDemo t={t} />)}
    </motion.div>
  );

  if (mobile) {
    return (
      <div className={s.mobile}>
        <h2 className={s.title}>{t("home.servicesTitle")}</h2>
        <div className={s.chipRow} role="tablist" aria-label={t("home.servicesTitle")}>
          {SERVICES.map((sv, i) => (
            <button
              key={sv.t}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`${s.chip} ${i === active ? s.chipOn : ""}`}
              onClick={() => setActive(i)}
            >
              {t(sv.short)}
            </button>
          ))}
        </div>
        <div className={`${s.stage} ${s.stageMobile}`} aria-live="polite">
          <div className={s.dots} aria-hidden="true" />
          {demo}
        </div>
        <div className={s.bars} aria-hidden="true">
          {SERVICES.map((sv, i) => (
            <span key={sv.t} className={`${s.bar} ${i === active ? s.barOn : ""}`} />
          ))}
        </div>
        <div className={s.curText}>
          <span className={s.curLabel}>{cur.tags.join(" · ")}</span>
          <h3 className={s.curTitle}>{t(cur.t)}</h3>
          <p className={s.curDesc}>{t(cur.d)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.grid}>
      <div>
        <h2 className={s.title}>{t("home.servicesTitle")}</h2>
        <div className={s.list} role="tablist" aria-label={t("home.servicesTitle")}>
          {SERVICES.map((sv, i) => {
            const on = i === active;
            return (
              <button
                key={sv.t}
                type="button"
                role="tab"
                aria-selected={on}
                className={`${s.item} ${on ? s.itemOn : ""}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={s.itemLabel}>{sv.tags.join(" · ")}</span>
                <span className={s.itemTitle}>{t(sv.t)}</span>
                {on && <span className={s.itemDesc}>{t(sv.d)}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.stage} aria-live="polite">
        <div className={s.dots} aria-hidden="true" />
        {demo}
      </div>
    </div>
  );
}

type T = (key: string) => string;

/* ---- 1 · agente (igual no desktop e no celular) ---- */
function AgentDemo({ t }: { t: T }) {
  return (
    <div className={s.chat}>
      <div className={s.bubbleUser}>{t("srv.chatQ")}</div>
      <div className={s.toolPill}>
        <span className={s.toolDot} aria-hidden="true" />
        {t("srv.chatTool")}
      </div>
      <div className={s.bubbleBot}>{t("srv.chatA")}</div>
      <div className={s.chips}>
        <span className={s.chipOnSoft}>{t("srv.chatYes")}</span>
        <span className={s.chipOff}>{t("srv.chatNo")}</span>
      </div>
    </div>
  );
}

/* ---- 2 · site ---- */
function BrowserBar({ t }: { t: T }) {
  return (
    <div className={s.browserBar}>
      <span />
      <span />
      <span />
      <span className={s.browserUrl}>{t("srv.siteUrl")}</span>
    </div>
  );
}
function Skeleton() {
  return (
    <div className={s.skeleton} aria-hidden="true">
      <span className={s.skAccent} />
      <span className={s.skTitle} />
      <span className={s.skTitleShort} />
      <span className={s.skText} />
      <span className={s.skTextShort} />
      <span className={s.skBtn} />
    </div>
  );
}
function SiteDemo({ t }: { t: T }) {
  return (
    <div className={s.browser}>
      <BrowserBar t={t} />
      <div className={s.browserBody}>
        <Skeleton />
        <ul className={s.scores}>
          {SCORES.map((sc) => (
            <li key={sc.k} className={s.score}>
              <span
                className={s.ring}
                style={{ "--deg": `${sc.v * 3.6}deg` } as React.CSSProperties}
                aria-hidden="true"
              />
              <span className={s.scoreValue}>{sc.v}</span>
              <span className={s.scoreLabel}>{t(sc.k)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
// celular: coluna única, anéis em SVG numa fileira de 4 com rótulos curtos
function SiteDemoMobile({ t }: { t: T }) {
  return (
    <div className={s.browser}>
      <BrowserBar t={t} />
      <div className={s.browserBodyM}>
        <Skeleton />
        <ul className={s.scoresM}>
          {SCORES.map((sc) => {
            const f = sc.v >= 100 ? RING_C : (sc.v / 100) * RING_C;
            return (
              <li key={sc.k} className={s.scoreM}>
                <span className={s.ringM}>
                  <svg viewBox="0 0 60 60" aria-hidden="true">
                    <circle cx="30" cy="30" r="25" className={s.ringTrack} />
                    <circle cx="30" cy="30" r="25" className={s.ringArc} strokeDasharray={`${f.toFixed(2)} ${RING_C.toFixed(2)}`} />
                  </svg>
                  <span className={s.ringValue}>{sc.v}</span>
                </span>
                <span className={s.scoreLabelM}>{t(sc.ks)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---- 3 · automação ---- */
function FlowDemo({ t }: { t: T }) {
  return (
    <div className={s.flow}>
      <svg viewBox="0 0 500 400" className={s.flowSvg} aria-hidden="true">
        <path d="M120 120 C 200 120, 200 200, 250 200" style={{ animationDuration: "1s" }} />
        <path d="M120 280 C 200 280, 200 200, 250 200" style={{ animationDuration: "1.3s" }} />
        <path d="M330 200 C 380 200, 380 120, 410 120" style={{ animationDuration: "1.1s" }} />
        <path d="M330 200 C 380 200, 380 280, 410 280" style={{ animationDuration: "0.9s" }} />
      </svg>
      {FLOW_NODES.map((n) => (
        <div key={n.label} className={s.node} style={{ left: n.x, top: n.y, right: "right" in n ? n.right : undefined }}>
          <span className={s.nodeKind}>{t(n.kind)}</span>
          <span className={s.nodeLabel}>{t(n.label)}</span>
        </div>
      ))}
      <div className={`${s.node} ${s.nodeMain}`}>
        <span className={s.nodeKind}>{t("srv.flowBot")}</span>
        <span className={s.nodeLabel}>{t("srv.flowProcess")}</span>
      </div>
    </div>
  );
}
// celular: log de uma execução — passos numa linha vertical, o último rodando
function FlowDemoMobile({ t }: { t: T }) {
  return (
    <div className={s.run}>
      <div className={s.runHead}>
        <div>
          <div className={s.runTitle}>{t("srv.runTitle")}</div>
          <div className={s.runMeta}>{t("srv.runMeta")}</div>
        </div>
        <span className={s.runPill}>
          <span className={s.toolDot} aria-hidden="true" />
          {t("srv.running")}
        </span>
      </div>
      <div className={s.runSteps}>
        <span className={s.runLine} aria-hidden="true" />
        {FLOW_STEPS.map((st) => (
          <div key={st.kind} className={s.runStep}>
            <span className={`${s.runDot} ${st.done ? s.runDotDone : s.runDotLive}`}>{st.done ? "✓" : ""}</span>
            <div className={s.runStepText}>
              <span className={s.runKind}>{st.kind}</span>
              <span className={`${s.runStepTitle} ${st.done ? "" : s.runStepTitleLive}`}>{t(st.title)}</span>
            </div>
            <span className={`${s.runTime} ${st.done ? "" : s.runTimeLive}`}>{st.time}</span>
          </div>
        ))}
      </div>
      <div className={s.runFoot}>
        <span>
          {t("srv.before")} <strong>{t("srv.beforeV")}</strong>
        </span>
        <span>
          {t("srv.after")} <strong className={s.runAfter}>{t("srv.afterV")}</strong>
        </span>
      </div>
    </div>
  );
}

/* ---- 4 · fullstack (modelo de dados) ---- */
function Table({ t, tb, className }: { t: T; tb: (typeof TABLES)[number]; className?: string }) {
  return (
    <div className={`${s.table} ${className ?? ""}`} style={className ? undefined : { left: tb.x, top: tb.y }}>
      <div className={s.tableName}>{t(tb.name)}</div>
      {tb.cols.map(([n, ty]) => (
        <div key={n} className={s.tableRow}>
          <span>{n}</span>
          <span className={s.tableType}>{ty}</span>
        </div>
      ))}
    </div>
  );
}
function SchemaDemo({ t }: { t: T }) {
  return (
    <div className={s.schema}>
      <svg viewBox="0 0 500 400" className={s.schemaSvg} aria-hidden="true">
        <path d="M190 130 H 260 V 210 H 300" />
        <path d="M190 280 H 250 V 230 H 300" />
      </svg>
      {TABLES.map((tb) => (
        <Table key={tb.name} t={t} tb={tb} />
      ))}
    </div>
  );
}
// celular: tabelas empilhadas, alternando lado, ligadas por um traço
function SchemaDemoMobile({ t }: { t: T }) {
  return (
    <div className={s.schemaM}>
      {TABLES.map((tb, i) => (
        <div key={tb.name} className={`${s.schemaRow} ${tb.end ? s.schemaRowEnd : ""}`}>
          <Table t={t} tb={tb} className={s.tableM} />
          {i < TABLES.length - 1 && <span className={s.schemaLink} aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}
