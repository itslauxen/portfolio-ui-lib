import type { Profile, Skill } from "@/lib/types";

// ⇩ EDITE AQUI seus dados. Tudo que aparece na home/rodapé vem daqui.
export const profile: Profile = {
  name: "Gabriel Lauxen",
  role: "Desenvolvedor Fullstack & Creative Developer",
  tagline:
    "Do banco de dados ao pixel: aplicações completas com Node e React, e interfaces vivas com WebGL, motion e shaders.",
  bio: "Sou desenvolvedor fullstack com 4 anos de experiência: no dia a dia construo aplicações completas com Node, Express, React, TypeScript, Sequelize, SQL e Docker, do modelo de dados à interface. Recentemente venho me aventurando no lado criativo da web com three.js, WebGL, motion e shaders, e este site é o laboratório disso: ao mesmo tempo meu portfólio e minha biblioteca reutilizável de backgrounds, componentes e animações.",
  location: "Brasil",
  email: "gabriellauxen11@gmail.com",
  socials: [
    { label: "GitHub", url: "https://github.com/itslauxen" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/gabriel-lauxen-36822a231/" },
  ],
};

export const skills: Skill[] = [
  // Front-end
  { name: "React", level: 90, category: "Front-end" },
  { name: "Next.js", level: 86, category: "Front-end" },
  { name: "Vue.js", level: 80, category: "Front-end" },
  { name: "TypeScript", level: 88, category: "Front-end" },
  { name: "Ionic", level: 76, category: "Front-end" },
  { name: "Quasar", level: 74, category: "Front-end" },
  { name: "PWA", level: 82, category: "Front-end" },
  // Back-end & infra
  { name: "Node.js", level: 88, category: "Back-end & infra" },
  { name: "Express", level: 86, category: "Back-end & infra" },
  { name: "Sequelize", level: 84, category: "Back-end & infra" },
  { name: "SQL", level: 84, category: "Back-end & infra" },
  { name: "PostgreSQL", level: 82, category: "Back-end & infra" },
  { name: "MongoDB", level: 74, category: "Back-end & infra" },
  { name: "Docker", level: 78, category: "Back-end & infra" },
  { name: "Java", level: 68, category: "Back-end & infra" },
  // Criativo & motion
  { name: "Three.js", level: 74, category: "Criativo & motion" },
  { name: "WebGL", level: 72, category: "Criativo & motion" },
  { name: "Shaders GLSL", level: 66, category: "Criativo & motion" },
  { name: "GSAP", level: 80, category: "Criativo & motion" },
  { name: "Motion", level: 80, category: "Criativo & motion" },
  { name: "Canvas 2D", level: 82, category: "Criativo & motion" },
  // Design & IA
  { name: "Design de Interface", level: 82, category: "Design & IA" },
  { name: "UI/UX", level: 80, category: "Design & IA" },
  { name: "IA generativa", level: 82, category: "Design & IA" },
];

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  bullets: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Desenvolvedor Fullstack",
    company: "DKW System",
    period: "jun/2025 — atual",
    location: "Novo Hamburgo, RS · híbrido",
    bullets: [
      "Desenvolvo, do front ao back, um CRM e sistema de mensageria whitelabel de grande porte (6 repositórios) com React, Node, Sequelize, MUI v5, SQL e Docker.",
      "Coordenei sozinho a migração do frontend — React 16→18, Node 16→22, MUI v4→v5 e adoção do Vite — refatorando milhares de arquivos e elevando bastante a performance.",
      "Construo agentes de IA configuráveis com tools (function calling), front e back, permitindo automações personalizadas por cliente.",
      "Implementei convenções de código, design tokens e boas práticas de frontend adotadas pela equipe.",
    ],
  },
  {
    role: "Trainee — Programa Crescer",
    company: "CWI Software",
    period: "2024 — 2025",
    bullets: [
      "Formação profissional com projetos práticos em React e Java, aprofundando fundamentos de front e back.",
    ],
  },
  {
    role: "Desenvolvedor Frontend",
    company: "B3Dev",
    period: "dez/2022 — nov/2023",
    location: "Porto Alegre, RS",
    bullets: [
      "Aplicações web e mobile para diversos clientes com Vue.js, Ionic, Quasar e MongoDB.",
      "Entreguei apps híbridos com boa experiência de usuário em múltiplos projetos.",
    ],
  },
];

export interface EducationItem {
  title: string;
  org: string;
  period: string;
  note?: string;
}

export const education: EducationItem[] = [
  {
    title: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    org: "UNISINOS · São Leopoldo, RS",
    period: "2022 — 2026",
    note: "Concluído",
  },
  {
    title: "Intercâmbio · imersão em inglês",
    org: "Austrália",
    period: "2024",
    note: "~6 meses",
  },
];
