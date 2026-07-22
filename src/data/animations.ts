import type { AnimationAsset } from "@/lib/types";

// Animações CSS reutilizáveis. `previewId` casa com a classe em
// animations.module.css (usada no preview ao vivo). `snippets` tem o
// código independente para copiar e colar em qualquer projeto.
export const animations: AnimationAsset[] = [
  {
    id: "a-float",
    slug: "float",
    kind: "animation",
    title: "Float",
    description: "Flutuação suave para cima e para baixo, ótimo para cards e ícones em destaque.",
    tags: ["idle", "loop", "suave"],
    createdAt: "2025-05-02",
    featured: true,
    previewId: "float",
    snippets: [
      {
        language: "css",
        label: "CSS",
        code: `.float {\n  animation: float 3s ease-in-out infinite;\n}\n@keyframes float {\n  0%, 100% { transform: translateY(-8px); }\n  50%      { transform: translateY(8px); }\n}`,
      },
    ],
  },
  {
    id: "a-pulse",
    slug: "pulse-glow",
    kind: "animation",
    title: "Pulse Glow",
    description: "Halo pulsante na cor de destaque. Bom para chamar atenção a um botão ou status.",
    tags: ["glow", "loop", "destaque"],
    createdAt: "2025-05-04",
    previewId: "pulseGlow",
    snippets: [
      {
        language: "css",
        label: "CSS",
        code: `.pulse-glow {\n  animation: pulse-glow 2s ease-in-out infinite;\n}\n@keyframes pulse-glow {\n  0%, 100% { box-shadow: 0 0 0 0 rgba(124,92,255,.55); }\n  50%      { box-shadow: 0 0 34px 6px rgba(124,92,255,.55); }\n}`,
      },
    ],
  },
  {
    id: "a-gradient-text",
    slug: "gradient-text",
    kind: "animation",
    title: "Texto Gradiente",
    description: "Gradiente animado percorrendo o texto. Título de hero na certa.",
    tags: ["texto", "gradiente", "loop"],
    createdAt: "2025-05-08",
    featured: true,
    previewId: "gradientText",
    snippets: [
      {
        language: "css",
        label: "CSS",
        code: `.gradient-text {\n  background: linear-gradient(90deg,#7c5cff,#00e5ff,#ff4d9d,#7c5cff);\n  background-size: 300% 100%;\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n  animation: gradient-text 4s linear infinite;\n}\n@keyframes gradient-text { to { background-position: 300% 0; } }`,
      },
    ],
  },
  {
    id: "a-shimmer",
    slug: "shimmer",
    kind: "animation",
    title: "Shimmer (skeleton)",
    description: "Brilho deslizante para estados de carregamento (skeleton loading).",
    tags: ["loading", "skeleton", "loop"],
    createdAt: "2025-05-11",
    previewId: "shimmer",
    snippets: [
      {
        language: "css",
        label: "CSS",
        code: `.shimmer { position: relative; overflow: hidden; background: #16161f; }\n.shimmer::after {\n  content: ""; position: absolute; inset: 0; transform: translateX(-100%);\n  background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);\n  animation: shimmer 1.6s infinite;\n}\n@keyframes shimmer { to { transform: translateX(100%); } }`,
      },
    ],
  },
  {
    id: "a-flip",
    slug: "flip-3d",
    kind: "animation",
    title: "Flip 3D",
    description: "Giro 3D contínuo em torno do eixo Y, efeito moeda/cartão.",
    tags: ["3d", "loop", "transform"],
    createdAt: "2025-05-15",
    previewId: "flip",
    snippets: [
      {
        language: "html",
        label: "HTML",
        code: `<div class="flip-scene">\n  <div class="flip">✦</div>\n</div>`,
      },
      {
        language: "css",
        label: "CSS",
        code: `.flip-scene { perspective: 700px; }\n.flip {\n  transform-style: preserve-3d;\n  animation: flip 3.4s cubic-bezier(.6,0,.35,1) infinite;\n}\n@keyframes flip {\n  0%,20% { transform: rotateY(0); }\n  50%,70% { transform: rotateY(180deg); }\n  100% { transform: rotateY(360deg); }\n}`,
      },
    ],
  },
  {
    id: "a-typing",
    slug: "typewriter",
    kind: "animation",
    title: "Typewriter",
    description: "Efeito de máquina de escrever com cursor piscando, só em CSS.",
    tags: ["texto", "loop", "caret"],
    createdAt: "2025-05-19",
    previewId: "typing",
    snippets: [
      {
        language: "css",
        label: "CSS",
        code: `.typing {\n  display: inline-block; overflow: hidden; white-space: nowrap;\n  border-right: 2px solid #7c5cff; width: 13ch;\n  animation: typing 3.2s steps(13) infinite alternate, caret .8s step-end infinite;\n}\n@keyframes typing { from { width: 0; } to { width: 13ch; } }\n@keyframes caret { 50% { border-color: transparent; } }`,
      },
    ],
  },
];
