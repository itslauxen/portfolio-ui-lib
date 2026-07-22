// API pública da biblioteca: catálogo unificado (fundos de canvas, fundos em
// shader/React e demos de componente), helpers de parâmetros, seções e
// exportação de código. Tudo vive no MESMO catálogo, organizado por seção.

import { EFFECTS, PRELUDE_FN } from "./engine";
import { BACKGROUND_CATALOG as CANVAS_CATALOG } from "./catalog";
import { REACT_EFFECTS, isReactEffect, getReactEffect } from "./react-catalog";
import { DEMO_EFFECTS, isDemoEffect, getDemoEffect } from "./demo-catalog";
import type { BackgroundEffect, BgParam, BgValues, LibSection } from "./types";

export type { BackgroundEffect, BgParam, BgValues, LibSection };
export { isReactEffect, getReactEffect, isDemoEffect, getDemoEffect };
export type { ReactEffect, ReactComponentName } from "./react-catalog";
export type { DemoEffect } from "./demo-catalog";

// Fundos ocultados do catálogo (removidos a pedido, sem apagar o código-fonte).
const HIDDEN_IDS = new Set([
  "bubbles",
  "snow", // Neve
  "cubecore", // Cubo Neon (Core)
  "bars3d", // Equalizador 3D
  "solids3d", // Icosaedro Neon
  "flowlines", // Campo de Fluxo
  "hexpulse", // Favo Pulsante
  "synthgrid", // Grade Synthwave
  "voronoi", // Voronoi
]);

/**
 * Ordem fixa dos fundos principais (a lista pedida): eles aparecem primeiro
 * na seção Backgrounds, nesta ordem; os demais fundos vêm depois.
 */
const PINNED_BG_ORDER = [
  "ferrofluid",
  "lightfall",
  "liquidether",
  "lightrays",
  "pixelblast",
  "colorbends",
  "aurora-gl",
  "plasmawave",
  "gradientblinds",
  "grainient",
  "beams",
  "dither",
  "faultyterminal",
  "dotfield",
  "dotgrid",
];

function orderBackgrounds(all: BackgroundEffect[]): BackgroundEffect[] {
  const byId = new Map(all.map((e) => [e.id, e]));
  const pinned = PINNED_BG_ORDER.map((id) => byId.get(id)).filter(
    (e): e is BackgroundEffect => !!e,
  );
  const pinnedSet = new Set(pinned.map((e) => e.id));
  return [...pinned, ...all.filter((e) => !pinnedSet.has(e.id))];
}

/** Seções da biblioteca, na ordem da barra lateral. */
export const LIB_SECTIONS: { key: LibSection; label: string }[] = [
  { key: "backgrounds", label: "Backgrounds" },
  { key: "componentes", label: "Componentes" },
  { key: "animacoes", label: "Animações" },
  { key: "texto", label: "Animações de texto" },
];

/** Seção de um item (ausente = backgrounds). */
export function sectionOf(eff: BackgroundEffect): LibSection {
  return eff.section ?? "backgrounds";
}

/** Catálogo único da biblioteca: fundos (fixados primeiro) + demos por seção. */
export const BACKGROUND_CATALOG: BackgroundEffect[] = [
  ...orderBackgrounds([
    ...REACT_EFFECTS,
    ...CANVAS_CATALOG.filter((e) => !HIDDEN_IDS.has(e.id)),
  ]),
  ...DEMO_EFFECTS.filter((e) => e.section === "componentes"),
  ...DEMO_EFFECTS.filter((e) => e.section === "animacoes"),
  ...DEMO_EFFECTS.filter((e) => e.section === "texto"),
];

interface EngineEffect {
  id: string;
  name: string;
  fn: (...a: unknown[]) => unknown;
}
const engineEffects = EFFECTS as unknown as EngineEffect[];

/** Metadado de um efeito pelo id. */
export function getEffectMeta(id: string): BackgroundEffect | undefined {
  return BACKGROUND_CATALOG.find((e) => e.id === id);
}

/** Valores padrão de um efeito (chave -> default). */
export function defaultsOf(eff: Pick<BackgroundEffect, "params">): BgValues {
  const o: BgValues = {};
  for (const p of eff.params) o[p.key] = p.default;
  return o;
}

/** Parâmetros “leves” para os previews da grade (reduz contagens pesadas). */
export function previewParamsOf(eff: Pick<BackgroundEffect, "params">): BgValues {
  const o = defaultsOf(eff);
  for (const p of eff.params) {
    const d = p.default as number;
    if (p.key === "count") o[p.key] = Math.max(30, Math.round(d * 0.4));
    else if (p.key === "cols" || p.key === "rows") o[p.key] = Math.max(3, Math.round(d * 0.6));
    else if (p.key === "rings" && d > 20) o[p.key] = Math.round(d * 0.6);
  }
  return o;
}

function randHex(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

/** Sorteia valores válidos para cada parâmetro (botão “aleatorizar”). */
export function randomizeParams(eff: Pick<BackgroundEffect, "params">): BgValues {
  const o: BgValues = {};
  for (const p of eff.params) {
    if (p.type === "range") {
      const min = p.min ?? 0, max = p.max ?? 1, step = p.step ?? 0.01;
      o[p.key] = Math.round((min + Math.random() * (max - min)) / step) * step;
    } else if (p.type === "color") {
      o[p.key] = randHex();
    } else if (p.type === "select" && p.options?.length) {
      o[p.key] = p.options[Math.floor(Math.random() * p.options.length)][0];
    } else if (p.type === "bool") {
      o[p.key] = Math.random() < 0.5;
    }
  }
  return o;
}

/** Lista de categorias (com “Todos” na frente). */
export const BACKGROUND_CATEGORIES: string[] = [
  "Todos",
  ...Array.from(new Set(BACKGROUND_CATALOG.map((e) => e.cat))),
];

/** Casa nº de parâmetros e formata contagem para exibição. */
export function paramCount(id: string): number {
  return getEffectMeta(id)?.params.length ?? 0;
}

/** Serializa um valor de parâmetro como atributo JSX (`{n}`, `"s"`, `{true}`). */
function jsxAttr(v: unknown): string {
  if (typeof v === "string") return `"${v}"`;
  if (Array.isArray(v)) return `{[${v.map((x) => (typeof x === "string" ? `"${x}"` : String(x))).join(", ")}]}`;
  return `{${String(v)}}`;
}

/**
 * Snippet JSX pronto para colar, com as props atuais. Usado no "Copiar código"
 * dos fundos em shader e das demos de componente (que não têm export de HTML).
 */
export function buildReactSnippet(effectId: string, params: BgValues): string {
  const eff = getReactEffect(effectId) ?? getDemoEffect(effectId);
  if (!eff) return "";
  const props = eff.propsFrom({ ...defaultsOf(eff), ...params });
  const attrs = Object.entries(props)
    .map(([k, v]) => `  ${k}=${jsxAttr(v)}`)
    .join("\n");
  return `<${eff.component}\n${attrs}\n/>`;
}

/**
 * Gera um arquivo HTML autossuficiente que roda o efeito com os parâmetros
 * dados, o mesmo recurso “Exportar HTML / Copiar código” do app original.
 * Só se aplica aos fundos de canvas (motor); shaders React usam buildReactSnippet.
 */
export function buildExportHTML(effectId: string, params: BgValues): string {
  const eff = engineEffects.find((e) => e.id === effectId);
  if (!eff) return "";
  const prelude = "(" + PRELUDE_FN.toString() + ")();";
  const fnSrc = eff.fn.toString();
  return (
    '<!DOCTYPE html>\n<html lang="pt-br">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' +
    eff.name +
    "</title>\n" +
    "<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000}canvas{display:block;width:100vw;height:100vh}</style>\n" +
    '</head>\n<body>\n<canvas id="c"></canvas>\n<script>\n' +
    prelude +
    "\nvar PARAMS=" +
    JSON.stringify(params) +
    ";\nvar EFFECT=" +
    fnSrc +
    ';\nEFFECT(document.getElementById("c"),function(){return PARAMS;});\n' +
    "</script>\n</body>\n</html>"
  );
}
