# gabriel_lauxen — portfólio & biblioteca de componentes

Site em **Next.js (App Router) · React · TypeScript · CSS Modules** que é, ao mesmo tempo,
o **portfólio** do Gabriel Lauxen (desenvolvedor fullstack) e uma **biblioteca reutilizável
de ~90 componentes visuais parametrizados**.

Identidade **neo-brutalist terminal**: monospace (JetBrains Mono), cor-assinatura lima
(`#c6ff3a`) sobre quase-preto, cantos duros e sombras sem blur — tudo controlado por design
tokens centralizados.

---

## O que tem dentro

Uma **biblioteca única**, com busca e preview ao vivo, reunindo:

- **Backgrounds (59)** — fundos animados parametrizados misturados num só catálogo:
  **43** efeitos de um motor próprio em `<canvas>` (2D/WebGL) + **16** shaders em React/OGL
  (Aurora, Grainient, LightRays, LiquidEther, PlasmaWave, GradientBlinds, Dither, Beams…).
  Cada um com **sliders por parâmetro** e **código para copiar**.
- **Demos (35)** — animações, efeitos de texto e componentes de UI (Dock, MagicBento,
  TiltedCard, SplitText, ClickSpark, MagnetLines, GooeyNav…).
- **Destaques autorais** — **JarvisCore** (partículas 3D em canvas puro, sem three.js),
  **MatrixGlitch** e um **campo de vetores** interativo.

---

## Como rodar

Requer **Node 18+**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm start          # sobe o build
npm run typecheck  # checagem de tipos (tsc --noEmit)
```

Dependências principais: `next`, `react`, `ogl` (shaders WebGL), `three` +
`@react-three/fiber` + `@react-three/drei` + `postprocessing` (efeitos 3D), `gsap` e
`motion` (animação).

---

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx        # layout raiz + fonte (JetBrains Mono)
│  ├─ page.tsx          # HOME / vitrine (hero, projetos, stats)
│  ├─ backgrounds/      # galeria de fundos + /[id] (editor de parâmetros)
│  ├─ biblioteca/       # catálogo unificado com busca + /[id] (detalhe)
│  ├─ sobre/            # sobre, experiência, formação e stack
│  └─ icon.svg          # favicon </>
├─ components/
│  ├─ AnimatedBackground/   # runner dos efeitos de canvas (motor)
│  ├─ backgrounds/
│  │  ├─ shaders/           # 15 fundos WebGL/OGL (React)
│  │  └─ BackgroundStudio / Surface / Preview / Controls / ReactBackground
│  ├─ demos/                # 35 componentes (animações, texto, UI)
│  ├─ JarvisCore/  MatrixGlitch/
│  └─ home/  Nav/  Footer/  ui/
├─ data/                # ⇦ SEU CONTEÚDO: profile.ts, projects.ts, animations.ts
├─ lib/backgrounds/     # engine.js, catalog.ts, react-catalog.ts, demo-catalog.ts, types.ts
└─ styles/              # tokens.css (design tokens), tokens.ts
```

---

## Como customizar

### Visual (cores / estilo)

Tudo vem de **`src/styles/tokens.css`**. A cor-assinatura é uma variável só:

```css
--accent: #c6ff3a; /* troque para repaginar o site inteiro */
```

Ali também ficam tipografia, espaçamento, cantos e sombras. O site é **dark único** — sem
seletor de tema nem modo claro.

### Conteúdo

- **Perfil, skills, experiência e formação:** `src/data/profile.ts`
- **Projetos:** `src/data/projects.ts`
- **Animações CSS:** `src/data/animations.ts`

### Usar um background em qualquer lugar

```tsx
import { AuroraBackground } from "@/components/backgrounds/effects";

<div style={{ position: "relative", height: 400 }}>
  <AuroraBackground params={{ speed: 1.6 }} interactive={false} />
</div>
```

Todos aceitam `params`, `interactive`, `className` e `style`. O container precisa ter tamanho.

### Adicionar um novo background

- **Efeito de canvas:** registre com `reg({ id, name, cat, desc, params, fn })` em
  `src/lib/backgrounds/engine.js` e rode `node scripts/gen-backgrounds.mjs` para regenerar
  `catalog.ts` + `effects.tsx`.
- **Shader React/WebGL:** crie o componente em `src/components/backgrounds/shaders/` e
  registre-o em `src/lib/backgrounds/react-catalog.ts` (com `params` de slider e um
  `propsFrom` que converte os valores em props). Entra automático no catálogo unificado.

### JarvisCore

```tsx
import JarvisCore from "@/components/JarvisCore/JarvisCore";

<JarvisCore color="#c6ff3a" count={3000} />
```

Canvas 2D com projeção pseudo-3D (sem three.js): arraste para girar/inclinar; funciona no PC
e no mobile. `count` reduz partículas em aparelhos mais fracos.

---

## Créditos

Vários backgrounds e componentes são **adaptados do [ReactBits](https://reactbits.dev)**
(licença MIT) — uma biblioteca que admiro e uso como base. O motor de fundos em canvas, o
**JarvisCore**, o **MatrixGlitch**, o campo de vetores e a arquitetura do site são de autoria
própria.

## Observações técnicas

- `npm run build` roda a checagem de tipos como rede de segurança; o ESLint não bloqueia o
  build (rode `npm run lint` à parte).
- A galeria só executa o preview dos cards visíveis (IntersectionObserver) para não estourar
  o limite de contextos WebGL do navegador ao rodar dezenas de canvases ao mesmo tempo.
