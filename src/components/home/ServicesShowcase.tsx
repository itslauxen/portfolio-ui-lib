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

// passos do log de execução da automação
const FLOW_STEPS = [
  { kind: "webhook", title: "srv.stepWebhook", time: "0,2s", done: true },
  { kind: "bot", title: "srv.stepBot", time: "0,6s", done: true },
  { kind: "api", title: "srv.stepApi", time: "0,9s", done: true },
  { kind: "whatsapp", title: "srv.stepWhats", time: "…", done: false },
] as const;

// painel do app fullstack: indicadores + atendimentos recentes
const KPIS = [
  { v: "12", k: "srv.kpiOpen" },
  { v: "48", k: "srv.kpiDone" },
  { v: "3m", k: "srv.kpiTime" },
] as const;
const TICKETS = [
  { who: "Marina S.", ch: "WhatsApp", st: "done" },
  { who: "Loja Centro", ch: "E-mail", st: "open" },
  { who: "João P.", ch: "Instagram", st: "bot" },
  { who: "Ana R.", ch: "WhatsApp", st: "done" },
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
      {active === 2 && <RunDemo t={t} />}
      {active === 3 && <AppDemo t={t} />}
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

  // lista com o item `on` aberto (descrição visível)
  const list = (on: number, ghost: boolean) =>
    SERVICES.map((sv, i) => {
      const isOn = i === on;
      const cls = `${s.item} ${isOn ? s.itemOn : ""}`;
      const body = (
        <>
          <span className={s.itemLabel}>{sv.tags.join(" · ")}</span>
          <span className={s.itemTitle}>{t(sv.t)}</span>
          {isOn && <span className={s.itemDesc}>{t(sv.d)}</span>}
        </>
      );
      return ghost ? (
        <div key={sv.t} className={cls}>
          {body}
        </div>
      ) : (
        <button
          key={sv.t}
          type="button"
          role="tab"
          aria-selected={isOn}
          className={cls}
          onClick={() => setActive(i)}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
        >
          {body}
        </button>
      );
    });

  return (
    <div className={s.grid}>
      <h2 className={`${s.title} ${s.titleCell}`}>{t("home.servicesTitle")}</h2>
      {/* a altura da lista fica reservada pela maior descrição: cópias
          invisíveis (uma por item aberto) na mesma célula — trocar de item não
          muda a altura nem empurra o título */}
      <div className={s.listStack}>
        {SERVICES.map((sv, i) => (
          <div key={sv.t} className={`${s.list} ${s.listGhost}`} aria-hidden="true">
            {list(i, true)}
          </div>
        ))}
        <div className={s.list} role="tablist" aria-label={t("home.servicesTitle")}>
          {list(active, false)}
        </div>
      </div>
      <div className={`${s.stage} ${s.stageCell}`} aria-live="polite">
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

/* ---- 3 · automação: log de uma execução — passos numa linha vertical, o último rodando ---- */
function RunDemo({ t }: { t: T }) {
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

/* ---- 4 · fullstack: painel do sistema rodando — indicadores + atendimentos ---- */
function AppDemo({ t }: { t: T }) {
  return (
    <div className={s.app}>
      <div className={s.appHead}>
        <span className={s.appTitle}>{t("srv.appTitle")}</span>
        <span className={s.appSync}>
          <span className={s.toolDot} aria-hidden="true" />
          {t("srv.appSync")}
        </span>
      </div>
      <div className={s.kpis}>
        {KPIS.map((k) => (
          <div key={k.k} className={s.kpi}>
            <span className={s.kpiValue}>{k.v}</span>
            <span className={s.kpiLabel}>{t(k.k)}</span>
          </div>
        ))}
      </div>
      <ul className={s.tickets}>
        {TICKETS.map((tk) => (
          <li key={tk.who} className={s.ticket}>
            <span className={s.avatar} aria-hidden="true">
              {tk.who[0]}
            </span>
            <span className={s.ticketWho}>
              <span className={s.ticketName}>{tk.who}</span>
              <span className={s.ticketCh}>{tk.ch}</span>
            </span>
            <span className={`${s.status} ${s["st_" + tk.st]}`}>{t(`srv.st_${tk.st}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
