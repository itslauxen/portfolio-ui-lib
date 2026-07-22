// ============================================================================
// Efeitos de fundo renderizados por componentes React/WebGL (OGL).
// Ficam no MESMO catálogo dos efeitos de canvas (kind: "react") para que a
// galeria, os previews e o editor de parâmetros os tratem de forma unificada.
//
// Cada efeito declara seus parâmetros no formato BgParam (sliders, cores,
// switches e selects) e um `propsFrom` que converte os valores atuais nas
// props do componente. Sem JSX aqui, os componentes são resolvidos na camada
// de UI (ReactBackground.tsx).
// ============================================================================

import type { BackgroundEffect, BgValues } from "./types";

/** Nome do componente React que renderiza o efeito (usado no snippet copiável). */
export type ReactComponentName =
  | "Aurora"
  | "Grainient"
  | "LightRays"
  | "GradientBlinds"
  | "PlasmaWave"
  | "Ferrofluid"
  | "Lightfall"
  | "LiquidEther"
  | "DotGrid"
  | "FaultyTerminal"
  | "PixelBlast"
  | "ColorBends"
  | "Beams"
  | "Dither"
  | "DotField";

export interface ReactEffect extends BackgroundEffect {
  kind: "react";
  component: ReactComponentName;
  /** Converte os valores dos parâmetros nas props do componente. */
  propsFrom: (v: BgValues) => Record<string, unknown>;
}

const n = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);
const s = (v: unknown, d = ""): string => (typeof v === "string" ? v : d);
const b = (v: unknown): boolean => Boolean(v);

export const REACT_EFFECTS: ReactEffect[] = [
  // ---- Aurora (cortinas de luz em shader) ---------------------------------
  {
    id: "aurora-gl",
    name: "Aurora Boreal",
    cat: "Gradiente",
    desc: "Cortinas de luz onduladas em shader WebGL, com ruído orgânico e mistura suave entre três cores.",
    heavy: false,
    gl: true,
    kind: "react",
    component: "Aurora",
    params: [
      { key: "color1", label: "Cor 1", type: "color", default: "#7c5cff" },
      { key: "color2", label: "Cor 2", type: "color", default: "#00e5ff" },
      { key: "color3", label: "Cor 3", type: "color", default: "#ff4d9d" },
      { key: "amplitude", label: "Ondulação", type: "range", min: 0, max: 2, step: 0.05, default: 1 },
      { key: "blend", label: "Mistura", type: "range", min: 0, max: 1, step: 0.01, default: 0.5 },
      { key: "speed", label: "Velocidade", type: "range", min: 0, max: 3, step: 0.05, default: 1 },
    ],
    propsFrom: (v) => ({
      colorStops: [s(v.color1, "#7c5cff"), s(v.color2, "#00e5ff"), s(v.color3, "#ff4d9d")],
      amplitude: n(v.amplitude, 1),
      blend: n(v.blend, 0.5),
      speed: n(v.speed, 1),
    }),
  },

  // ---- Grainient (gradiente granulado com warp) ---------------------------
  {
    id: "grainient",
    name: "Gradiente Granulado",
    cat: "Shader",
    desc: "Gradiente em shader WebGL2 com warp, grão fílmico e rotação, cores fundindo em movimento suave.",
    heavy: false,
    gl: true,
    kind: "react",
    component: "Grainient",
    params: [
      { key: "color1", label: "Cor 1", type: "color", default: "#ff9ffc" },
      { key: "color2", label: "Cor 2", type: "color", default: "#5227ff" },
      { key: "color3", label: "Cor 3", type: "color", default: "#b497cf" },
      { key: "timeSpeed", label: "Velocidade", type: "range", min: 0, max: 2, step: 0.05, default: 0.25 },
      { key: "colorBalance", label: "Balanço de cor", type: "range", min: -1, max: 1, step: 0.05, default: 0 },
      { key: "warpStrength", label: "Força do warp", type: "range", min: 0.1, max: 3, step: 0.1, default: 1 },
      { key: "warpFrequency", label: "Frequência do warp", type: "range", min: 0, max: 20, step: 0.5, default: 5 },
      { key: "warpSpeed", label: "Velocidade do warp", type: "range", min: 0, max: 6, step: 0.1, default: 2 },
      { key: "warpAmplitude", label: "Amplitude do warp", type: "range", min: 1, max: 150, step: 1, default: 50 },
      { key: "blendAngle", label: "Ângulo de mistura", type: "range", min: 0, max: 360, step: 1, default: 0 },
      { key: "blendSoftness", label: "Suavidade da mistura", type: "range", min: 0, max: 1, step: 0.01, default: 0.05 },
      { key: "rotationAmount", label: "Rotação", type: "range", min: 0, max: 1000, step: 10, default: 500 },
      { key: "noiseScale", label: "Escala do ruído", type: "range", min: 0, max: 8, step: 0.1, default: 2 },
      { key: "grainAmount", label: "Quantidade de grão", type: "range", min: 0, max: 1, step: 0.01, default: 0.1 },
      { key: "grainScale", label: "Escala do grão", type: "range", min: 0.1, max: 8, step: 0.1, default: 2 },
      { key: "grainAnimated", label: "Grão animado", type: "bool", default: false },
      { key: "contrast", label: "Contraste", type: "range", min: 0.5, max: 3, step: 0.05, default: 1.5 },
      { key: "gamma", label: "Gama", type: "range", min: 0.2, max: 3, step: 0.05, default: 1 },
      { key: "saturation", label: "Saturação", type: "range", min: 0, max: 2, step: 0.05, default: 1 },
      { key: "zoom", label: "Zoom", type: "range", min: 0.3, max: 2, step: 0.05, default: 0.9 },
    ],
    propsFrom: (v) => ({
      color1: s(v.color1, "#ff9ffc"),
      color2: s(v.color2, "#5227ff"),
      color3: s(v.color3, "#b497cf"),
      timeSpeed: n(v.timeSpeed, 0.25),
      colorBalance: n(v.colorBalance, 0),
      warpStrength: n(v.warpStrength, 1),
      warpFrequency: n(v.warpFrequency, 5),
      warpSpeed: n(v.warpSpeed, 2),
      warpAmplitude: n(v.warpAmplitude, 50),
      blendAngle: n(v.blendAngle, 0),
      blendSoftness: n(v.blendSoftness, 0.05),
      rotationAmount: n(v.rotationAmount, 500),
      noiseScale: n(v.noiseScale, 2),
      grainAmount: n(v.grainAmount, 0.1),
      grainScale: n(v.grainScale, 2),
      grainAnimated: b(v.grainAnimated),
      contrast: n(v.contrast, 1.5),
      gamma: n(v.gamma, 1),
      saturation: n(v.saturation, 1),
      zoom: n(v.zoom, 0.9),
    }),
  },

  // ---- GradientBlinds (persianas de gradiente + holofote) -----------------
  {
    id: "gradientblinds",
    name: "Persianas de Gradiente",
    cat: "Gradiente",
    desc: "Persianas de gradiente em shader WebGL com holofote que segue o mouse, vibrante e interativo.",
    heavy: false,
    gl: true,
    kind: "react",
    component: "GradientBlinds",
    params: [
      { key: "color1", label: "Cor 1", type: "color", default: "#ff5ea8" },
      { key: "color2", label: "Cor 2", type: "color", default: "#7c5cff" },
      { key: "color3", label: "Cor 3", type: "color", default: "#00e5ff" },
      { key: "angle", label: "Ângulo", type: "range", min: 0, max: 360, step: 1, default: 20 },
      { key: "blindCount", label: "Qtd. de persianas", type: "range", min: 1, max: 48, step: 1, default: 16 },
      { key: "blindMinWidth", label: "Largura mín.", type: "range", min: 10, max: 200, step: 5, default: 55 },
      { key: "noise", label: "Ruído", type: "range", min: 0, max: 1, step: 0.01, default: 0.25 },
      { key: "spotlightRadius", label: "Raio do holofote", type: "range", min: 0.1, max: 1.5, step: 0.05, default: 0.55 },
      { key: "spotlightSoftness", label: "Suavidade do holofote", type: "range", min: 0, max: 4, step: 0.1, default: 1 },
      { key: "spotlightOpacity", label: "Opacidade do holofote", type: "range", min: 0, max: 1, step: 0.05, default: 1 },
      { key: "distortAmount", label: "Distorção", type: "range", min: 0, max: 5, step: 0.1, default: 0 },
      { key: "mouseDampening", label: "Suavização do mouse", type: "range", min: 0, max: 1, step: 0.01, default: 0.15 },
      { key: "mirrorGradient", label: "Espelhar gradiente", type: "bool", default: false },
      {
        key: "shineDirection",
        label: "Direção do brilho",
        type: "select",
        default: "left",
        options: [
          ["left", "Esquerda"],
          ["right", "Direita"],
        ],
      },
    ],
    propsFrom: (v) => ({
      gradientColors: [s(v.color1, "#ff5ea8"), s(v.color2, "#7c5cff"), s(v.color3, "#00e5ff")],
      angle: n(v.angle, 20),
      blindCount: n(v.blindCount, 16),
      blindMinWidth: n(v.blindMinWidth, 55),
      noise: n(v.noise, 0.25),
      spotlightRadius: n(v.spotlightRadius, 0.55),
      spotlightSoftness: n(v.spotlightSoftness, 1),
      spotlightOpacity: n(v.spotlightOpacity, 1),
      distortAmount: n(v.distortAmount, 0),
      mouseDampening: n(v.mouseDampening, 0.15),
      mirrorGradient: b(v.mirrorGradient),
      shineDirection: s(v.shineDirection, "left"),
    }),
  },

  // ---- PlasmaWave (ondas de plasma em raymarch) ---------------------------
  {
    id: "plasmawave",
    name: "Onda de Plasma",
    cat: "Shader",
    desc: "Ondas de plasma renderizadas por raymarch em shader WebGL, fitas luminosas que ondulam e se cruzam.",
    heavy: false,
    gl: true,
    kind: "react",
    component: "PlasmaWave",
    params: [
      { key: "color1", label: "Cor 1", type: "color", default: "#a855f7" },
      { key: "color2", label: "Cor 2", type: "color", default: "#06b6d4" },
      { key: "rotationDeg", label: "Rotação", type: "range", min: 0, max: 360, step: 1, default: 0 },
      { key: "focalLength", label: "Distância focal", type: "range", min: 0.3, max: 2, step: 0.05, default: 0.8 },
      { key: "speed1", label: "Velocidade 1", type: "range", min: 0, max: 0.3, step: 0.005, default: 0.05 },
      { key: "speed2", label: "Velocidade 2", type: "range", min: 0, max: 0.3, step: 0.005, default: 0.05 },
      { key: "bend1", label: "Curvatura 1", type: "range", min: 0, max: 2, step: 0.05, default: 1 },
      { key: "bend2", label: "Curvatura 2", type: "range", min: 0, max: 2, step: 0.05, default: 0.5 },
      { key: "dir2Invert", label: "Inverter 2ª onda", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      colors: [s(v.color1, "#a855f7"), s(v.color2, "#06b6d4")],
      rotationDeg: n(v.rotationDeg, 0),
      focalLength: n(v.focalLength, 0.8),
      speed1: n(v.speed1, 0.05),
      speed2: n(v.speed2, 0.05),
      bend1: n(v.bend1, 1),
      bend2: n(v.bend2, 0.5),
      dir2: b(v.dir2Invert) ? -1 : 1,
    }),
  },

  // ---- LightRays (feixes volumétricos que reagem ao mouse) ----------------
  {
    id: "lightrays",
    name: "Raios de Luz",
    cat: "Shader",
    desc: "Feixes de luz volumétricos partindo de uma origem, com brilho suave e reação ao movimento do mouse.",
    heavy: false,
    gl: true,
    kind: "react",
    component: "LightRays",
    params: [
      { key: "raysColor", label: "Cor dos raios", type: "color", default: "#7c5cff" },
      {
        key: "raysOrigin",
        label: "Origem",
        type: "select",
        default: "top-center",
        options: [
          ["top-center", "Topo (centro)"],
          ["top-left", "Topo (esq.)"],
          ["top-right", "Topo (dir.)"],
          ["left", "Esquerda"],
          ["right", "Direita"],
          ["bottom-center", "Base (centro)"],
          ["bottom-left", "Base (esq.)"],
          ["bottom-right", "Base (dir.)"],
        ],
      },
      { key: "raysSpeed", label: "Velocidade", type: "range", min: 0, max: 3, step: 0.05, default: 1.1 },
      { key: "lightSpread", label: "Abertura", type: "range", min: 0.2, max: 3, step: 0.05, default: 1 },
      { key: "rayLength", label: "Comprimento", type: "range", min: 0.5, max: 4, step: 0.1, default: 2 },
      { key: "fadeDistance", label: "Alcance", type: "range", min: 0.2, max: 2, step: 0.05, default: 1 },
      { key: "saturation", label: "Saturação", type: "range", min: 0, max: 2, step: 0.05, default: 1 },
      { key: "mouseInfluence", label: "Influência do mouse", type: "range", min: 0, max: 1, step: 0.05, default: 0.1 },
      { key: "noiseAmount", label: "Ruído", type: "range", min: 0, max: 1, step: 0.05, default: 0 },
      { key: "distortion", label: "Distorção", type: "range", min: 0, max: 2, step: 0.05, default: 0 },
      { key: "pulsating", label: "Pulsar", type: "bool", default: false },
      { key: "followMouse", label: "Seguir o mouse", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      raysColor: s(v.raysColor, "#7c5cff"),
      raysOrigin: s(v.raysOrigin, "top-center"),
      raysSpeed: n(v.raysSpeed, 1.1),
      lightSpread: n(v.lightSpread, 1),
      rayLength: n(v.rayLength, 2),
      fadeDistance: n(v.fadeDistance, 1),
      saturation: n(v.saturation, 1),
      mouseInfluence: n(v.mouseInfluence, 0.1),
      noiseAmount: n(v.noiseAmount, 0),
      distortion: n(v.distortion, 0),
      pulsating: b(v.pulsating),
      followMouse: b(v.followMouse),
    }),
  },

  // ---- Ferrofluid (fluido magnético) --------------------------------------
  {
    id: "ferrofluid",
    name: "Ferrofluido",
    cat: "Fluido",
    desc: "Fluido magnético escuro com cristas luminosas que escorrem e se fundem, em shader WebGL.",
    heavy: true,
    gl: true,
    kind: "react",
    component: "Ferrofluid",
    params: [
      { key: "cor", label: "Cor", type: "color", default: "#ffffff" },
      { key: "speed", label: "Velocidade", type: "range", min: 0, max: 2, step: 0.05, default: 0.5 },
      { key: "scale", label: "Escala", type: "range", min: 0.3, max: 4, step: 0.1, default: 1.6 },
      { key: "turbulence", label: "Turbulência", type: "range", min: 0, max: 3, step: 0.05, default: 1 },
      { key: "fluidity", label: "Fluidez", type: "range", min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
      { key: "rimWidth", label: "Largura da borda", type: "range", min: 0.05, max: 1, step: 0.01, default: 0.2 },
      { key: "glow", label: "Brilho", type: "range", min: 0, max: 5, step: 0.1, default: 2 },
      { key: "flowDirection", label: "Direção do fluxo", type: "select", default: "down",
        options: [["down", "Para baixo"], ["up", "Para cima"], ["left", "Esquerda"], ["right", "Direita"]] },
    ],
    propsFrom: (v) => ({
      colors: [s(v.cor, "#ffffff")],
      speed: n(v.speed, 0.5),
      scale: n(v.scale, 1.6),
      turbulence: n(v.turbulence, 1),
      fluidity: n(v.fluidity, 0.1),
      rimWidth: n(v.rimWidth, 0.2),
      glow: n(v.glow, 2),
      flowDirection: s(v.flowDirection, "down") as "up" | "down" | "left" | "right",
    }),
  },

  // ---- Lightfall (cascata de luz) ------------------------------------------
  {
    id: "lightfall",
    name: "Cascata de Luz",
    cat: "Luz",
    desc: "Feixes de luz coloridos escorrendo por um túnel curvo, com cintilação e brilho de fundo.",
    heavy: true,
    gl: true,
    kind: "react",
    component: "Lightfall",
    params: [
      { key: "cor1", label: "Cor 1", type: "color", default: "#c6ff3a" },
      { key: "cor2", label: "Cor 2", type: "color", default: "#5ff2d8" },
      { key: "cor3", label: "Cor 3", type: "color", default: "#ffffff" },
      { key: "speed", label: "Velocidade", type: "range", min: 0, max: 2, step: 0.05, default: 0.5 },
      { key: "streakCount", label: "Qtd. de feixes", type: "range", min: 1, max: 16, step: 1, default: 2 },
      { key: "streakLength", label: "Comprimento", type: "range", min: 0.1, max: 3, step: 0.05, default: 1 },
      { key: "density", label: "Densidade", type: "range", min: 0.05, max: 2, step: 0.05, default: 0.6 },
      { key: "zoom", label: "Zoom", type: "range", min: 1, max: 8, step: 0.1, default: 3 },
    ],
    propsFrom: (v) => ({
      colors: [s(v.cor1, "#c6ff3a"), s(v.cor2, "#5ff2d8"), s(v.cor3, "#ffffff")],
      backgroundColor: "#04040a",
      speed: n(v.speed, 0.5),
      streakCount: n(v.streakCount, 2),
      streakLength: n(v.streakLength, 1),
      density: n(v.density, 0.6),
      zoom: n(v.zoom, 3),
    }),
  },

  // ---- LiquidEther (simulação de fluido) -----------------------------------
  {
    id: "liquidether",
    name: "Éter Líquido",
    cat: "Fluido",
    desc: "Simulação de fluido colorido que reage ao cursor e se move sozinho quando o usuário está inativo.",
    heavy: true,
    gl: true,
    kind: "react",
    component: "LiquidEther",
    params: [
      { key: "cor1", label: "Cor 1", type: "color", default: "#c6ff3a" },
      { key: "cor2", label: "Cor 2", type: "color", default: "#5ff2d8" },
      { key: "cor3", label: "Cor 3", type: "color", default: "#ffffff" },
      { key: "mouseForce", label: "Força do mouse", type: "range", min: 0, max: 100, step: 1, default: 20 },
      { key: "cursorSize", label: "Tamanho do cursor", type: "range", min: 20, max: 300, step: 5, default: 100 },
      { key: "resolution", label: "Resolução", type: "range", min: 0.1, max: 1, step: 0.05, default: 0.5 },
      { key: "autoDemo", label: "Piloto automático", type: "bool", default: true },
      { key: "autoSpeed", label: "Velocidade automática", type: "range", min: 0, max: 2, step: 0.05, default: 0.5 },
    ],
    propsFrom: (v) => ({
      colors: [s(v.cor1, "#c6ff3a"), s(v.cor2, "#5ff2d8"), s(v.cor3, "#ffffff")],
      mouseForce: n(v.mouseForce, 20),
      cursorSize: n(v.cursorSize, 100),
      resolution: n(v.resolution, 0.5),
      autoDemo: b(v.autoDemo),
      autoSpeed: n(v.autoSpeed, 0.5),
    }),
  },

  // ---- DotGrid (grade de pontos com física) --------------------------------
  {
    id: "dotgrid",
    name: "Grade de Pontos",
    cat: "Pontos",
    desc: "Grade de pontos interativa: o mouse rápido empurra os pontos e cliques disparam onda de choque elástica.",
    heavy: false,
    gl: false,
    kind: "react",
    component: "DotGrid",
    params: [
      { key: "baseColor", label: "Cor base", type: "color", default: "#26262c" },
      { key: "activeColor", label: "Cor ativa", type: "color", default: "#c6ff3a" },
      { key: "dotSize", label: "Tamanho do ponto", type: "range", min: 4, max: 40, step: 1, default: 12 },
      { key: "gap", label: "Espaçamento", type: "range", min: 8, max: 80, step: 1, default: 28 },
      { key: "proximity", label: "Proximidade", type: "range", min: 50, max: 400, step: 10, default: 150 },
      { key: "shockRadius", label: "Raio do choque", type: "range", min: 50, max: 600, step: 10, default: 250 },
      { key: "shockStrength", label: "Força do choque", type: "range", min: 0, max: 15, step: 0.5, default: 5 },
      { key: "returnDuration", label: "Tempo de retorno", type: "range", min: 0.2, max: 4, step: 0.1, default: 1.5 },
    ],
    propsFrom: (v) => ({
      baseColor: s(v.baseColor, "#26262c"),
      activeColor: s(v.activeColor, "#c6ff3a"),
      dotSize: n(v.dotSize, 12),
      gap: n(v.gap, 28),
      proximity: n(v.proximity, 150),
      shockRadius: n(v.shockRadius, 250),
      shockStrength: n(v.shockStrength, 5),
      returnDuration: n(v.returnDuration, 1.5),
    }),
  },

  // ---- FaultyTerminal (terminal CRT com falhas) ----------------------------
  {
    id: "faultyterminal",
    name: "Terminal com Falhas",
    cat: "Retrô",
    desc: "Tela de terminal CRT retrô com dígitos procedurais, scanlines, glitches e curvatura configurável.",
    heavy: true,
    gl: true,
    kind: "react",
    component: "FaultyTerminal",
    params: [
      { key: "tint", label: "Tinta", type: "color", default: "#c6ff3a" },
      { key: "scale", label: "Escala", type: "range", min: 0.5, max: 3, step: 0.1, default: 1 },
      { key: "timeScale", label: "Velocidade", type: "range", min: 0, max: 2, step: 0.05, default: 0.3 },
      { key: "digitSize", label: "Tamanho dos dígitos", type: "range", min: 0.5, max: 3, step: 0.05, default: 1.5 },
      { key: "scanlineIntensity", label: "Scanlines", type: "range", min: 0, max: 2, step: 0.05, default: 0.3 },
      { key: "flickerAmount", label: "Tremulação", type: "range", min: 0, max: 3, step: 0.05, default: 1 },
      { key: "curvature", label: "Curvatura", type: "range", min: 0, max: 0.5, step: 0.01, default: 0.2 },
      { key: "mouseReact", label: "Reage ao mouse", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      tint: s(v.tint, "#c6ff3a"),
      scale: n(v.scale, 1),
      timeScale: n(v.timeScale, 0.3),
      digitSize: n(v.digitSize, 1.5),
      scanlineIntensity: n(v.scanlineIntensity, 0.3),
      flickerAmount: n(v.flickerAmount, 1),
      curvature: n(v.curvature, 0.2),
      mouseReact: b(v.mouseReact),
    }),
  },

  // ---- PixelBlast (pixels com ondulações) ----------------------------------
  {
    id: "pixelblast",
    name: "Explosão de Pixels",
    cat: "Retrô",
    desc: "Pixels em ruído fractal com ondulações ao clique, em quatro formatos de célula.",
    heavy: true,
    gl: true,
    kind: "react",
    component: "PixelBlast",
    params: [
      { key: "variant", label: "Formato", type: "select", default: "square",
        options: [["square", "Quadrado"], ["circle", "Círculo"], ["triangle", "Triângulo"], ["diamond", "Losango"]] },
      { key: "color", label: "Cor", type: "color", default: "#c6ff3a" },
      { key: "pixelSize", label: "Tamanho do pixel", type: "range", min: 1, max: 16, step: 1, default: 3 },
      { key: "patternScale", label: "Escala do padrão", type: "range", min: 0.5, max: 10, step: 0.1, default: 2 },
      { key: "patternDensity", label: "Densidade", type: "range", min: 0, max: 2, step: 0.05, default: 1 },
      { key: "speed", label: "Velocidade", type: "range", min: 0, max: 2, step: 0.05, default: 0.5 },
      { key: "edgeFade", label: "Esmaecer bordas", type: "range", min: 0, max: 1, step: 0.01, default: 0.5 },
      { key: "enableRipples", label: "Ondulações ao clique", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      variant: s(v.variant, "square") as "square" | "circle" | "triangle" | "diamond",
      color: s(v.color, "#c6ff3a"),
      pixelSize: n(v.pixelSize, 3),
      patternScale: n(v.patternScale, 2),
      patternDensity: n(v.patternDensity, 1),
      speed: n(v.speed, 0.5),
      edgeFade: n(v.edgeFade, 0.5),
      enableRipples: b(v.enableRipples),
    }),
  },

  // ---- ColorBends (faixas de cor fluidas) ----------------------------------
  {
    id: "colorbends",
    name: "Dobras de Cor",
    cat: "Gradiente",
    desc: "Faixas de cor que se dobram e fluem em ondas orgânicas, com paralaxe e reação ao mouse.",
    heavy: false,
    gl: true,
    kind: "react",
    component: "ColorBends",
    params: [
      { key: "color1", label: "Cor 1", type: "color", default: "#ff477e" },
      { key: "color2", label: "Cor 2", type: "color", default: "#c6ff3a" },
      { key: "color3", label: "Cor 3", type: "color", default: "#5ff2d8" },
      { key: "speed", label: "Velocidade", type: "range", min: 0, max: 2, step: 0.05, default: 0.2 },
      { key: "scale", label: "Escala", type: "range", min: 0.2, max: 3, step: 0.05, default: 1 },
      { key: "frequency", label: "Frequência", type: "range", min: 0.1, max: 4, step: 0.05, default: 1 },
      { key: "warpStrength", label: "Força do warp", type: "range", min: 0, max: 3, step: 0.05, default: 1 },
      { key: "noise", label: "Ruído", type: "range", min: 0, max: 0.5, step: 0.01, default: 0.15 },
    ],
    propsFrom: (v) => ({
      colors: [s(v.color1, "#ff477e"), s(v.color2, "#c6ff3a"), s(v.color3, "#5ff2d8")],
      speed: n(v.speed, 0.2),
      scale: n(v.scale, 1),
      frequency: n(v.frequency, 1),
      warpStrength: n(v.warpStrength, 1),
      noise: n(v.noise, 0.15),
    }),
  },

  // ---- Beams (feixes 3D com ruído) -----------------------------------------
  {
    id: "beams",
    name: "Feixes de Luz",
    cat: "Luz",
    desc: "Feixes verticais 3D deformados por ruído Perlin, com iluminação física e grão sutil.",
    heavy: true,
    gl: true,
    kind: "react",
    component: "Beams",
    params: [
      { key: "lightColor", label: "Cor da luz", type: "color", default: "#ffffff" },
      { key: "beamWidth", label: "Largura do feixe", type: "range", min: 0.5, max: 5, step: 0.1, default: 2 },
      { key: "beamHeight", label: "Altura do feixe", type: "range", min: 5, max: 30, step: 1, default: 15 },
      { key: "beamNumber", label: "Quantidade", type: "range", min: 2, max: 30, step: 1, default: 12 },
      { key: "speed", label: "Velocidade", type: "range", min: 0, max: 10, step: 0.1, default: 2 },
      { key: "noiseIntensity", label: "Intensidade do grão", type: "range", min: 0, max: 5, step: 0.05, default: 1.75 },
      { key: "scale", label: "Escala do ruído", type: "range", min: 0.05, max: 1, step: 0.01, default: 0.2 },
      { key: "rotation", label: "Rotação", type: "range", min: 0, max: 360, step: 1, default: 0 },
    ],
    propsFrom: (v) => ({
      lightColor: s(v.lightColor, "#ffffff"),
      beamWidth: n(v.beamWidth, 2),
      beamHeight: n(v.beamHeight, 15),
      beamNumber: n(v.beamNumber, 12),
      speed: n(v.speed, 2),
      noiseIntensity: n(v.noiseIntensity, 1.75),
      scale: n(v.scale, 0.2),
      rotation: n(v.rotation, 0),
    }),
  },

  // ---- Dither (ondas retrô quantizadas) ------------------------------------
  {
    id: "dither",
    name: "Ondas Retrô (Dither)",
    cat: "Retrô",
    desc: "Ondas de ruído fractal quantizadas com dithering Bayer retrô, em poucos tons pixelados.",
    heavy: true,
    gl: true,
    kind: "react",
    component: "Dither",
    params: [
      { key: "waveColor", label: "Cor das ondas", type: "color", default: "#808080" },
      { key: "waveSpeed", label: "Velocidade", type: "range", min: 0, max: 0.3, step: 0.005, default: 0.05 },
      { key: "waveFrequency", label: "Frequência", type: "range", min: 0.5, max: 8, step: 0.1, default: 3 },
      { key: "waveAmplitude", label: "Amplitude", type: "range", min: 0, max: 1, step: 0.01, default: 0.3 },
      { key: "colorNum", label: "Número de tons", type: "range", min: 2, max: 16, step: 1, default: 4 },
      { key: "pixelSize", label: "Tamanho do pixel", type: "range", min: 1, max: 10, step: 1, default: 2 },
      { key: "enableMouseInteraction", label: "Reagir ao mouse", type: "bool", default: true },
      { key: "mouseRadius", label: "Raio do mouse", type: "range", min: 0.1, max: 3, step: 0.05, default: 1 },
    ],
    propsFrom: (v) => {
      const hex = s(v.waveColor, "#808080");
      return {
        waveColor: [
          parseInt(hex.slice(1, 3), 16) / 255,
          parseInt(hex.slice(3, 5), 16) / 255,
          parseInt(hex.slice(5, 7), 16) / 255,
        ] as [number, number, number],
        waveSpeed: n(v.waveSpeed, 0.05),
        waveFrequency: n(v.waveFrequency, 3),
        waveAmplitude: n(v.waveAmplitude, 0.3),
        colorNum: n(v.colorNum, 4),
        pixelSize: n(v.pixelSize, 2),
        enableMouseInteraction: b(v.enableMouseInteraction),
        mouseRadius: n(v.mouseRadius, 1),
      };
    },
  },

  // ---- DotField (pontos que abaúlam) ----------------------------------------
  {
    id: "dotfield",
    name: "Campo de Pontos",
    cat: "Pontos",
    desc: "Grade de pontos em canvas 2D que abaúla ou repele ao redor do cursor, com onda ambiente opcional.",
    heavy: false,
    gl: false,
    kind: "react",
    component: "DotField",
    params: [
      { key: "gradientFrom", label: "Cor inicial", type: "color", default: "#c6ff3a" },
      { key: "gradientTo", label: "Cor final", type: "color", default: "#5ff2d8" },
      { key: "dotRadius", label: "Raio do ponto", type: "range", min: 0.5, max: 5, step: 0.1, default: 1.5 },
      { key: "dotSpacing", label: "Espaçamento", type: "range", min: 4, max: 40, step: 1, default: 14 },
      { key: "cursorRadius", label: "Raio do cursor", type: "range", min: 50, max: 900, step: 10, default: 500 },
      { key: "bulgeOnly", label: "Modo abaulamento", type: "bool", default: true },
      { key: "bulgeStrength", label: "Força do abaulamento", type: "range", min: 0, max: 200, step: 1, default: 67 },
      { key: "waveAmplitude", label: "Onda ambiente", type: "range", min: 0, max: 20, step: 0.5, default: 0 },
    ],
    propsFrom: (v) => ({
      gradientFrom: s(v.gradientFrom, "#c6ff3a"),
      gradientTo: s(v.gradientTo, "#5ff2d8"),
      dotRadius: n(v.dotRadius, 1.5),
      dotSpacing: n(v.dotSpacing, 14),
      cursorRadius: n(v.cursorRadius, 500),
      bulgeOnly: b(v.bulgeOnly),
      bulgeStrength: n(v.bulgeStrength, 67),
      waveAmplitude: n(v.waveAmplitude, 0),
    }),
  },
];

const REACT_BY_ID = new Map(REACT_EFFECTS.map((e) => [e.id, e]));

/** true se o efeito é renderizado por um componente React (não pelo motor). */
export function isReactEffect(id: string): boolean {
  return REACT_BY_ID.has(id);
}

/** Metadado + renderer de um efeito React pelo id. */
export function getReactEffect(id: string): ReactEffect | undefined {
  return REACT_BY_ID.get(id);
}
