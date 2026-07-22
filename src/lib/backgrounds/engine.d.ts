// Tipos do motor de backgrounds (engine.js é JS puro, sem checagem).
import type { BgParam, BgValues } from "./types";

export interface EngineEffect {
  id: string;
  name: string;
  cat: string;
  desc: string;
  heavy?: boolean;
  params: BgParam[];
  fn: (canvas: HTMLCanvasElement, getP: () => BgValues) => { stop: () => void };
}

export const EFFECTS: EngineEffect[];
export function PRELUDE_FN(): void;
