// Acervo: referências que uso no dia a dia — bibliotecas, coleções e sites.
// Preview em /public/acervo/<slug>.webp (print da home de cada site).
export interface Reference {
  slug: string;
  name: string;
  url: string;
  tags: string[];
  note: string;
  noteEn: string;
}

export const references: Reference[] = [
  {
    slug: "reactbits",
    name: "React Bits",
    url: "https://reactbits.dev/",
    tags: ["React", "Backgrounds", "Texto"],
    note: "Componentes e backgrounds animados para React. Vários shaders do meu lab partiram daqui.",
    noteEn: "Animated React components and backgrounds. Several shaders in my lab started here.",
  },
  {
    slug: "aceternity",
    name: "Aceternity UI",
    url: "https://ui.aceternity.com/components",
    tags: ["React", "Tailwind", "Motion"],
    note: "Mais de 200 componentes e blocos para React e Next.js — cards, heros e fundos com Tailwind e Motion.",
    noteEn: "200+ components and blocks for React and Next.js — cards, heroes and backgrounds with Tailwind and Motion.",
  },
  {
    slug: "componentry",
    name: "Componentry",
    url: "https://componentry.dev/docs",
    tags: ["React", "Motion", "WebGL"],
    note: "Primitivas animadas para React, copia e cola. O retrato em ASCII do meu Sobre partiu do efeito deles.",
    noteEn: "Copy-paste animated primitives for React. The ASCII portrait on my About page started from their effect.",
  },
  {
    slug: "dotmatrix",
    name: "Dot Matrix",
    url: "https://dotmatrix.zzzzshawn.cloud/",
    tags: ["Loaders", "shadcn"],
    note: "Loaders em matriz de pontos, instalados pelo registry do shadcn e mantidos como código local.",
    noteEn: "Dot-matrix loaders, installed through the shadcn registry and kept as local code.",
  },
  {
    slug: "lottiefiles",
    name: "LottieFiles",
    url: "https://lottiefiles.com/free-animations/loader",
    tags: ["Lottie", "Loaders"],
    note: "Loaders e micro-animações feitos por motion designers, em Lottie, GIF, SVG animado ou MP4.",
    noteEn: "Loaders and micro-animations made by motion designers, in Lottie, GIF, animated SVG or MP4.",
  },
  {
    slug: "refero",
    name: "Refero Styles",
    url: "https://styles.refero.design/",
    tags: ["Design", "DESIGN.md"],
    note: "Estilos de sites reais — cores, tipografia e espaçamento — em DESIGN.md pronto para usar com IA.",
    noteEn: "Real website styles — colors, typography and spacing — as AI-ready DESIGN.md files.",
  },
  {
    slug: "behold",
    name: "Behold",
    url: "https://behold.so/",
    tags: ["Instagram", "Widget"],
    note: "Feeds do Instagram embutidos em sites por widget ou API JSON — o que eu uso quando o cliente pede.",
    noteEn: "Instagram feeds embedded in websites via widget or JSON API — what I reach for when a client asks.",
  },
];
