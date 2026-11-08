# Portfólio + Acervo (portfolio-ui-lib)

Site pessoal do Gabriel Lauxen (dev fullstack) no ar em **lauxen.dev**: portfólio (projetos, Sobre, "O que eu construo") e, junto, um **Acervo/Lab** com ~90 componentes visuais parametrizados (backgrounds canvas/WebGL, demos de animação e texto), feitos por ele ou adaptados de referências como React Bits.

## Stack
- Next.js 14.2.5 (App Router) + React 18.3.1 + TypeScript 5.5 + CSS Modules.
- Animação/3D: `gsap`, `motion`, `ogl` (shaders), `three` + `@react-three/fiber` **v8** + `@react-three/drei` **v9** + `postprocessing`, `simple-icons`.
- i18n próprio PT/EN (`src/i18n/dict.ts` + `I18nProvider.tsx`). Tema único escuro, sem modo claro.

## Estrutura
- `src/app/page.tsx`: home (hero, vitrines de projetos, "O que eu domino", "O que eu construo", "Como eu trabalho").
- `src/app/sobre/`: Sobre editorial (retrato ASCII, experiência, stack).
- `src/app/acervo/`: toolbox de referências (dados em `src/data/acervo.ts`, prints em `public/acervo/<slug>.webp`).
- `src/app/biblioteca/` (+ `[id]`): o Lab/estúdio com busca e preview; `src/app/backgrounds/[id]`: editor de parâmetros; `src/app/artigos/[slug]`.
- `src/components/home/`: `ProjectCase.tsx` (vitrine por projeto), `ServicesShowcase.tsx`, `HeroChip.tsx`.
- `src/components/backgrounds/` (shaders OGL + Studio/Controls/Preview), `demos/` (35), `AnimatedBackground/` (motor canvas), `JarvisCore/`, `MatrixGlitch/`, `about/AsciiPortrait.tsx`.
- `src/data/`: conteúdo — `profile.ts`, `projects.ts`, `acervo.ts`, `articles.ts`, `animations.ts`. `src/lib/experience.ts`.
- `src/lib/backgrounds/`: `engine.js` (motor canvas), `catalog.ts` e `effects.tsx` GERADOS, `react-catalog.ts`, `demo-catalog.ts`.
- `src/styles/tokens.css`: design tokens (cor de acento, tipografia, espaçamento).
- `public/component-src/*.txt`: GERADO, código-fonte para o botão "copiar componente".
- `.taste-skill/`, `.agents/`, `skills-lock.json`: ferramentas locais da skill design-taste-frontend (gitignored).

## Comandos
```bash
npm run dev        # next dev (porta 3000 por padrão)
npm run build      # next build (TypeScript bloqueia; ESLint não)
npm start          # next start
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
node scripts/gen-backgrounds.mjs        # regera catalog.ts + effects.tsx a partir de engine.js
node scripts/gen-component-sources.mjs  # regera public/component-src/
```
Sem testes.

## Deploy e onde roda
- Vercel, domínio **lauxen.dev** / www (DNS na Cloudflare). Não há `.vercel/` local, então o deploy provavelmente é pela integração Git com `github.com/itslauxen/portfolio-ui-lib` na `main` (verificar).

## Integrações e serviços externos
- Nenhuma variável de ambiente nem API em runtime; site estático/client-side.
- Designs vêm de canvases do Claude Design do Gabriel ("Portfolio Layouts", "Skills Section", "Exploracoes.dc.html"). Ele escolhe opções por código ("use o 2a", "Sobre = 1d") — reler o arquivo do canvas a cada pedido, pois ele adiciona rodadas novas.
- Às vezes passa tarefas por notas no canvas do Maestri (`maestri note read "<nome>"`); há portais "Portfólio · desktop" e "Portfólio · iPhone" (390×844).

## Convenções
- Nomes de rotas/dados em PT (`sobre`, `acervo`, `artigos`), componentes em PascalCase em EN; comentários em PT.
- Commits no estilo `feat:` / `fix:` com descrição em PT.
- Todo texto de UI passa pelo dicionário PT/EN de `src/i18n/dict.ts`.
- Identidade atual "noite verde" (set/2026): Manrope em tudo, verde `#3ce97f`, fundo `#101311`. A direção antiga "neo-brutalist terminal" (mono, lima `#C6FF3A`) foi ABANDONADA. O README ainda cita `#4ef08c` (desatualizado).
- Regras da skill design-taste-frontend aplicadas: corpo 16px, sem em-dash, sem tags uppercase/badges mono, sem contornos 1px/glows. Mantidos de propósito: numeral fantasma das skills, números outline 01–04, scrim do nav.

## Armadilhas e decisões
- **Dev server é do Gabriel**: dois `next dev` compartilhando `.next` se corrompem, e `next build` com dev rodando quebra ("Cannot find module for page"). Não suba dev nem rode build sem confirmar; valide com `npx tsc --noEmit`. Depois de um `next build`, o dev pode servir CSS do next/font trocado (Manrope some): cura é `rm -rf .next` antes de religar. Em sessões passadas o dev rodava na porta 3005 (verificar).
- **React 18 ⇒ fiber v8 / drei v9**: fiber v9 e drei v10 exigem React 19 e quebram em runtime. Nunca instalar sem pin.
- Gerados: depois de mexer em `engine.js` rode `gen-backgrounds.mjs`; depois de mexer em shaders/demos rode `gen-component-sources.mjs`.
- Galeria/vitrines só rodam WebGL e vídeos perto da tela (IntersectionObserver), para não estourar o limite de contextos WebGL. Dither do hero pausa fora da tela.
- Scroll-snap nativo foi tentado e removido (tremia com o painel transformado); a vitrine assenta sob o header por JS (debounce). Painel `.projects` sem `scale` (custava perf). Âncoras por `offsetTop` acumulado, não `scrollIntoView`.
- `overflow-x: clip` no body (não `hidden` por seção); glows não podem gerar scroll horizontal.
- Vídeos de projeto: mp4 autoplay mudo sem controles, nunca GIF.
- Canvas 2D não aceita `var()` em `ctx.font`: resolver via `getComputedStyle` + `document.fonts.load`.
- Posicionamento: nunca dizer que os componentes "não são meus" nem apresentar todos como criação dele; texto certo é "feitos por mim ou adaptados dessas referências". Anos de experiência contados desde set/2022 (B3Dev), exibidos como "3+".
- Gym App: repo privado, card sem link ("Em uso privado"). Ordem dos projetos na home: Gym App, myNotch, Nova Notes, Acervo & Lab.
- Gabriel itera por voz (transcrição imprecisa: "Éder"=header, "sogro"=sobre, "vento mágico"=MagicBento) e screenshots; prefere direção visual concreta, não propor features novas (rejeitou lista de ideias tipo ⌘K, RAG, /agora).

## Projetos relacionados
- `/Users/gabriel/projects/gymApp` (Gym App), myNotch, Nova Notes: projetos exibidos nas vitrines.
- Memórias antigas em `~/.claude/projects/-Users-gabriel-projects-portfolio-biblioteca/` referem-se à fase neo-brutalist (nome antigo do pacote `portfolio-biblioteca`).
