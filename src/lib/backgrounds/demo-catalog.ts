// Catálogo dos itens de COMPONENTE da biblioteca (seções Componentes,
// Animações e Animações de texto). Cada item aponta para um componente React
// registrado em src/components/backgrounds/DemoStage.tsx e mapeia os valores
// dos sliders para props via propsFrom, igual aos fundos em shader.

import type { BackgroundEffect, BgValues, LibSection } from "./types";

export interface DemoEffect extends BackgroundEffect {
  kind: "component";
  section: Exclude<LibSection, "backgrounds">;
  /** Chave do componente no REGISTRY do DemoStage. */
  component: string;
  /** true = a demo preenche o palco inteiro (sem padding/centralização). */
  fullBleed?: boolean;
  /** Converte valores dos sliders em props do componente. */
  propsFrom: (v: BgValues) => Record<string, unknown>;
}

// Coerções (os valores vêm como number | string | boolean).
export const n = (v: unknown, d: number): number => (typeof v === "number" ? v : d);
export const s = (v: unknown, d: string): string => (typeof v === "string" ? v : d);
export const b = (v: unknown, d: boolean): boolean => (typeof v === "boolean" ? v : d);

// Converte hex ("#c6ff3a") em "rgba(r, g, b, a)".
const rgba = (hex: string, a: number): string => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(198, 255, 58, ${a})`;
  return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${a})`;
};

/** Itens de componente. Preenchido conforme as seções são portadas. */
export const DEMO_EFFECTS: DemoEffect[] = [
  // ==========================================================================
  // Seção: Componentes
  // ==========================================================================

  // ---- MagicBento (grade bento interativa) ---------------------------------
  {
    id: "magicbento",
    name: "Bento Mágico",
    cat: "Cards",
    desc: "Grade bento com holofote, brilho de borda, partículas e magnetismo seguindo o cursor.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "MagicBento",
    params: [
      { key: "glowColor", label: "Cor do brilho", type: "color", default: "#c6ff3a" },
      { key: "spotlightRadius", label: "Raio do holofote", type: "range", min: 100, max: 600, step: 10, default: 300 },
      { key: "particleCount", label: "Qtd. de partículas", type: "range", min: 0, max: 24, step: 1, default: 12 },
      { key: "enableBorderGlow", label: "Brilho na borda", type: "bool", default: true },
      { key: "enableStars", label: "Partículas", type: "bool", default: true },
      { key: "enableTilt", label: "Inclinação 3D", type: "bool", default: false },
      { key: "enableMagnetism", label: "Magnetismo", type: "bool", default: true },
      { key: "clickEffect", label: "Onda ao clicar", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      glowColor: s(v.glowColor, "#c6ff3a"),
      spotlightRadius: n(v.spotlightRadius, 300),
      particleCount: n(v.particleCount, 12),
      enableBorderGlow: b(v.enableBorderGlow, true),
      enableStars: b(v.enableStars, true),
      enableTilt: b(v.enableTilt, false),
      enableMagnetism: b(v.enableMagnetism, true),
      clickEffect: b(v.clickEffect, true),
    }),
  },

  // ---- FluidGlass (lente de vidro 3D) ---------------------------------------
  {
    id: "fluidglass",
    name: "Vidro Fluido",
    cat: "3D",
    desc: "Lente de vidro 3D que segue o cursor refratando o conteúdo da cena, com aberração cromática.",
    heavy: true,
    gl: true,
    kind: "component",
    section: "componentes",
    component: "FluidGlass",
    params: [
      {
        key: "mode",
        label: "Forma",
        type: "select",
        default: "torus",
        options: [
          ["torus", "Toro"],
          ["cubo", "Cubo"],
          ["esfera", "Esfera"],
        ],
      },
      { key: "scale", label: "Escala", type: "range", min: 0.4, max: 2, step: 0.05, default: 1 },
      { key: "ior", label: "Índice de refração", type: "range", min: 1, max: 1.4, step: 0.01, default: 1.15 },
      { key: "thickness", label: "Espessura", type: "range", min: 0.5, max: 10, step: 0.1, default: 5 },
      { key: "chromaticAberration", label: "Aberração cromática", type: "range", min: 0, max: 0.5, step: 0.01, default: 0.1 },
      { key: "followPointer", label: "Seguir o cursor", type: "bool", default: true },
      { key: "color", label: "Cor de destaque", type: "color", default: "#c6ff3a" },
    ],
    propsFrom: (v) => ({
      mode: s(v.mode, "torus") as "torus" | "cubo" | "esfera",
      scale: n(v.scale, 1),
      ior: n(v.ior, 1.15),
      thickness: n(v.thickness, 5),
      chromaticAberration: n(v.chromaticAberration, 0.1),
      followPointer: b(v.followPointer, true),
      color: s(v.color, "#c6ff3a"),
    }),
  },

  // ---- TiltedCard (cartão inclinado 3D) -------------------------------------
  {
    id: "tiltedcard",
    name: "Cartão Inclinado",
    cat: "Cards",
    desc: "Cartão com imagem que inclina em 3D acompanhando o cursor, com legenda flutuante.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "TiltedCard",
    params: [
      { key: "rotateAmplitude", label: "Amplitude da inclinação", type: "range", min: 0, max: 30, step: 1, default: 14 },
      { key: "scaleOnHover", label: "Zoom no hover", type: "range", min: 1, max: 1.5, step: 0.05, default: 1.1 },
      { key: "showTooltip", label: "Mostrar legenda", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      rotateAmplitude: n(v.rotateAmplitude, 14),
      scaleOnHover: n(v.scaleOnHover, 1.1),
      showTooltip: b(v.showTooltip, true),
    }),
  },

  // ---- Masonry (mosaico animado) --------------------------------------------
  {
    id: "masonry",
    name: "Mosaico Animado",
    cat: "Galeria",
    desc: "Grade mosaico de imagens com entrada animada em GSAP e zoom suave ao passar o mouse.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "Masonry",
    params: [
      {
        key: "animateFrom",
        label: "Entrada",
        type: "select",
        default: "bottom",
        options: [
          ["bottom", "De baixo"],
          ["top", "De cima"],
          ["left", "Da esquerda"],
          ["right", "Da direita"],
          ["center", "Do centro"],
          ["random", "Aleatória"],
        ],
      },
      { key: "duration", label: "Duração", type: "range", min: 0.2, max: 2, step: 0.05, default: 0.6 },
      { key: "stagger", label: "Escalonamento", type: "range", min: 0, max: 0.3, step: 0.01, default: 0.05 },
      { key: "scaleOnHover", label: "Zoom no hover", type: "bool", default: true },
      { key: "hoverScale", label: "Escala do hover", type: "range", min: 0.8, max: 1.2, step: 0.01, default: 0.95 },
      { key: "blurToFocus", label: "Desfoque para foco", type: "bool", default: true },
      { key: "colorShiftOnHover", label: "Cor no hover", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      animateFrom: s(v.animateFrom, "bottom") as "bottom" | "top" | "left" | "right" | "center" | "random",
      duration: n(v.duration, 0.6),
      stagger: n(v.stagger, 0.05),
      scaleOnHover: b(v.scaleOnHover, true),
      hoverScale: n(v.hoverScale, 0.95),
      blurToFocus: b(v.blurToFocus, true),
      colorShiftOnHover: b(v.colorShiftOnHover, false),
    }),
  },

  // ---- GlassSurface (superfície de vidro) -----------------------------------
  {
    id: "glasssurface",
    name: "Superfície de Vidro",
    fullBleed: true, // demo com rolagem interna própria ocupando o palco
    cat: "Vidro",
    desc: "Painel de vidro com distorção SVG, refração de canais RGB, brilho e desfoque ajustáveis.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "GlassSurface",
    params: [
      { key: "width", label: "Largura", type: "range", min: 160, max: 560, step: 10, default: 300 },
      { key: "height", label: "Altura", type: "range", min: 60, max: 320, step: 10, default: 100 },
      { key: "borderRadius", label: "Raio da borda", type: "range", min: 0, max: 60, step: 1, default: 20 },
      { key: "brightness", label: "Brilho", type: "range", min: 0, max: 100, step: 1, default: 50 },
      { key: "opacity", label: "Opacidade", type: "range", min: 0, max: 1, step: 0.01, default: 0.93 },
      { key: "blur", label: "Desfoque", type: "range", min: 0, max: 30, step: 1, default: 11 },
      { key: "displace", label: "Deslocamento", type: "range", min: 0, max: 5, step: 0.1, default: 0 },
    ],
    propsFrom: (v) => ({
      width: n(v.width, 300),
      height: n(v.height, 100),
      borderRadius: n(v.borderRadius, 20),
      brightness: n(v.brightness, 50),
      opacity: n(v.opacity, 0.93),
      blur: n(v.blur, 11),
      displace: n(v.displace, 0),
    }),
  },

  // ---- Dock (barra de atalhos magnética) ------------------------------------
  {
    id: "dock",
    name: "Dock Magnético",
    cat: "Navegação",
    desc: "Barra de atalhos estilo dock em que os ícones crescem ao aproximar o cursor.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "Dock",
    params: [
      { key: "magnification", label: "Ampliação", type: "range", min: 50, max: 120, step: 2, default: 70 },
      { key: "distance", label: "Alcance do cursor", type: "range", min: 80, max: 400, step: 10, default: 200 },
      { key: "baseItemSize", label: "Tamanho base", type: "range", min: 30, max: 80, step: 2, default: 50 },
      { key: "panelHeight", label: "Altura do painel", type: "range", min: 48, max: 100, step: 2, default: 68 },
      { key: "bgColor", label: "Cor de fundo", type: "color", default: "#0c0c0e" },
    ],
    propsFrom: (v) => ({
      magnification: n(v.magnification, 70),
      distance: n(v.distance, 200),
      baseItemSize: n(v.baseItemSize, 50),
      panelHeight: n(v.panelHeight, 68),
      bgColor: s(v.bgColor, "#0c0c0e"),
    }),
  },

  // ---- GooeyNav (navegação gosmenta) ----------------------------------------
  {
    id: "gooeynav",
    name: "Navegação Gosmenta",
    cat: "Navegação",
    desc: "Menu com transição líquida e explosão de partículas ao trocar o item ativo.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "GooeyNav",
    params: [
      { key: "particleCount", label: "Qtd. de partículas", type: "range", min: 5, max: 40, step: 1, default: 15 },
      { key: "animationTime", label: "Tempo da animação", type: "range", min: 200, max: 1500, step: 50, default: 600 },
      { key: "particleR", label: "Raio das partículas", type: "range", min: 30, max: 300, step: 10, default: 100 },
      { key: "timeVariance", label: "Variação de tempo", type: "range", min: 0, max: 800, step: 50, default: 300 },
    ],
    propsFrom: (v) => ({
      particleCount: n(v.particleCount, 15),
      animationTime: n(v.animationTime, 600),
      particleR: n(v.particleR, 100),
      timeVariance: n(v.timeVariance, 300),
    }),
  },

  // ---- PixelCard (cartão de pixels) -----------------------------------------
  {
    id: "pixelcard",
    name: "Cartão de Pixels",
    cat: "Cards",
    desc: "Cartão que ganha uma chuva de pixels coloridos ao passar o cursor ou focar.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "PixelCard",
    params: [
      {
        key: "variant",
        label: "Variante",
        type: "select",
        default: "accent",
        options: [
          ["accent", "Verde-limão"],
          ["default", "Neutra"],
          ["blue", "Azul"],
          ["yellow", "Amarela"],
          ["pink", "Rosa"],
        ],
      },
      { key: "gap", label: "Espaçamento", type: "range", min: 2, max: 12, step: 1, default: 5 },
      { key: "speed", label: "Velocidade", type: "range", min: 10, max: 100, step: 5, default: 35 },
      { key: "noFocus", label: "Ignorar foco", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      variant: s(v.variant, "accent") as "default" | "accent" | "blue" | "yellow" | "pink",
      gap: n(v.gap, 5),
      speed: n(v.speed, 35),
      noFocus: b(v.noFocus, false),
    }),
  },

  // ---- SpotlightCard (cartão holofote) --------------------------------------
  {
    id: "spotlightcard",
    name: "Cartão Holofote",
    cat: "Cards",
    desc: "Cartão escuro com um holofote suave e colorido que acompanha o cursor.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "SpotlightCard",
    params: [
      { key: "spotColor", label: "Cor do holofote", type: "color", default: "#c6ff3a" },
      { key: "intensidade", label: "Intensidade", type: "range", min: 0.05, max: 0.6, step: 0.05, default: 0.25 },
      { key: "backgroundColor", label: "Cor de fundo", type: "color", default: "#0c0c0e" },
    ],
    propsFrom: (v) => ({
      spotlightColor: rgba(s(v.spotColor, "#c6ff3a"), n(v.intensidade, 0.25)),
      backgroundColor: s(v.backgroundColor, "#0c0c0e"),
    }),
  },

  // ---- BorderGlow (borda luminosa) ------------------------------------------
  {
    id: "borderglow",
    name: "Borda Luminosa",
    cat: "Cards",
    desc: "Cartão cuja borda acende um brilho cônico que segue o ângulo do cursor.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "BorderGlow",
    params: [
      { key: "edgeSensitivity", label: "Sensibilidade da borda", type: "range", min: 0, max: 100, step: 1, default: 30 },
      { key: "glowIntensity", label: "Intensidade", type: "range", min: 0.2, max: 2, step: 0.05, default: 1 },
      { key: "glowRadius", label: "Raio do brilho", type: "range", min: 10, max: 80, step: 1, default: 40 },
      { key: "coneSpread", label: "Abertura do cone", type: "range", min: 5, max: 90, step: 1, default: 25 },
      { key: "borderRadius", label: "Raio da borda", type: "range", min: 0, max: 48, step: 1, default: 28 },
      { key: "animated", label: "Varredura inicial", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      edgeSensitivity: n(v.edgeSensitivity, 30),
      glowIntensity: n(v.glowIntensity, 1),
      glowRadius: n(v.glowRadius, 40),
      coneSpread: n(v.coneSpread, 25),
      borderRadius: n(v.borderRadius, 28),
      animated: b(v.animated, true),
    }),
  },

  // ---- Stepper (assistente de passos) ---------------------------------------
  {
    id: "stepper",
    name: "Assistente de Passos",
    cat: "Formulário",
    desc: "Wizard com passos que deslizam animados, indicadores clicáveis e progresso.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "componentes",
    component: "Stepper",
    params: [
      { key: "initialStep", label: "Passo inicial", type: "range", min: 1, max: 4, step: 1, default: 1, reinit: true },
      { key: "disableStepIndicators", label: "Travar indicadores", type: "bool", default: false },
      { key: "accentColor", label: "Cor de destaque", type: "color", default: "#c6ff3a" },
    ],
    propsFrom: (v) => ({
      initialStep: n(v.initialStep, 1),
      disableStepIndicators: b(v.disableStepIndicators, false),
      accentColor: s(v.accentColor, "#c6ff3a"),
    }),
  },

  // ==========================================================================
  // Seção: Animações
  // ==========================================================================

  // ---- GlareHover (brilho ao passar) ----------------------------------------
  {
    id: "glarehover",
    name: "Brilho ao Passar",
    cat: "Hover",
    desc: "Cartão com um facho de brilho que varre a superfície ao passar o cursor.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "GlareHover",
    params: [
      { key: "glareColor", label: "Cor do brilho", type: "color", default: "#ffffff" },
      { key: "glareOpacity", label: "Opacidade", type: "range", min: 0, max: 1, step: 0.05, default: 0.4 },
      { key: "glareAngle", label: "Ângulo", type: "range", min: -90, max: 90, step: 5, default: -45 },
      { key: "glareSize", label: "Tamanho do facho", type: "range", min: 100, max: 500, step: 10, default: 250 },
      { key: "transitionDuration", label: "Duração", type: "range", min: 200, max: 2000, step: 50, default: 650 },
      { key: "playOnce", label: "Tocar uma vez", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      glareColor: s(v.glareColor, "#ffffff"),
      glareOpacity: n(v.glareOpacity, 0.4),
      glareAngle: n(v.glareAngle, -45),
      glareSize: n(v.glareSize, 250),
      transitionDuration: n(v.transitionDuration, 650),
      playOnce: b(v.playOnce, false),
    }),
  },

  // ---- PixelTransition (transição de pixels) --------------------------------
  {
    id: "pixeltransition",
    name: "Transição de Pixels",
    cat: "Hover",
    desc: "Troca de conteúdo com varredura de pixels aleatórios ao passar o cursor.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "PixelTransition",
    params: [
      { key: "gridSize", label: "Tamanho da grade", type: "range", min: 4, max: 24, step: 1, default: 8 },
      { key: "pixelColor", label: "Cor dos pixels", type: "color", default: "#c6ff3a" },
      { key: "animationStepDuration", label: "Duração", type: "range", min: 0.1, max: 1.5, step: 0.05, default: 0.4 },
      { key: "once", label: "Somente uma vez", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      gridSize: n(v.gridSize, 8),
      pixelColor: s(v.pixelColor, "#c6ff3a"),
      animationStepDuration: n(v.animationStepDuration, 0.4),
      once: b(v.once, false),
    }),
  },

  // ---- Antigravity (partículas antigravidade) -------------------------------
  {
    id: "antigravity",
    name: "Antigravidade",
    cat: "Partículas",
    desc: "Partículas 3D que levitam e orbitam o cursor formando um anel magnético.",
    heavy: true,
    gl: true,
    kind: "component",
    section: "animacoes",
    component: "Antigravity",
    params: [
      { key: "count", label: "Qtd. de partículas", type: "range", min: 50, max: 600, step: 10, default: 300 },
      { key: "color", label: "Cor", type: "color", default: "#c6ff3a" },
      { key: "magnetRadius", label: "Raio magnético", type: "range", min: 2, max: 30, step: 1, default: 10 },
      { key: "ringRadius", label: "Raio do anel", type: "range", min: 2, max: 30, step: 1, default: 10 },
      { key: "waveSpeed", label: "Velocidade da onda", type: "range", min: 0, max: 2, step: 0.05, default: 0.4 },
      { key: "particleSize", label: "Tamanho da partícula", type: "range", min: 0.5, max: 5, step: 0.1, default: 2 },
      {
        key: "particleShape",
        label: "Forma",
        type: "select",
        default: "capsule",
        options: [
          ["capsule", "Cápsula"],
          ["sphere", "Esfera"],
          ["box", "Cubo"],
          ["tetrahedron", "Tetraedro"],
        ],
      },
      { key: "autoAnimate", label: "Piloto automático", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      count: n(v.count, 300),
      color: s(v.color, "#c6ff3a"),
      magnetRadius: n(v.magnetRadius, 10),
      ringRadius: n(v.ringRadius, 10),
      waveSpeed: n(v.waveSpeed, 0.4),
      particleSize: n(v.particleSize, 2),
      particleShape: s(v.particleShape, "capsule") as "capsule" | "sphere" | "box" | "tetrahedron",
      autoAnimate: b(v.autoAnimate, true),
    }),
  },

  // ---- LogoLoop (carrossel de logos) ----------------------------------------
  {
    id: "logoloop",
    name: "Carrossel de Logos",
    cat: "Vitrine",
    desc: "Fila infinita de logos deslizando em loop, com esmaecimento nas bordas.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "LogoLoop",
    params: [
      { key: "speed", label: "Velocidade", type: "range", min: 20, max: 300, step: 10, default: 120 },
      {
        key: "direction",
        label: "Direção",
        type: "select",
        default: "left",
        options: [
          ["left", "Esquerda"],
          ["right", "Direita"],
        ],
      },
      { key: "logoHeight", label: "Altura dos logos", type: "range", min: 16, max: 64, step: 2, default: 28 },
      { key: "gap", label: "Espaçamento", type: "range", min: 16, max: 120, step: 4, default: 48 },
      { key: "pauseOnHover", label: "Pausar no hover", type: "bool", default: true },
      { key: "fadeOut", label: "Esmaecer bordas", type: "bool", default: true },
      { key: "scaleOnHover", label: "Ampliar no hover", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      speed: n(v.speed, 120),
      direction: s(v.direction, "left") as "left" | "right",
      logoHeight: n(v.logoHeight, 28),
      gap: n(v.gap, 48),
      pauseOnHover: b(v.pauseOnHover, true),
      fadeOut: b(v.fadeOut, true),
      scaleOnHover: b(v.scaleOnHover, false),
    }),
  },

  // ---- TargetCursor (cursor de mira) ----------------------------------------
  {
    id: "targetcursor",
    name: "Cursor de Mira",
    cat: "Cursor",
    desc: "Cursor de mira que gira em repouso e trava as quinas nos elementos alvo.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "TargetCursor",
    params: [
      { key: "spinDuration", label: "Tempo do giro", type: "range", min: 0.5, max: 6, step: 0.1, default: 2 },
      { key: "hoverDuration", label: "Tempo de trava", type: "range", min: 0.05, max: 1, step: 0.05, default: 0.2 },
      { key: "parallaxOn", label: "Paralaxe", type: "bool", default: true },
      { key: "hideDefaultCursor", label: "Ocultar cursor nativo", type: "bool", default: true },
      { key: "cursorColor", label: "Cor do cursor", type: "color", default: "#ffffff" },
      { key: "cursorColorOnTarget", label: "Cor sobre o alvo", type: "color", default: "#c6ff3a" },
    ],
    propsFrom: (v) => ({
      spinDuration: n(v.spinDuration, 2),
      hoverDuration: n(v.hoverDuration, 0.2),
      parallaxOn: b(v.parallaxOn, true),
      hideDefaultCursor: b(v.hideDefaultCursor, true),
      cursorColor: s(v.cursorColor, "#ffffff"),
      cursorColorOnTarget: s(v.cursorColorOnTarget, "#c6ff3a"),
    }),
  },

  // ---- MagnetLines (linhas magnéticas) --------------------------------------
  {
    id: "magnetlines",
    name: "Linhas Magnéticas",
    cat: "Cursor",
    desc: "Grade de traços que giram apontando para o cursor, como bússolas.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "MagnetLines",
    params: [
      { key: "rows", label: "Linhas", type: "range", min: 5, max: 15, step: 1, default: 9 },
      { key: "columns", label: "Colunas", type: "range", min: 5, max: 15, step: 1, default: 9 },
      { key: "lineColor", label: "Cor dos traços", type: "color", default: "#efefef" },
      { key: "baseAngle", label: "Ângulo base", type: "range", min: -90, max: 90, step: 5, default: -10 },
    ],
    propsFrom: (v) => ({
      rows: n(v.rows, 9),
      columns: n(v.columns, 9),
      lineColor: s(v.lineColor, "#efefef"),
      baseAngle: n(v.baseAngle, -10),
    }),
  },

  // ---- GhostCursor (cursor fantasma) ----------------------------------------
  {
    id: "ghostcursor",
    name: "Cursor Fantasma",
    cat: "Cursor",
    desc: "Rastro de fumaça etérea com bloom que segue o cursor e esmaece ao parar.",
    heavy: true,
    gl: true,
    kind: "component",
    section: "animacoes",
    component: "GhostCursor",
    params: [
      { key: "color", label: "Cor da fumaça", type: "color", default: "#c6ff3a" },
      { key: "trailLength", label: "Comprimento do rastro", type: "range", min: 10, max: 120, step: 5, default: 50, reinit: true },
      { key: "inertia", label: "Inércia", type: "range", min: 0, max: 0.95, step: 0.05, default: 0.5 },
      { key: "bloomStrength", label: "Força do bloom", type: "range", min: 0, max: 1.5, step: 0.05, default: 0.3 },
      { key: "grainIntensity", label: "Grão", type: "range", min: 0, max: 0.3, step: 0.01, default: 0.05 },
      { key: "brightness", label: "Brilho", type: "range", min: 0.2, max: 3, step: 0.1, default: 1 },
    ],
    propsFrom: (v) => ({
      color: s(v.color, "#c6ff3a"),
      trailLength: n(v.trailLength, 50),
      inertia: n(v.inertia, 0.5),
      bloomStrength: n(v.bloomStrength, 0.3),
      grainIntensity: n(v.grainIntensity, 0.05),
      brightness: n(v.brightness, 1),
    }),
  },

  // ---- GradualBlur (desfoque gradual) ---------------------------------------
  {
    id: "gradualblur",
    name: "Desfoque Gradual",
    cat: "Overlay",
    desc: "Faixa de desfoque progressivo que dissolve o conteúdo numa das bordas.",
    fullBleed: true, // a demo É o preview: rolagem interna ocupa o palco todo
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "GradualBlur",
    params: [
      {
        key: "position",
        label: "Posição",
        type: "select",
        default: "bottom",
        options: [
          ["bottom", "Base"],
          ["top", "Topo"],
          ["left", "Esquerda"],
          ["right", "Direita"],
        ],
      },
      { key: "strength", label: "Intensidade", type: "range", min: 0.5, max: 5, step: 0.1, default: 2 },
      { key: "altura", label: "Extensão (rem)", type: "range", min: 4, max: 16, step: 0.5, default: 6 },
      { key: "divCount", label: "Qtd. de faixas", type: "range", min: 2, max: 12, step: 1, default: 5 },
      { key: "exponential", label: "Crescimento exponencial", type: "bool", default: true },
      {
        key: "curve",
        label: "Curva",
        type: "select",
        default: "linear",
        options: [
          ["linear", "Linear"],
          ["bezier", "Bezier"],
          ["ease-in", "Ease-in"],
          ["ease-out", "Ease-out"],
          ["ease-in-out", "Ease-in-out"],
        ],
      },
      { key: "opacity", label: "Opacidade", type: "range", min: 0.2, max: 1, step: 0.05, default: 1 },
    ],
    propsFrom: (v) => ({
      position: s(v.position, "bottom") as "top" | "bottom" | "left" | "right",
      strength: n(v.strength, 2),
      height: `${n(v.altura, 6)}rem`,
      divCount: n(v.divCount, 5),
      exponential: b(v.exponential, true),
      curve: s(v.curve, "linear") as "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out",
      opacity: n(v.opacity, 1),
    }),
  },

  // ---- ClickSpark (faísca de clique) ----------------------------------------
  {
    id: "clickspark",
    name: "Faísca de Clique",
    cat: "Clique",
    desc: "Explosão de faíscas radiais a cada clique dentro da área.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "ClickSpark",
    params: [
      { key: "sparkColor", label: "Cor da faísca", type: "color", default: "#c6ff3a" },
      { key: "sparkCount", label: "Qtd. de faíscas", type: "range", min: 4, max: 20, step: 1, default: 8 },
      { key: "sparkSize", label: "Tamanho", type: "range", min: 4, max: 30, step: 1, default: 10 },
      { key: "sparkRadius", label: "Raio", type: "range", min: 5, max: 60, step: 1, default: 15 },
      { key: "duration", label: "Duração", type: "range", min: 100, max: 1500, step: 50, default: 400 },
      { key: "extraScale", label: "Escala extra", type: "range", min: 0.5, max: 3, step: 0.1, default: 1 },
    ],
    propsFrom: (v) => ({
      sparkColor: s(v.sparkColor, "#c6ff3a"),
      sparkCount: n(v.sparkCount, 8),
      sparkSize: n(v.sparkSize, 10),
      sparkRadius: n(v.sparkRadius, 15),
      duration: n(v.duration, 400),
      extraScale: n(v.extraScale, 1),
    }),
  },

  // ---- Magnet (ímã) ----------------------------------------------------------
  {
    id: "magnet",
    name: "Ímã",
    cat: "Hover",
    desc: "Elemento atraído suavemente pelo cursor dentro de um raio configurável.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "Magnet",
    params: [
      { key: "padding", label: "Raio de atração", type: "range", min: 20, max: 300, step: 10, default: 90 },
      { key: "magnetStrength", label: "Força (maior = mais suave)", type: "range", min: 1, max: 10, step: 0.5, default: 2 },
      { key: "disabled", label: "Desativado", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      padding: n(v.padding, 90),
      magnetStrength: n(v.magnetStrength, 2),
      disabled: b(v.disabled, false),
    }),
  },

  // ---- MetallicPaint (pintura metálica) -------------------------------------
  {
    id: "metallicpaint",
    name: "Pintura Metálica",
    cat: "Shader",
    desc: "Tinta metálica líquida escorrendo dentro de um texto gerado proceduralmente.",
    heavy: true,
    gl: true,
    kind: "component",
    section: "animacoes",
    component: "MetallicPaint",
    params: [
      {
        key: "texto",
        label: "Texto",
        type: "select",
        default: "GL",
        options: [
          ["GL", "GL"],
          ["UI", "UI"],
          ["3D", "3D"],
          ["FX", "FX"],
        ],
      },
      { key: "scale", label: "Escala do padrão", type: "range", min: 1, max: 8, step: 0.5, default: 4 },
      { key: "liquid", label: "Liquidez", type: "range", min: 0, max: 1, step: 0.05, default: 0.75 },
      { key: "speed", label: "Velocidade", type: "range", min: 0, max: 1.5, step: 0.05, default: 0.3 },
      { key: "brightness", label: "Brilho", type: "range", min: 0.5, max: 3, step: 0.1, default: 2 },
      { key: "contrast", label: "Contraste", type: "range", min: 0.1, max: 2, step: 0.05, default: 0.5 },
      { key: "tintColor", label: "Tinta", type: "color", default: "#c6ff3a" },
      { key: "mouseAnimation", label: "Seguir o cursor", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      text: s(v.texto, "GL"),
      scale: n(v.scale, 4),
      liquid: n(v.liquid, 0.75),
      speed: n(v.speed, 0.3),
      brightness: n(v.brightness, 2),
      contrast: n(v.contrast, 0.5),
      tintColor: s(v.tintColor, "#c6ff3a"),
      mouseAnimation: b(v.mouseAnimation, false),
    }),
  },

  // ---- Noise (ruído) ---------------------------------------------------------
  {
    id: "noise",
    name: "Ruído",
    cat: "Textura",
    desc: "Grão de filme animado cobrindo a área, com escala e opacidade ajustáveis.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "Noise",
    params: [
      { key: "patternSize", label: "Tamanho do padrão", type: "range", min: 50, max: 500, step: 10, default: 250 },
      { key: "patternScaleX", label: "Escala X", type: "range", min: 0.5, max: 4, step: 0.1, default: 1 },
      { key: "patternScaleY", label: "Escala Y", type: "range", min: 0.5, max: 4, step: 0.1, default: 1 },
      { key: "patternRefreshInterval", label: "Intervalo de troca", type: "range", min: 1, max: 10, step: 1, default: 2 },
      { key: "patternAlpha", label: "Opacidade do grão", type: "range", min: 5, max: 80, step: 1, default: 15 },
    ],
    propsFrom: (v) => ({
      patternSize: n(v.patternSize, 250),
      patternScaleX: n(v.patternScaleX, 1),
      patternScaleY: n(v.patternScaleY, 1),
      patternRefreshInterval: n(v.patternRefreshInterval, 2),
      patternAlpha: n(v.patternAlpha, 15),
    }),
  },

  // ---- ShapeBlur (forma revelada) -------------------------------------------
  {
    id: "shapeblur",
    name: "Forma Revelada",
    cat: "Shader",
    desc: "Forma em SDF cujo contorno é revelado por um círculo suave que segue o cursor.",
    heavy: false,
    gl: true,
    kind: "component",
    section: "animacoes",
    component: "ShapeBlur",
    params: [
      {
        key: "variation",
        label: "Forma",
        type: "select",
        default: "0",
        options: [
          ["0", "Retângulo"],
          ["1", "Círculo"],
          ["2", "Anel"],
          ["3", "Triângulo"],
        ],
      },
      { key: "shapeSize", label: "Tamanho da forma", type: "range", min: 0.2, max: 2, step: 0.05, default: 1.2 },
      { key: "roundness", label: "Arredondamento", type: "range", min: 0, max: 1, step: 0.05, default: 0.4 },
      { key: "borderSize", label: "Espessura do traço", type: "range", min: 0.01, max: 0.3, step: 0.01, default: 0.05 },
      { key: "circleSize", label: "Tamanho do revelador", type: "range", min: 0.05, max: 1, step: 0.05, default: 0.3 },
      { key: "circleEdge", label: "Suavidade do revelador", type: "range", min: 0.1, max: 1.5, step: 0.05, default: 0.5 },
      { key: "color", label: "Cor", type: "color", default: "#c6ff3a" },
    ],
    propsFrom: (v) => ({
      variation: Number(s(v.variation, "0")) || 0,
      shapeSize: n(v.shapeSize, 1.2),
      roundness: n(v.roundness, 0.4),
      borderSize: n(v.borderSize, 0.05),
      circleSize: n(v.circleSize, 0.3),
      circleEdge: n(v.circleEdge, 0.5),
      color: s(v.color, "#c6ff3a"),
    }),
  },

  // ---- StarBorder (borda estelar) -------------------------------------------
  {
    id: "starborder",
    name: "Borda Estelar",
    cat: "Borda",
    desc: "Botão com pontos de luz percorrendo a borda em sentidos opostos.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "animacoes",
    component: "StarBorder",
    params: [
      { key: "color", label: "Cor da luz", type: "color", default: "#c6ff3a" },
      { key: "velocidade", label: "Ciclo (s)", type: "range", min: 1, max: 12, step: 0.5, default: 6 },
      { key: "thickness", label: "Espessura", type: "range", min: 1, max: 10, step: 1, default: 1 },
    ],
    propsFrom: (v) => ({
      color: s(v.color, "#c6ff3a"),
      speed: `${n(v.velocidade, 6)}s`,
      thickness: n(v.thickness, 1),
    }),
  },

  // ---- MetaBalls (meta bolhas) ----------------------------------------------
  {
    id: "metaballs",
    name: "Meta Bolhas",
    cat: "Partículas",
    desc: "Bolhas líquidas que se fundem organicamente e seguem o cursor, em WebGL.",
    heavy: true,
    gl: true,
    kind: "component",
    section: "animacoes",
    component: "MetaBalls",
    params: [
      { key: "color", label: "Cor das bolhas", type: "color", default: "#c6ff3a" },
      { key: "cursorBallColor", label: "Cor da bolha do cursor", type: "color", default: "#c6ff3a" },
      { key: "speed", label: "Velocidade", type: "range", min: 0.05, max: 1, step: 0.05, default: 0.3 },
      { key: "ballCount", label: "Qtd. de bolhas", type: "range", min: 3, max: 30, step: 1, default: 15 },
      { key: "animationSize", label: "Tamanho da área", type: "range", min: 10, max: 60, step: 2, default: 30 },
      { key: "clumpFactor", label: "Aglomeração", type: "range", min: 0.5, max: 2, step: 0.1, default: 1 },
      { key: "cursorBallSize", label: "Bolha do cursor", type: "range", min: 1, max: 8, step: 0.5, default: 3 },
      { key: "enableMouseInteraction", label: "Reagir ao mouse", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      color: s(v.color, "#c6ff3a"),
      cursorBallColor: s(v.cursorBallColor, "#c6ff3a"),
      speed: n(v.speed, 0.3),
      ballCount: n(v.ballCount, 15),
      animationSize: n(v.animationSize, 30),
      clumpFactor: n(v.clumpFactor, 1),
      cursorBallSize: n(v.cursorBallSize, 3),
      enableMouseInteraction: b(v.enableMouseInteraction, true),
    }),
  },

  // ==========================================================================
  // Seção: Animações de texto
  // ==========================================================================

  // ---- CurvedLoop (letreiro curvo) ------------------------------------------
  {
    id: "curvedloop",
    name: "Letreiro Curvo",
    cat: "Marquee",
    desc: "Texto em loop infinito deslizando sobre uma curva, arrastável com o ponteiro.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "CurvedLoop",
    params: [
      { key: "speed", label: "Velocidade", type: "range", min: 0.5, max: 8, step: 0.5, default: 2 },
      { key: "curveAmount", label: "Curvatura", type: "range", min: 0, max: 800, step: 20, default: 400 },
      {
        key: "direction",
        label: "Direção",
        type: "select",
        default: "left",
        options: [
          ["left", "Esquerda"],
          ["right", "Direita"],
        ],
      },
      { key: "interactive", label: "Arrastável", type: "bool", default: true },
      { key: "textColor", label: "Cor do texto", type: "color", default: "#ededed" },
    ],
    propsFrom: (v) => ({
      speed: n(v.speed, 2),
      curveAmount: n(v.curveAmount, 400),
      direction: s(v.direction, "left") as "left" | "right",
      interactive: b(v.interactive, true),
      textColor: s(v.textColor, "#ededed"),
    }),
  },

  // ---- SplitText (texto fatiado) --------------------------------------------
  {
    id: "splittext",
    name: "Texto Fatiado",
    cat: "Entrada",
    desc: "Letras ou palavras entram animadas uma a uma com GSAP.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "SplitText",
    params: [
      {
        key: "splitType",
        label: "Fatiar por",
        type: "select",
        default: "chars",
        options: [
          ["chars", "Letras"],
          ["words", "Palavras"],
          ["lines", "Linhas"],
        ],
      },
      { key: "delay", label: "Atraso entre itens (ms)", type: "range", min: 10, max: 300, step: 10, default: 50 },
      { key: "duration", label: "Duração", type: "range", min: 0.2, max: 3, step: 0.05, default: 1.25 },
    ],
    propsFrom: (v) => ({
      splitType: s(v.splitType, "chars") as "chars" | "words" | "lines",
      delay: n(v.delay, 50),
      duration: n(v.duration, 1.25),
    }),
  },

  // ---- BlurText (texto desfocado) -------------------------------------------
  {
    id: "blurtext",
    name: "Texto Desfocado",
    cat: "Entrada",
    desc: "Texto que entra do desfoque para o foco, palavra a palavra ou letra a letra.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "BlurText",
    params: [
      {
        key: "animateBy",
        label: "Animar por",
        type: "select",
        default: "words",
        options: [
          ["words", "Palavras"],
          ["letters", "Letras"],
        ],
      },
      {
        key: "direction",
        label: "Direção",
        type: "select",
        default: "top",
        options: [
          ["top", "De cima"],
          ["bottom", "De baixo"],
        ],
      },
      { key: "delay", label: "Atraso entre itens (ms)", type: "range", min: 50, max: 500, step: 25, default: 200 },
      { key: "stepDuration", label: "Duração do passo", type: "range", min: 0.1, max: 1, step: 0.05, default: 0.35 },
    ],
    propsFrom: (v) => ({
      animateBy: s(v.animateBy, "words") as "words" | "letters",
      direction: s(v.direction, "top") as "top" | "bottom",
      delay: n(v.delay, 200),
      stepDuration: n(v.stepDuration, 0.35),
    }),
  },

  // ---- TextType (máquina de escrever) ---------------------------------------
  {
    id: "texttype",
    name: "Máquina de Escrever",
    cat: "Digitação",
    desc: "Digitação e apagamento cíclicos de frases, com cursor piscante.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "TextType",
    params: [
      { key: "typingSpeed", label: "Velocidade de digitação", type: "range", min: 10, max: 200, step: 5, default: 50 },
      { key: "deletingSpeed", label: "Velocidade de apagar", type: "range", min: 10, max: 150, step: 5, default: 30 },
      { key: "pauseDuration", label: "Pausa entre frases (ms)", type: "range", min: 500, max: 5000, step: 100, default: 2000 },
      { key: "showCursor", label: "Mostrar cursor", type: "bool", default: true },
      { key: "cursorBlinkDuration", label: "Piscar do cursor (s)", type: "range", min: 0.2, max: 2, step: 0.1, default: 0.5 },
      { key: "loop", label: "Repetir", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      typingSpeed: n(v.typingSpeed, 50),
      deletingSpeed: n(v.deletingSpeed, 30),
      pauseDuration: n(v.pauseDuration, 2000),
      showCursor: b(v.showCursor, true),
      cursorBlinkDuration: n(v.cursorBlinkDuration, 0.5),
      loop: b(v.loop, true),
    }),
  },

  // ---- GradientText (texto em gradiente) ------------------------------------
  {
    id: "gradienttext",
    name: "Texto em Gradiente",
    cat: "Estilo",
    desc: "Gradiente animado percorrendo o texto, com direção, ritmo e vaivém ajustáveis.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "GradientText",
    params: [
      { key: "cor1", label: "Cor 1", type: "color", default: "#c6ff3a" },
      { key: "cor2", label: "Cor 2", type: "color", default: "#ededed" },
      { key: "cor3", label: "Cor 3", type: "color", default: "#c6ff3a" },
      { key: "animationSpeed", label: "Duração do ciclo (s)", type: "range", min: 1, max: 20, step: 0.5, default: 8 },
      {
        key: "direction",
        label: "Direção",
        type: "select",
        default: "horizontal",
        options: [
          ["horizontal", "Horizontal"],
          ["vertical", "Vertical"],
          ["diagonal", "Diagonal"],
        ],
      },
      { key: "showBorder", label: "Mostrar borda", type: "bool", default: false },
      { key: "pauseOnHover", label: "Pausar no hover", type: "bool", default: false },
      { key: "yoyo", label: "Vaivém", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      colors: [s(v.cor1, "#c6ff3a"), s(v.cor2, "#ededed"), s(v.cor3, "#c6ff3a")],
      animationSpeed: n(v.animationSpeed, 8),
      direction: s(v.direction, "horizontal") as "horizontal" | "vertical" | "diagonal",
      showBorder: b(v.showBorder, false),
      pauseOnHover: b(v.pauseOnHover, false),
      yoyo: b(v.yoyo, true),
    }),
  },

  // ---- DecryptedText (texto criptografado) ----------------------------------
  {
    id: "decryptedtext",
    name: "Texto Criptografado",
    cat: "Revelação",
    desc: "Caracteres embaralhados que se decifram e revelam o texto em sequência.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "DecryptedText",
    params: [
      { key: "speed", label: "Intervalo (ms)", type: "range", min: 10, max: 200, step: 5, default: 50 },
      { key: "maxIterations", label: "Iterações máx.", type: "range", min: 1, max: 40, step: 1, default: 10 },
      { key: "sequential", label: "Sequencial", type: "bool", default: true },
      {
        key: "revealDirection",
        label: "Direção da revelação",
        type: "select",
        default: "start",
        options: [
          ["start", "Início"],
          ["end", "Fim"],
          ["center", "Centro"],
        ],
      },
      {
        key: "animateOn",
        label: "Disparo",
        type: "select",
        default: "view",
        options: [
          ["view", "Ao aparecer"],
          ["hover", "No hover"],
          ["click", "No clique"],
        ],
      },
    ],
    propsFrom: (v) => ({
      speed: n(v.speed, 50),
      maxIterations: n(v.maxIterations, 10),
      sequential: b(v.sequential, true),
      revealDirection: s(v.revealDirection, "start") as "start" | "end" | "center",
      animateOn: s(v.animateOn, "view") as "view" | "hover" | "inViewHover" | "click",
    }),
  },

  // ---- ASCIIText (texto ASCII) ----------------------------------------------
  {
    id: "asciitext",
    name: "Texto ASCII",
    cat: "Retrô",
    desc: "Texto 3D ondulante renderizado como uma grade de caracteres ASCII.",
    heavy: true,
    gl: true,
    kind: "component",
    section: "texto",
    component: "ASCIIText",
    params: [
      { key: "asciiFontSize", label: "Tamanho do caractere", type: "range", min: 4, max: 16, step: 1, default: 8 },
      { key: "textFontSize", label: "Tamanho do texto", type: "range", min: 80, max: 400, step: 10, default: 200 },
      { key: "textColor", label: "Cor do texto", type: "color", default: "#fdf9f3" },
      { key: "planeBaseHeight", label: "Altura do plano", type: "range", min: 4, max: 16, step: 0.5, default: 8 },
      { key: "enableWaves", label: "Ondulação", type: "bool", default: true },
    ],
    propsFrom: (v) => ({
      asciiFontSize: n(v.asciiFontSize, 8),
      textFontSize: n(v.textFontSize, 200),
      textColor: s(v.textColor, "#fdf9f3"),
      planeBaseHeight: n(v.planeBaseHeight, 8),
      enableWaves: b(v.enableWaves, true),
    }),
  },

  // ---- VariableProximity (fonte variável) -----------------------------------
  {
    id: "variableproximity",
    name: "Fonte Variável",
    cat: "Cursor",
    desc: "O peso da fonte varia conforme a proximidade do cursor a cada letra.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "VariableProximity",
    params: [
      { key: "radius", label: "Raio de influência", type: "range", min: 40, max: 300, step: 10, default: 100 },
      {
        key: "falloff",
        label: "Queda",
        type: "select",
        default: "linear",
        options: [
          ["linear", "Linear"],
          ["exponential", "Exponencial"],
          ["gaussian", "Gaussiana"],
        ],
      },
    ],
    propsFrom: (v) => ({
      radius: n(v.radius, 100),
      falloff: s(v.falloff, "linear") as "linear" | "exponential" | "gaussian",
    }),
  },

  // ---- ShinyText (texto brilhante) ------------------------------------------
  {
    id: "shinytext",
    name: "Texto Brilhante",
    cat: "Estilo",
    desc: "Facho de brilho deslizando pelo texto em loop, com ângulo e ritmo ajustáveis.",
    heavy: false,
    gl: false,
    kind: "component",
    section: "texto",
    component: "ShinyText",
    params: [
      { key: "speed", label: "Duração da passada (s)", type: "range", min: 0.5, max: 8, step: 0.25, default: 2 },
      { key: "color", label: "Cor do texto", type: "color", default: "#b5b5b5" },
      { key: "shineColor", label: "Cor do brilho", type: "color", default: "#ffffff" },
      { key: "spread", label: "Abertura do facho", type: "range", min: 30, max: 360, step: 10, default: 120 },
      {
        key: "direction",
        label: "Direção",
        type: "select",
        default: "left",
        options: [
          ["left", "Esquerda"],
          ["right", "Direita"],
        ],
      },
      { key: "yoyo", label: "Vaivém", type: "bool", default: false },
      { key: "pauseOnHover", label: "Pausar no hover", type: "bool", default: false },
    ],
    propsFrom: (v) => ({
      speed: n(v.speed, 2),
      color: s(v.color, "#b5b5b5"),
      shineColor: s(v.shineColor, "#ffffff"),
      spread: n(v.spread, 120),
      direction: s(v.direction, "left") as "left" | "right",
      yoyo: b(v.yoyo, false),
      pauseOnHover: b(v.pauseOnHover, false),
    }),
  },
];

export function isDemoEffect(id: string): boolean {
  return DEMO_EFFECTS.some((e) => e.id === id);
}

export function getDemoEffect(id: string): DemoEffect | undefined {
  return DEMO_EFFECTS.find((e) => e.id === id);
}
