import type { BackgroundEffect } from "./types";

// ============================================================================
// Catálogo gerado a partir do motor (engine.js). Metadados dos 43 fundos.
// Regenere com: node scripts/gen-backgrounds.mjs
// ============================================================================

export const BACKGROUND_CATALOG: BackgroundEffect[] = [
  {
    "id": "fluid",
    "name": "Simulação de Fluido",
    "cat": "Fluido",
    "desc": "Navier-Stokes na GPU (WebGL) com respingos coloridos automáticos. Reage ao mouse.",
    "heavy": true,
    "gl": true,
    "params": [
      {
        "key": "simSpeed",
        "label": "Velocidade do fluido",
        "type": "range",
        "min": 0.15,
        "max": 1.5,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "auto",
        "label": "Pulsos automáticos",
        "type": "bool",
        "default": true
      },
      {
        "key": "trail",
        "label": "Rastro de cor",
        "type": "range",
        "min": 0.9,
        "max": 0.995,
        "step": 0.001,
        "default": 0.97
      },
      {
        "key": "velDiss",
        "label": "Dissipação",
        "type": "range",
        "min": 0.9,
        "max": 0.999,
        "step": 0.001,
        "default": 0.98
      },
      {
        "key": "curl",
        "label": "Turbulência",
        "type": "range",
        "min": 0,
        "max": 50,
        "step": 1,
        "default": 30
      },
      {
        "key": "radius",
        "label": "Raio do respingo",
        "type": "range",
        "min": 0.05,
        "max": 0.6,
        "step": 0.01,
        "default": 0.25
      },
      {
        "key": "force",
        "label": "Força",
        "type": "range",
        "min": 1000,
        "max": 10000,
        "step": 100,
        "default": 6000
      },
      {
        "key": "interval",
        "label": "Intervalo auto (s)",
        "type": "range",
        "min": 0.1,
        "max": 1.5,
        "step": 0.05,
        "default": 0.55
      },
      {
        "key": "bright",
        "label": "Brilho",
        "type": "range",
        "min": 0.3,
        "max": 2.5,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "mode",
        "label": "Cores",
        "type": "select",
        "options": [
          [
            "rainbow",
            "Arco-íris"
          ],
          [
            "palette",
            "Paleta"
          ]
        ],
        "default": "rainbow"
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ff3d81"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#3d6bff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#00e5ff"
      }
    ]
  },
  {
    "id": "pipeline",
    "name": "Pipeline",
    "cat": "Linhas",
    "desc": "Tubos luminosos que percorrem a tela em curvas de 45°, deixando rastros (Ambient Canvas).",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de tubos",
        "type": "range",
        "min": 5,
        "max": 90,
        "step": 1,
        "default": 30,
        "reinit": true
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0.2,
        "max": 4,
        "step": 0.1,
        "default": 1
      },
      {
        "key": "width",
        "label": "Espessura",
        "type": "range",
        "min": 1,
        "max": 10,
        "step": 0.5,
        "default": 4
      },
      {
        "key": "hue",
        "label": "Matiz base",
        "type": "range",
        "min": 0,
        "max": 360,
        "step": 1,
        "default": 180
      },
      {
        "key": "hueRange",
        "label": "Variação matiz",
        "type": "range",
        "min": 0,
        "max": 180,
        "step": 1,
        "default": 60
      },
      {
        "key": "turn",
        "label": "Curvas",
        "type": "range",
        "min": 10,
        "max": 120,
        "step": 1,
        "default": 58
      },
      {
        "key": "glow",
        "label": "Intensidade",
        "type": "range",
        "min": 0.03,
        "max": 0.4,
        "step": 0.005,
        "default": 0.125
      },
      {
        "key": "blur",
        "label": "Brilho/Blur",
        "type": "range",
        "min": 0,
        "max": 26,
        "step": 1,
        "default": 12
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#000603"
      }
    ]
  },
  {
    "id": "mesh",
    "name": "Mesh Gradient",
    "cat": "Gradiente",
    "desc": "Manchas de cor suaves que flutuam e se fundem com desfoque, gradiente em malha.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de manchas",
        "type": "range",
        "min": 3,
        "max": 14,
        "step": 1,
        "default": 6
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 0.2,
        "max": 1.3,
        "step": 0.02,
        "default": 0.75
      },
      {
        "key": "blur",
        "label": "Desfoque",
        "type": "range",
        "min": 0,
        "max": 90,
        "step": 1,
        "default": 36
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#0a0a18"
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ff2e93"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#7c5cff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "c4",
        "label": "Cor 4",
        "type": "color",
        "default": "#22e3a0"
      }
    ]
  },
  {
    "id": "blobs",
    "name": "Lava / Blobs",
    "cat": "Gradiente",
    "desc": "Bolhas coloridas que sobem e flutuam como uma lâmpada de lava, bem desfocadas.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de bolhas",
        "type": "range",
        "min": 3,
        "max": 20,
        "step": 1,
        "default": 9
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 0.1,
        "max": 0.7,
        "step": 0.01,
        "default": 0.32
      },
      {
        "key": "blur",
        "label": "Desfoque",
        "type": "range",
        "min": 0,
        "max": 90,
        "step": 1,
        "default": 48
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#06060f"
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ff5e3a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff2d95"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#9b5cff"
      }
    ]
  },
  {
    "id": "aurora",
    "name": "Aurora",
    "cat": "Gradiente",
    "desc": "Cortinas de luz onduladas como uma aurora boreal, suaves e desfocadas.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "amp",
        "label": "Ondulação",
        "type": "range",
        "min": 0.05,
        "max": 0.5,
        "step": 0.01,
        "default": 0.22
      },
      {
        "key": "bands",
        "label": "Camadas",
        "type": "range",
        "min": 1,
        "max": 5,
        "step": 1,
        "default": 3
      },
      {
        "key": "blur",
        "label": "Desfoque",
        "type": "range",
        "min": 0,
        "max": 60,
        "step": 1,
        "default": 22
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#02030a"
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#27ffb0"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#3aa0ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#b85cff"
      }
    ]
  },
  {
    "id": "conic",
    "name": "Gradiente Cônico",
    "cat": "Gradiente",
    "desc": "Leque de cores girando a partir do centro, com leve desfoque sedoso.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": -3,
        "max": 3,
        "step": 0.05,
        "default": 0.6
      },
      {
        "key": "blur",
        "label": "Desfoque",
        "type": "range",
        "min": 0,
        "max": 60,
        "step": 1,
        "default": 8
      },
      {
        "key": "cx",
        "label": "Centro X",
        "type": "range",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "default": 0.5
      },
      {
        "key": "cy",
        "label": "Centro Y",
        "type": "range",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "default": 0.5
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ff3d81"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ffb000"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "c4",
        "label": "Cor 4",
        "type": "color",
        "default": "#7c5cff"
      }
    ]
  },
  {
    "id": "network",
    "name": "Constelação",
    "cat": "Partículas",
    "desc": "Pontos que flutuam e se conectam por linhas quando próximos. Reage ao mouse.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de pontos",
        "type": "range",
        "min": 20,
        "max": 220,
        "step": 1,
        "default": 90
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "dist",
        "label": "Alcance das linhas",
        "type": "range",
        "min": 0.05,
        "max": 0.3,
        "step": 0.005,
        "default": 0.13
      },
      {
        "key": "dotSize",
        "label": "Tamanho do ponto",
        "type": "range",
        "min": 0.5,
        "max": 3.5,
        "step": 0.1,
        "default": 1.6
      },
      {
        "key": "dot",
        "label": "Cor dos pontos",
        "type": "color",
        "default": "#ffffff"
      },
      {
        "key": "line",
        "label": "Cor das linhas",
        "type": "color",
        "default": "#7c5cff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#070710"
      }
    ]
  },
  {
    "id": "matrix",
    "name": "Matrix Glitch",
    "cat": "Partículas",
    "desc": "Chuva digital de glifos caindo com falhas/glitch. Inspirado no componente MatrixGlitch.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "size",
        "label": "Tamanho da fonte",
        "type": "range",
        "min": 8,
        "max": 28,
        "step": 1,
        "default": 15
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0.2,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "fade",
        "label": "Rastro",
        "type": "range",
        "min": 0.03,
        "max": 0.4,
        "step": 0.01,
        "default": 0.09
      },
      {
        "key": "glitch",
        "label": "Glitch",
        "type": "range",
        "min": 0,
        "max": 1,
        "step": 0.02,
        "default": 0.4
      },
      {
        "key": "color",
        "label": "Cor",
        "type": "color",
        "default": "#27ff7a"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#020806"
      }
    ]
  },
  {
    "id": "starfield",
    "name": "Hiperespaço",
    "cat": "Partículas",
    "desc": "Estrelas que correm em direção a você em velocidade de dobra, deixando rastros.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de estrelas",
        "type": "range",
        "min": 80,
        "max": 900,
        "step": 10,
        "default": 380
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0.1,
        "max": 4,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 0.5,
        "max": 4,
        "step": 0.1,
        "default": 2
      },
      {
        "key": "spread",
        "label": "Abertura",
        "type": "range",
        "min": 0.4,
        "max": 2,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "trail",
        "label": "Rastro",
        "type": "range",
        "min": 0.08,
        "max": 0.6,
        "step": 0.02,
        "default": 0.32
      },
      {
        "key": "color",
        "label": "Cor",
        "type": "color",
        "default": "#cfe6ff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#01020a"
      }
    ]
  },
  {
    "id": "fireflies",
    "name": "Vaga-lumes",
    "cat": "Partículas",
    "desc": "Pontos de luz que vagam suavemente pelo ruído e cintilam no escuro.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd.",
        "type": "range",
        "min": 20,
        "max": 300,
        "step": 5,
        "default": 120
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 0.5,
        "max": 4,
        "step": 0.1,
        "default": 1.6
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ffe27a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#7afff0"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#05060a"
      }
    ]
  },
  {
    "id": "snow",
    "name": "Neve",
    "cat": "Partículas",
    "desc": "Flocos caindo suavemente com balanço lateral. Tranquilo e minimalista.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de flocos",
        "type": "range",
        "min": 30,
        "max": 500,
        "step": 10,
        "default": 180
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0.2,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 0.5,
        "max": 4,
        "step": 0.1,
        "default": 1.8
      },
      {
        "key": "wind",
        "label": "Vento",
        "type": "range",
        "min": -2,
        "max": 2,
        "step": 0.1,
        "default": 0.4
      },
      {
        "key": "color",
        "label": "Cor",
        "type": "color",
        "default": "#ffffff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#0a1020"
      }
    ]
  },
  {
    "id": "bubbles",
    "name": "Bolhas",
    "cat": "Partículas",
    "desc": "Bolhas translúcidas que sobem com leve oscilação e brilho.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de bolhas",
        "type": "range",
        "min": 10,
        "max": 160,
        "step": 5,
        "default": 50
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0.2,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 2,
        "max": 30,
        "step": 1,
        "default": 12
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#39d0ff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#a06bff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#04101c"
      }
    ]
  },
  {
    "id": "flowlines",
    "name": "Campo de Fluxo",
    "cat": "Geométrico",
    "desc": "Milhares de partículas seguindo um campo de ruído, formando correntes sedosas.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd.",
        "type": "range",
        "min": 200,
        "max": 2200,
        "step": 50,
        "default": 800
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Escala do campo",
        "type": "range",
        "min": 0.0006,
        "max": 0.005,
        "step": 0.0001,
        "default": 0.0016
      },
      {
        "key": "turns",
        "label": "Curvatura",
        "type": "range",
        "min": 1,
        "max": 5,
        "step": 0.1,
        "default": 2
      },
      {
        "key": "step",
        "label": "Passo",
        "type": "range",
        "min": 0.5,
        "max": 3,
        "step": 0.1,
        "default": 1.4
      },
      {
        "key": "width",
        "label": "Espessura",
        "type": "range",
        "min": 0.5,
        "max": 3,
        "step": 0.1,
        "default": 1
      },
      {
        "key": "fade",
        "label": "Rastro",
        "type": "range",
        "min": 0.02,
        "max": 0.3,
        "step": 0.01,
        "default": 0.06
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff3d9a"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#05060d"
      }
    ]
  },
  {
    "id": "sinewaves",
    "name": "Ondas",
    "cat": "Geométrico",
    "desc": "Camadas de ondas senoidais translúcidas deslizando umas sobre as outras.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "layers",
        "label": "Camadas",
        "type": "range",
        "min": 1,
        "max": 6,
        "step": 1,
        "default": 3
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "amp",
        "label": "Amplitude",
        "type": "range",
        "min": 0.05,
        "max": 0.4,
        "step": 0.01,
        "default": 0.18
      },
      {
        "key": "freq",
        "label": "Frequência",
        "type": "range",
        "min": 0.5,
        "max": 4,
        "step": 0.1,
        "default": 1.5
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#7c5cff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ff4d9d"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#06061a"
      }
    ]
  },
  {
    "id": "lowpoly",
    "name": "Low Poly",
    "cat": "Geométrico",
    "desc": "Malha de triângulos que ondula e muda de tom como um cristal animado.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "cell",
        "label": "Tamanho do triângulo",
        "type": "range",
        "min": 28,
        "max": 130,
        "step": 2,
        "default": 62
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "warp",
        "label": "Distorção",
        "type": "range",
        "min": 0,
        "max": 1,
        "step": 0.02,
        "default": 0.5
      },
      {
        "key": "stroke",
        "label": "Contorno",
        "type": "bool",
        "default": true
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#1b1147"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff5ea8"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#0a0a16"
      }
    ]
  },
  {
    "id": "hexpulse",
    "name": "Favo Pulsante",
    "cat": "Geométrico",
    "desc": "Grade de hexágonos que pulsa em ondas a partir do centro.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "size",
        "label": "Tamanho do hex",
        "type": "range",
        "min": 14,
        "max": 64,
        "step": 2,
        "default": 28
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "glow",
        "label": "Intensidade",
        "type": "range",
        "min": 0.1,
        "max": 0.9,
        "step": 0.02,
        "default": 0.5
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#0b1e3a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#22e5ff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#05080f"
      }
    ]
  },
  {
    "id": "ripples",
    "name": "Ondulações",
    "cat": "Geométrico",
    "desc": "Anéis concêntricos que se expandem pela tela. Reage ao mouse.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0.3,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "rate",
        "label": "Frequência",
        "type": "range",
        "min": 0.02,
        "max": 0.5,
        "step": 0.01,
        "default": 0.12
      },
      {
        "key": "width",
        "label": "Espessura",
        "type": "range",
        "min": 0.5,
        "max": 4,
        "step": 0.1,
        "default": 1.5
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#36e3ff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#b06bff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#04060e"
      }
    ]
  },
  {
    "id": "synthgrid",
    "name": "Grade Synthwave",
    "cat": "Geométrico",
    "desc": "Grade em perspectiva correndo até o horizonte com sol retrô. Estética anos 80.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "density",
        "label": "Densidade",
        "type": "range",
        "min": 6,
        "max": 30,
        "step": 1,
        "default": 14
      },
      {
        "key": "grid",
        "label": "Cor da grade",
        "type": "color",
        "default": "#ff3d9a"
      },
      {
        "key": "sun1",
        "label": "Sol (topo)",
        "type": "color",
        "default": "#ffe24d"
      },
      {
        "key": "sun2",
        "label": "Sol (base)",
        "type": "color",
        "default": "#ff2d95"
      },
      {
        "key": "sky1",
        "label": "Céu (topo)",
        "type": "color",
        "default": "#0a0524"
      },
      {
        "key": "sky2",
        "label": "Céu (horizonte)",
        "type": "color",
        "default": "#3a0f5e"
      }
    ]
  },
  {
    "id": "kaleido",
    "name": "Caleidoscópio",
    "cat": "Geométrico",
    "desc": "Padrões coloridos espelhados em simetria radial, girando lentamente.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "segments",
        "label": "Segmentos",
        "type": "range",
        "min": 3,
        "max": 16,
        "step": 1,
        "default": 8
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Escala",
        "type": "range",
        "min": 0.5,
        "max": 1.6,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "blur",
        "label": "Suavização (blur)",
        "type": "range",
        "min": 0,
        "max": 40,
        "step": 1,
        "default": 3
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ff3d81"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#3dd6ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ffe14d"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#08040f"
      }
    ]
  },
  {
    "id": "voronoi",
    "name": "Voronoi",
    "cat": "Geométrico",
    "desc": "Mosaico de células orgânicas que se movem e respiram, tipo vitral.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd. de células",
        "type": "range",
        "min": 4,
        "max": 32,
        "step": 1,
        "default": 13
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "edge",
        "label": "Bordas",
        "type": "range",
        "min": 0,
        "max": 1,
        "step": 0.02,
        "default": 0.55
      },
      {
        "key": "blur",
        "label": "Suavização (blur)",
        "type": "range",
        "min": 0,
        "max": 18,
        "step": 1,
        "default": 5
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#1a0b3a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff2e7e"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#21d4fd"
      }
    ]
  },
  {
    "id": "spiro",
    "name": "Spirograph",
    "cat": "Geométrico",
    "desc": "Curva harmonográfica luminosa que se redesenha em laços hipnóticos.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "freqA",
        "label": "Frequência A",
        "type": "range",
        "min": 1,
        "max": 7,
        "step": 1,
        "default": 3
      },
      {
        "key": "freqB",
        "label": "Frequência B",
        "type": "range",
        "min": 1,
        "max": 7,
        "step": 1,
        "default": 4
      },
      {
        "key": "loops",
        "label": "Voltas",
        "type": "range",
        "min": 1,
        "max": 9,
        "step": 1,
        "default": 5
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "width",
        "label": "Espessura",
        "type": "range",
        "min": 0.5,
        "max": 3,
        "step": 0.1,
        "default": 1.2
      },
      {
        "key": "fade",
        "label": "Rastro",
        "type": "range",
        "min": 0.02,
        "max": 0.4,
        "step": 0.01,
        "default": 0.08
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff3d9a"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#04040c"
      }
    ]
  },
  {
    "id": "plasma",
    "name": "Plasma",
    "cat": "Shader",
    "desc": "Plasma clássico de demoscene, ondas de cor fundindo-se na GPU.",
    "heavy": false,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Escala",
        "type": "range",
        "min": 2,
        "max": 40,
        "step": 1,
        "default": 12
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#3a0ca3"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff3d81"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#00e5ff"
      }
    ]
  },
  {
    "id": "noiseflow",
    "name": "Seda (Fluxo de Ruído)",
    "cat": "Shader",
    "desc": "Domain warping de ruído fractal, superfície sedosa que escorre devagar.",
    "heavy": false,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Escala",
        "type": "range",
        "min": 1,
        "max": 6,
        "step": 0.1,
        "default": 2.2
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#06121f"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#1f7a8c"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ffd6a0"
      }
    ]
  },
  {
    "id": "tunnel",
    "name": "Túnel",
    "cat": "Shader",
    "desc": "Mergulho infinito por um túnel listrado que gira e pulsa.",
    "heavy": false,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "rings",
        "label": "Anéis",
        "type": "range",
        "min": 3,
        "max": 20,
        "step": 1,
        "default": 8
      },
      {
        "key": "twist",
        "label": "Torção",
        "type": "range",
        "min": 0,
        "max": 6,
        "step": 0.1,
        "default": 2
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#10002b"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#e0aaff"
      }
    ]
  },
  {
    "id": "swirl",
    "name": "Redemoinho",
    "cat": "Shader",
    "desc": "Vórtice de ruído que rodopia em torno do centro como tinta na água.",
    "heavy": false,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Escala",
        "type": "range",
        "min": 1,
        "max": 6,
        "step": 0.1,
        "default": 3
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#0d1b2a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff6d00"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ffd60a"
      }
    ]
  },
  {
    "id": "starnest",
    "name": "Star Nest",
    "cat": "Shader",
    "desc": "Campo estelar fractal volumétrico, viagem cósmica infinita (shader clássico de Kali).",
    "heavy": true,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "zoom",
        "label": "Zoom",
        "type": "range",
        "min": 0.4,
        "max": 1.4,
        "step": 0.02,
        "default": 0.8
      },
      {
        "key": "tint",
        "label": "Tonalidade",
        "type": "color",
        "default": "#ffffff"
      }
    ]
  },
  {
    "id": "clouds",
    "name": "Nuvens de Cor",
    "cat": "Shader",
    "desc": "Nuvens fractais suaves que se transformam lentamente entre três cores.",
    "heavy": false,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Escala",
        "type": "range",
        "min": 1,
        "max": 7,
        "step": 0.1,
        "default": 3
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#0b1026"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#5465ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ffd6e0"
      }
    ]
  },
  {
    "id": "tunnel3d",
    "name": "Túnel Neon 3D",
    "cat": "3D",
    "desc": "Voo infinito por um túnel de anéis neon que pulsam, clima de festival eletrônico.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "sides",
        "label": "Lados",
        "type": "range",
        "min": 3,
        "max": 10,
        "step": 1,
        "default": 4
      },
      {
        "key": "count",
        "label": "Anéis",
        "type": "range",
        "min": 10,
        "max": 70,
        "step": 1,
        "default": 30
      },
      {
        "key": "twist",
        "label": "Torção",
        "type": "range",
        "min": -0.6,
        "max": 0.6,
        "step": 0.02,
        "default": 0.14
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0,
        "max": 30,
        "step": 1,
        "default": 12
      },
      {
        "key": "trail",
        "label": "Rastro",
        "type": "range",
        "min": 0.12,
        "max": 0.7,
        "step": 0.02,
        "default": 0.35
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ff2e9a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#04030a"
      }
    ]
  },
  {
    "id": "terrain3d",
    "name": "Voo sobre Terreno",
    "cat": "3D",
    "desc": "Sobrevoo de um relevo wireframe estilo synthwave, rolando até o horizonte.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "amp",
        "label": "Relevo",
        "type": "range",
        "min": 0.2,
        "max": 3,
        "step": 0.1,
        "default": 1.3
      },
      {
        "key": "rough",
        "label": "Detalhe",
        "type": "range",
        "min": 0.12,
        "max": 0.6,
        "step": 0.02,
        "default": 0.3
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0,
        "max": 20,
        "step": 1,
        "default": 8
      },
      {
        "key": "c1",
        "label": "Cor perto",
        "type": "color",
        "default": "#ff2e9a"
      },
      {
        "key": "c2",
        "label": "Cor longe",
        "type": "color",
        "default": "#3a2bff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#05030f"
      }
    ]
  },
  {
    "id": "solids3d",
    "name": "Icosaedro Neon",
    "cat": "3D",
    "desc": "Poliedro neon girando em 3D com faces brilhantes e arestas que reluzem. Arraste para girar.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 0.4,
        "max": 1.3,
        "step": 0.05,
        "default": 0.85
      },
      {
        "key": "faces",
        "label": "Faces sólidas",
        "type": "bool",
        "default": true
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0,
        "max": 30,
        "step": 1,
        "default": 14
      },
      {
        "key": "c1",
        "label": "Faces",
        "type": "color",
        "default": "#5b2bff"
      },
      {
        "key": "c2",
        "label": "Arestas",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#04040c"
      }
    ]
  },
  {
    "id": "bars3d",
    "name": "Equalizador 3D",
    "cat": "3D",
    "desc": "Cidade de barras 3D pulsando como um espectro de áudio, clima de palco eletrônico.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "cols",
        "label": "Colunas",
        "type": "range",
        "min": 4,
        "max": 20,
        "step": 1,
        "default": 12
      },
      {
        "key": "rows",
        "label": "Fileiras",
        "type": "range",
        "min": 2,
        "max": 14,
        "step": 1,
        "default": 8
      },
      {
        "key": "height",
        "label": "Altura",
        "type": "range",
        "min": 0.5,
        "max": 4,
        "step": 0.1,
        "default": 2.2
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0,
        "max": 24,
        "step": 1,
        "default": 10
      },
      {
        "key": "c1",
        "label": "Base",
        "type": "color",
        "default": "#1b2bff"
      },
      {
        "key": "c2",
        "label": "Topo",
        "type": "color",
        "default": "#ff2e9a"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#04030c"
      }
    ]
  },
  {
    "id": "particles3d",
    "name": "Núcleo 3D / Galáxia",
    "cat": "3D",
    "desc": "Campo de partículas pseudo-3D formando galáxia, sistema solar, anéis, toro ou átomo. Arraste para girar.",
    "heavy": true,
    "gl": false,
    "params": [
      {
        "key": "shape",
        "label": "Forma",
        "type": "select",
        "options": [
          [
            "galaxy",
            "Galáxia"
          ],
          [
            "solar",
            "Sistema solar"
          ],
          [
            "rings",
            "Planeta + anéis"
          ],
          [
            "torus",
            "Toro"
          ],
          [
            "atom",
            "Átomo"
          ],
          [
            "auto",
            "Alternar (auto)"
          ]
        ],
        "default": "galaxy"
      },
      {
        "key": "count",
        "label": "Partículas",
        "type": "range",
        "min": 500,
        "max": 4000,
        "step": 100,
        "default": 2200
      },
      {
        "key": "spin",
        "label": "Rotação",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "tilt",
        "label": "Inclinação",
        "type": "range",
        "min": 0,
        "max": 1.4,
        "step": 0.02,
        "default": 0.42
      },
      {
        "key": "size",
        "label": "Tamanho do ponto",
        "type": "range",
        "min": 0.3,
        "max": 3,
        "step": 0.1,
        "default": 1
      },
      {
        "key": "color",
        "label": "Cor",
        "type": "color",
        "default": "#22d3ee"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#02030a"
      }
    ]
  },
  {
    "id": "cubecore",
    "name": "Cubo Neon (Core)",
    "cat": "3D",
    "desc": "Cubos de arame neon aninhados girando em 3D, tipo um mini núcleo Jarvis. Arraste para girar.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 0.4,
        "max": 1.2,
        "step": 0.05,
        "default": 0.72
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0,
        "max": 30,
        "step": 1,
        "default": 14
      },
      {
        "key": "c1",
        "label": "Cor externa",
        "type": "color",
        "default": "#22e5ff"
      },
      {
        "key": "c2",
        "label": "Cor interna",
        "type": "color",
        "default": "#ff3d9a"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#04060d"
      }
    ]
  },
  {
    "id": "gradientwave",
    "name": "Onda Gradiente",
    "cat": "Shader",
    "desc": "Gradiente fluido que ondula entre três cores, fundo calmo e moderno.",
    "heavy": false,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#5465ff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#00d4ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ff5e9a"
      }
    ]
  },
  {
    "id": "confetti",
    "name": "Confete",
    "cat": "Partículas",
    "desc": "Papéis coloridos girando enquanto caem. Festivo e cheio de cor.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "count",
        "label": "Qtd.",
        "type": "range",
        "min": 30,
        "max": 400,
        "step": 10,
        "default": 160
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0.2,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tamanho",
        "type": "range",
        "min": 3,
        "max": 16,
        "step": 1,
        "default": 7
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#ff3d81"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ffd84d"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#3ddc97"
      },
      {
        "key": "c4",
        "label": "Cor 4",
        "type": "color",
        "default": "#4d9bff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#0a0a14"
      }
    ]
  },
  {
    "id": "raymarch",
    "name": "Raymarch Infinito",
    "cat": "Shader",
    "desc": "Render 3D em tempo real (raymarching), campo infinito de objetos neon voando até você.",
    "heavy": true,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "density",
        "label": "Densidade",
        "type": "range",
        "min": 2.5,
        "max": 6,
        "step": 0.25,
        "default": 4
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0.02,
        "max": 0.2,
        "step": 0.005,
        "default": 0.08
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#2a0a4a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ff2e9a"
      }
    ]
  },
  {
    "id": "rmspheres",
    "name": "Túnel de Esferas",
    "cat": "Shader",
    "desc": "Voo por um campo infinito de esferas iluminadas, em loop contínuo.",
    "heavy": true,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "density",
        "label": "Densidade",
        "type": "range",
        "min": 2.5,
        "max": 6,
        "step": 0.25,
        "default": 4
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0.02,
        "max": 0.2,
        "step": 0.005,
        "default": 0.08
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#0a1a3a"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#2effd5"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ff5ea8"
      }
    ]
  },
  {
    "id": "rmrings",
    "name": "Anéis Infinitos",
    "cat": "Shader",
    "desc": "Atravesse uma sucessão infinita de anéis (toros) neon que vêm na sua direção.",
    "heavy": true,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "density",
        "label": "Espaçamento",
        "type": "range",
        "min": 2.5,
        "max": 6,
        "step": 0.25,
        "default": 4
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0.02,
        "max": 0.2,
        "step": 0.005,
        "default": 0.08
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#1a0833"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#b06bff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#3df0ff"
      }
    ]
  },
  {
    "id": "rmocta",
    "name": "Túnel de Octaedros",
    "cat": "Shader",
    "desc": "Cristais octaédricos repetidos ao infinito, iluminados, em voo contínuo.",
    "heavy": true,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "density",
        "label": "Densidade",
        "type": "range",
        "min": 2.5,
        "max": 6,
        "step": 0.25,
        "default": 4
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0.02,
        "max": 0.2,
        "step": 0.005,
        "default": 0.08
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#06121f"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ffd84d"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ff4d6d"
      }
    ]
  },
  {
    "id": "rmcolumns",
    "name": "Colunata Infinita",
    "cat": "Shader",
    "desc": "Corredor sem fim ladeado por colunas neon que passam dos dois lados.",
    "heavy": true,
    "gl": true,
    "params": [
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "density",
        "label": "Espaçamento",
        "type": "range",
        "min": 2.5,
        "max": 6,
        "step": 0.25,
        "default": 4
      },
      {
        "key": "glow",
        "label": "Brilho",
        "type": "range",
        "min": 0.02,
        "max": 0.2,
        "step": 0.005,
        "default": 0.08
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#0a0820"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#33e0ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ff7a3d"
      }
    ]
  },
  {
    "id": "svgGeo",
    "name": "Mandala Geométrica (SVG)",
    "cat": "Geométrico",
    "desc": "Animação vetorial em SVG: polígonos concêntricos girando em simetria, geometria pura e nítida.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "rings",
        "label": "Anéis",
        "type": "range",
        "min": 3,
        "max": 14,
        "step": 1,
        "default": 8
      },
      {
        "key": "sides",
        "label": "Lados",
        "type": "range",
        "min": 3,
        "max": 10,
        "step": 1,
        "default": 6
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "stroke",
        "label": "Espessura",
        "type": "range",
        "min": 0.2,
        "max": 3,
        "step": 0.1,
        "default": 0.7
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#ff2e9a"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#06030f"
      }
    ]
  },
  {
    "id": "svgWaves",
    "name": "Ondas Geométricas (SVG)",
    "cat": "Geométrico",
    "desc": "Camadas de ondas vetoriais (SVG) deslizando suavemente, translúcidas e sobrepostas.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "layers",
        "label": "Camadas",
        "type": "range",
        "min": 2,
        "max": 7,
        "step": 1,
        "default": 4
      },
      {
        "key": "speed",
        "label": "Velocidade",
        "type": "range",
        "min": 0,
        "max": 3,
        "step": 0.05,
        "default": 1
      },
      {
        "key": "amp",
        "label": "Amplitude",
        "type": "range",
        "min": 2,
        "max": 20,
        "step": 1,
        "default": 9
      },
      {
        "key": "c1",
        "label": "Cor 1",
        "type": "color",
        "default": "#5465ff"
      },
      {
        "key": "c2",
        "label": "Cor 2",
        "type": "color",
        "default": "#00d4ff"
      },
      {
        "key": "c3",
        "label": "Cor 3",
        "type": "color",
        "default": "#ff5e9a"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#070617"
      }
    ]
  },
  {
    "id": "vectorfield",
    "name": "Vetores (apontam pro mouse)",
    "cat": "Interativo",
    "desc": "Uma malha de palitinhos que giram para apontar (ou fugir) do cursor, com retorno suave quando o mouse sai. Funciona com toque no mobile.",
    "heavy": false,
    "gl": false,
    "params": [
      {
        "key": "gap",
        "label": "Espacamento",
        "type": "range",
        "min": 18,
        "max": 80,
        "step": 1,
        "default": 34,
        "reinit": true
      },
      {
        "key": "len",
        "label": "Comprimento",
        "type": "range",
        "min": 4,
        "max": 40,
        "step": 1,
        "default": 15
      },
      {
        "key": "thick",
        "label": "Espessura",
        "type": "range",
        "min": 1,
        "max": 6,
        "step": 0.5,
        "default": 2
      },
      {
        "key": "ease",
        "label": "Suavidade",
        "type": "range",
        "min": 0.02,
        "max": 0.4,
        "step": 0.01,
        "default": 0.16
      },
      {
        "key": "reach",
        "label": "Alcance do mouse",
        "type": "range",
        "min": 60,
        "max": 900,
        "step": 10,
        "default": 340
      },
      {
        "key": "idle",
        "label": "Movimento ocioso",
        "type": "range",
        "min": 0,
        "max": 1,
        "step": 0.05,
        "default": 0.3
      },
      {
        "key": "mode",
        "label": "Comportamento",
        "type": "select",
        "options": [
          [
            "toward",
            "Apontar para o mouse"
          ],
          [
            "away",
            "Fugir do mouse"
          ]
        ],
        "default": "toward"
      },
      {
        "key": "dot",
        "label": "Ponto na ponta",
        "type": "bool",
        "default": true
      },
      {
        "key": "c1",
        "label": "Cor base",
        "type": "color",
        "default": "#5b4bd6"
      },
      {
        "key": "c2",
        "label": "Cor no mouse",
        "type": "color",
        "default": "#00e5ff"
      },
      {
        "key": "bg",
        "label": "Fundo",
        "type": "color",
        "default": "#07070d"
      }
    ]
  }
];
