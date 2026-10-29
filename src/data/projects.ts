import type { Project } from "@/lib/types";

// Projetos da vitrine de portfólio. Adicione os seus aqui.
// Dica: coloque as telas em /public/projects/<id>/ e referencie em `media`.
export const projects: Project[] = [
  {
    id: "gym-app",
    title: "Gym App",
    description:
      "App de treino feito pra usar na academia: qualquer divisão de treino, registro de séries por máquina, progressão dupla, gráficos de carga, modo treinador e um assistente com IA que revisa e edita o plano. PWA + versão nativa em SwiftUI, sincronizadas pela mesma conta.",
    descriptionEn:
      "A workout tracker built for the gym floor: any split, per-machine set logging, double progression, weight charts, a trainer mode and an AI assistant that reviews and edits your plan. PWA plus a native SwiftUI app, synced through the same account.",
    tags: ["React", "PWA", "SwiftUI", "Supabase", "Claude"],
    year: "2026",
    url: "",
    featured: true,
    cover: "/projects/gym-app.webp",
    media: [
      {
        label: { pt: "iOS nativo (SwiftUI)", en: "Native iOS (SwiftUI)" },
        layout: "phones",
        shots: [
          {
            kind: "phone",
            src: "/projects/gym/ios-hoje.webp",
            label: { pt: "Hoje", en: "Today" },
            alt: { pt: "Hoje no app nativo", en: "Today in the native app" },
          },
          {
            kind: "phone",
            src: "/projects/gym/ios-treino.webp",
            label: { pt: "Treino", en: "Workout" },
            alt: { pt: "Treino com timer de descanso", en: "Workout with rest timer" },
          },
          {
            kind: "phone",
            src: "/projects/gym/ios-live-activity.webp",
            label: { pt: "Live Activity", en: "Live Activity" },
            alt: { pt: "Timer de descanso como Live Activity", en: "Rest timer Live Activity" },
          },
          {
            kind: "phone",
            src: "/projects/gym/ios-progresso.webp",
            label: { pt: "Progresso", en: "Progress" },
            alt: { pt: "Gráfico de cargas em Swift Charts", en: "Weights chart in Swift Charts" },
          },
          {
            kind: "phone",
            src: "/projects/gym/ios-exercicio.webp",
            label: { pt: "Exercício", en: "Exercise" },
            alt: { pt: "Editor de exercício", en: "Exercise editor" },
          },
          {
            kind: "phone",
            src: "/projects/gym/ios-plano.webp",
            label: { pt: "Plano", en: "Plan" },
            alt: { pt: "Plano no app nativo", en: "Plan in the native app" },
          },
        ],
      },
      {
        label: { pt: "Web (PWA)", en: "Web (PWA)" },
        layout: "phones",
        shots: [
          {
            kind: "phone",
            src: "/projects/gym/web-hoje.webp",
            label: { pt: "Hoje", en: "Today" },
            alt: { pt: "Hoje: o treino do dia e a semana", en: "Today: the workout for the day and the week" },
          },
          {
            kind: "phone",
            src: "/projects/gym/web-treino.webp",
            label: { pt: "Treino", en: "Workout" },
            alt: { pt: "Treino em andamento com o timer de descanso", en: "Workout in progress with the rest timer" },
          },
          {
            kind: "phone",
            src: "/projects/gym/web-cargas.webp",
            label: { pt: "Cargas", en: "Weights" },
            alt: { pt: "Gráfico de carga de um exercício", en: "Weight chart for one exercise" },
          },
          {
            kind: "phone",
            src: "/projects/gym/web-chat.webp",
            label: { pt: "Assistente IA", en: "AI assistant" },
            alt: { pt: "Assistente de plano com IA", en: "AI plan assistant" },
          },
          {
            kind: "phone",
            src: "/projects/gym/web-plano.webp",
            label: { pt: "Plano", en: "Plan" },
            alt: { pt: "Editor do plano", en: "Plan editor" },
          },
          {
            kind: "phone",
            src: "/projects/gym/web-evolucao.webp",
            label: { pt: "Evolução", en: "Progress" },
            alt: { pt: "Frequência e semanas na meta", en: "Frequency and weeks on target" },
          },
        ],
      },
    ],
  },
  {
    id: "mynotch",
    title: "myNotch",
    description:
      "App de macOS que transforma o notch do MacBook num espaço de trabalho: player de música, bandeja do que você copia, nota rápida com ditado por voz e as páginas do Nova Notes, tudo a um hover de distância.",
    descriptionEn:
      "A macOS app that turns the MacBook notch into a little workspace: music player, a shelf for what you copy, a quick note with voice dictation and your Nova Notes pages, all one hover away.",
    tags: ["Swift", "SwiftUI", "AppKit", "macOS"],
    year: "2026",
    repo: "https://github.com/itslauxen/myNotch",
    featured: true,
    cover: "/projects/mynotch.webp",
    media: [
      {
        label: { pt: "macOS", en: "macOS" },
        layout: "gallery",
        shots: [
          {
            kind: "video",
            src: "/projects/mynotch/demo.mp4",
            poster: "/projects/mynotch/demo-poster.webp",
            label: { pt: "Demo", en: "Demo" },
            alt: { pt: "O notch crescendo ao passar o mouse", en: "The notch growing on hover" },
          },
          {
            kind: "panel",
            src: "/projects/mynotch/player.webp",
            label: { pt: "Player", en: "Player" },
            alt: { pt: "Player de música no notch", en: "Music player in the notch" },
          },
          {
            kind: "panel",
            src: "/projects/mynotch/prints.webp",
            label: { pt: "Bandeja", en: "Shelf" },
            alt: { pt: "Bandeja com prints e textos copiados", en: "Shelf with copied screenshots and text" },
          },
          {
            kind: "panel",
            src: "/projects/mynotch/notas.webp",
            label: { pt: "Nota rápida", en: "Quick note" },
            alt: { pt: "Nota rápida com formatação e ditado", en: "Quick note with formatting and dictation" },
          },
          {
            kind: "panel",
            src: "/projects/mynotch/nova.webp",
            label: { pt: "Nova Notes", en: "Nova Notes" },
            alt: { pt: "Páginas do Nova Notes dentro do notch", en: "Nova Notes pages inside the notch" },
          },
          {
            kind: "panel",
            src: "/projects/mynotch/ajustes.webp",
            label: { pt: "Ajustes", en: "Settings" },
            alt: { pt: "Ajustes do myNotch", en: "myNotch settings" },
          },
        ],
      },
    ],
  },
  {
    id: "nova-notes",
    title: "Nova Notes",
    description:
      "Segundo cérebro com notas, metas e hábitos: editor de blocos estilo Notion (TipTap), chat com IA (Claude) que lê e cria notas via tools, controle por voz, push próprio e sincronização em tempo real no Supabase.",
    descriptionEn:
      "A second brain for notes, goals and habits: Notion-style block editor (TipTap), an AI chat (Claude) that reads and creates notes through tools, voice control, self-built web push and real-time sync on Supabase.",
    tags: ["React", "Vite", "Supabase", "Claude", "TipTap"],
    year: "2025",
    url: "https://novanotes.lauxen.dev/",
    repo: "https://github.com/itslauxen/nova-notes",
    featured: true,
    cover: "/projects/nova-notes.webp",
    media: [
      {
        label: { pt: "Web", en: "Web" },
        layout: "gallery",
        shots: [
          {
            kind: "video",
            src: "/projects/nova/demo.mp4",
            poster: "/projects/nova/demo-poster.webp",
            label: { pt: "Demo", en: "Demo" },
            alt: { pt: "Demonstração do Nova Notes em uso", en: "Nova Notes demo in use" },
          },
          {
            kind: "desktop",
            src: "/projects/nova/home.webp",
            label: { pt: "Início", en: "Home" },
            alt: {
              pt: "Início com o núcleo de partículas e os três botões orbitando",
              en: "Home with the particle core and the three orbiting buttons",
            },
          },
          {
            kind: "desktop",
            src: "/projects/nova/chat.webp",
            label: { pt: "Chat com IA", en: "AI chat" },
            alt: { pt: "Chat com IA respondendo a partir das notas", en: "AI chat answering from the notes" },
          },
          {
            kind: "desktop",
            src: "/projects/nova/note.webp",
            label: { pt: "Editor", en: "Editor" },
            alt: { pt: "Nota com checklist, tabela e toggle", en: "Note with checklist, table and toggle" },
          },
          {
            kind: "desktop",
            src: "/projects/nova/goals.webp",
            label: { pt: "Metas", en: "Goals" },
            alt: { pt: "Metas com barra de progresso", en: "Goals with progress" },
          },
          {
            kind: "desktop",
            src: "/projects/nova/habits.webp",
            label: { pt: "Hábitos", en: "Habits" },
            alt: { pt: "Grade mensal de hábitos", en: "Monthly habit grid" },
          },
        ],
      },
    ],
  },
  {
    id: "lib-componentes",
    title: "Acervo & Lab",
    description:
      "Minha toolbox pessoal: bibliotecas e sites de referência (React Bits, Aceternity, Componentry…) e um lab com efeitos meus e adaptados — parâmetros ao vivo e código copiável. Os efeitos abaixo estão rodando de verdade.",
    descriptionEn:
      "My personal toolbox: libraries and reference sites (React Bits, Aceternity, Componentry…) and a lab with my own and adapted effects — live parameters and copyable code. The effects below are running for real.",
    tags: ["Curadoria", "WebGL", "Shaders", "Toolbox"],
    year: "2025",
    url: "/acervo",
    featured: true,
    cover: "/projects/component-lib.webp", // foto da interface do estúdio
    media: [
      {
        label: { pt: "Ao vivo", en: "Live" },
        layout: "gallery",
        shots: [
          {
            kind: "live",
            effect: "gradientblinds",
            label: { pt: "Persianas de Gradiente", en: "Gradient Blinds" },
            alt: { pt: "Efeito Persianas de Gradiente", en: "Gradient Blinds effect" },
          },
          {
            kind: "live",
            effect: "ferrofluid",
            label: { pt: "Ferrofluido", en: "Ferrofluid" },
            alt: { pt: "Efeito Ferrofluido", en: "Ferrofluid effect" },
          },
          {
            kind: "live",
            effect: "liquidether",
            label: { pt: "Éter Líquido", en: "Liquid Ether" },
            alt: { pt: "Efeito Éter Líquido", en: "Liquid Ether effect" },
          },
          {
            kind: "live",
            effect: "pixelblast",
            label: { pt: "Explosão de Pixels", en: "Pixel Blast" },
            alt: { pt: "Efeito Explosão de Pixels", en: "Pixel Blast effect" },
          },
          {
            kind: "desktop",
            src: "/projects/component-lib.webp",
            label: { pt: "O estúdio", en: "The studio" },
            alt: { pt: "Estúdio da biblioteca com editor de parâmetros", en: "Library studio with the parameter editor" },
          },
        ],
      },
    ],
  },
];
