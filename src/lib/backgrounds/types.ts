// Tipos da camada de backgrounds (parâmetros e metadados dos efeitos).

export type BgParamType = "range" | "color" | "bool" | "select";

/** Um parâmetro editável de um efeito. Campos variam por `type`. */
export interface BgParam {
  key: string;
  label: string;
  type: BgParamType;
  default: number | string | boolean;
  // range
  min?: number;
  max?: number;
  step?: number;
  reinit?: boolean;
  // select
  options?: [string, string][];
}

/**
 * Como o item é renderizado:
 * - "canvas":    função pura do motor (engine.js) desenhando num <canvas>.
 * - "react":     fundo em componente React/WebGL que recebe os parâmetros como props.
 * - "component": demo de componente/animação (não é fundo) renderizada centrada no palco.
 * Ausente = "canvas" (padrão do catálogo gerado).
 */
export type BackgroundKind = "canvas" | "react" | "component";

/** Seção da biblioteca a que o item pertence (ausente = "backgrounds"). */
export type LibSection = "backgrounds" | "componentes" | "animacoes" | "texto";

/** Metadado de um item da biblioteca (sem a função, essa vive no engine/registry). */
export interface BackgroundEffect {
  id: string;
  name: string;
  cat: string;
  desc: string;
  /** true = usa GPU pesada (mostra badge). */
  heavy: boolean;
  /** true = efeito WebGL/shader. */
  gl: boolean;
  /** Motor de renderização. Ausente = "canvas". */
  kind?: BackgroundKind;
  /** Seção da biblioteca. Ausente = "backgrounds". */
  section?: LibSection;
  params: BgParam[];
}

/** Mapa de valores atuais dos parâmetros (chave -> valor). */
export type BgValues = Record<string, number | string | boolean>;
