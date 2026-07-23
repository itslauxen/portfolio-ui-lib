import type { Project } from "@/lib/types";

// Projetos da vitrine de portfólio. Adicione os seus aqui.
// Dica: coloque capas em /public/covers e referencie em `cover`.
export const projects: Project[] = [
  {
    id: "nova-notes",
    title: "Nova Notes",
    description:
      "App de notas com editor rico (TipTap), sincronização em nuvem (Supabase) e um núcleo de partículas 3D (JarvisCore) reativo a voz e toque, o mesmo componente disponível aqui na biblioteca.",
    tags: ["React", "Vite", "Supabase", "Canvas 3D", "TipTap"],
    year: "2025",
    url: "https://novanotes.lauxen.dev/",
    featured: true,
    cover: "/nova-notes-preview.png",
  },
  {
    id: "lib-componentes",
    title: "Lib de componentes",
    description:
      "Biblioteca de backgrounds, componentes e animações parametrizados (Canvas 2D, WebGL, three.js e shaders) com editor de parâmetros ao vivo e código copiável. Integrada neste site em /biblioteca.",
    tags: ["Canvas", "WebGL", "Shaders", "Ferramenta"],
    year: "2025",
    url: "/biblioteca",
    featured: true,
    cover: "/component-lib-preview.png", // foto da interface do estúdio
  },
  {
    id: "exemplo-1",
    title: "Seu próximo projeto",
    description:
      "Placeholder, substitua por um projeto real. Descreva o problema, sua solução e o resultado. Adicione links para o site e o repositório.",
    tags: ["Placeholder"],
    year: "2024",
    url: "",
    repo: "",
    cover: "",
  },
];
