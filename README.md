# Studio — Portfólio & Biblioteca

Um site em **Next.js (App Router) + React + TypeScript + CSS Modules** que funciona ao
mesmo tempo como **portfólio** e como **biblioteca reutilizável** de:

- **Backgrounds** — biblioteca única de fundos animados parametrizados (Canvas 2D, WebGL e
  shaders), **misturados** num só catálogo, com preview ao vivo, **sliders para cada
  parâmetro** e exportação de código.
- **Animações** — animações CSS prontas para copiar + duas interativas em destaque
  (**Campo de Vetores** e **JarvisCore**, partículas 3D).
- **Prompts** — seus prompts organizados por categoria, com busca e cópia em 1 clique.

Tema **dark único e minimalista**, com **design tokens** centralizados (cores, tipografia,
espaçamento e forma num só lugar).

---

## Como rodar

Requer **Node 18+**.

```bash
npm install
npm run dev      # ambiente de desenvolvimento em http://localhost:3000
npm run build    # build de produção
npm start        # sobe o build de produção
npm run typecheck
```

---

## Estrutura

```
src/
├─ app/                     # rotas (App Router)
│  ├─ layout.tsx            # layout raiz (dark único)
│  ├─ page.tsx              # HOME / vitrine (hero com Persianas de Gradiente)
│  ├─ backgrounds/          # galeria unificada + editor de parâmetros
│  ├─ animacoes/            # animações interativas + CSS
│  ├─ prompts/              # prompts com busca/cópia
│  ├─ biblioteca/           # busca unificada (tudo junto)
│  └─ sobre/
├─ components/
│  ├─ AnimatedBackground/   # runner React dos efeitos de canvas (motor)
│  ├─ backgrounds/          # galeria/editor + BackgroundSurface/ReactBackground
│  │  └─ shaders/           # fundos em shader WebGL (OGL): Aurora, Grainient,
│  │                        #   LightRays, GradientBlinds
│  ├─ JarvisCore/           # partículas 3D (portado do Nova Notes)
│  ├─ MatrixGlitch/         # digital rain (portado do Nova Notes)
│  ├─ Nav/ Footer/ ui/ ...
├─ data/                    # ⇦ EDITE AQUI seu conteúdo
│  ├─ profile.ts            # nome, cargo, bio, redes, skills
│  ├─ projects.ts           # projetos do portfólio
│  ├─ prompts.ts            # seus prompts
│  └─ animations.ts (+.css) # animações CSS + código copiável
├─ lib/backgrounds/
│  ├─ engine.js             # MOTOR: PRELUDE + efeitos de canvas (fn pura por efeito)
│  ├─ catalog.ts            # metadados dos fundos de canvas (gerados do motor)
│  ├─ react-catalog.ts      # fundos em shader (React/OGL) com seus parâmetros
│  ├─ types.ts  index.ts    # tipos + catálogo unificado + helpers
└─ styles/
   ├─ tokens.css            # ⇦ DESIGN TOKENS (cores, tipografia, espaçamento)
   └─ tokens.ts             # espelho em TS dos tokens
```

---

## Como customizar

### 1. Mudar o visual (cores/estilo)

Tudo vem de **`src/styles/tokens.css`**. Troque as 3 cores de marca no `:root`:

```css
--accent: #7c5cff;
--accent-2: #00e5ff;
--accent-3: #ff4d9d;
```

O espelho em TS desses tokens (para usar as cores no JS) fica em `src/styles/tokens.ts`.
O site é **dark único** — não há seletor de tema nem modo claro.

### 2. Seu conteúdo

- **Perfil / skills:** `src/data/profile.ts`
- **Projetos:** `src/data/projects.ts`
- **Prompts:** `src/data/prompts.ts`
- **Animações CSS:** `src/data/animations.ts` (código copiável) + `animations.module.css`
  (a classe usada no preview).

### 3. Usar um background em qualquer lugar

Cada fundo é um componente:

```tsx
import { AuroraBackground } from "@/components/backgrounds/effects";

<div style={{ position: "relative", height: 400 }}>
  <AuroraBackground params={{ speed: 1.6 }} interactive={false} />
</div>
```

Todos aceitam `params`, `interactive`, `className` e `style`. O container precisa ter
tamanho (o canvas preenche 100%).

### 4. Adicionar um novo background

1. Abra `src/lib/backgrounds/engine.js` e registre com `reg({ id, name, cat, desc, params, fn })`
   (mesmo formato dos existentes; `fn(canvas, getP)` deve devolver `{ stop() }`).
2. Regenere o catálogo e os componentes:

```bash
node scripts/gen-backgrounds.mjs
```

> O script lê o motor e reescreve `catalog.ts` + `effects.tsx`.

Para um fundo em **shader React/WebGL** (como Aurora ou Persianas de Gradiente), crie o
componente em `src/components/backgrounds/shaders/` e registre-o em
`src/lib/backgrounds/react-catalog.ts` (com `params` no formato de sliders e um `propsFrom`
que converte os valores em props). Ele entra automaticamente no mesmo catálogo, misturado
por categoria.

### 5. JarvisCore e MatrixGlitch

```tsx
import JarvisCore from "@/components/JarvisCore/JarvisCore";
import MatrixGlitch from "@/components/MatrixGlitch/MatrixGlitch";

<JarvisCore color="#7c5cff" mode="dark" count={3000} />
```

`JarvisCore` é canvas 2D com projeção pseudo-3D (sem three.js): arraste para girar/inclinar,
funciona no PC e no mobile. `count` reduz partículas para aparelhos mais fracos.

---

## Créditos / origem dos assets

- **myBackgrounds** — biblioteca original de fundos parametrizados (o `index.html` enviado).
  Portada aqui para o motor `engine.js` + componentes React. O efeito "cigarro" foi omitido
  a pedido. Foi adicionado um novo efeito: **Campo de Vetores** (palitinhos que apontam pro mouse).
- **Nova Notes** — https://nova-notes-six.vercel.app/ · de onde vieram o **JarvisCore** e o
  **MatrixGlitch**.

## Observações

- `npm run build` roda a checagem de tipos (TypeScript) como rede de segurança. O ESLint
  não bloqueia o build por padrão — rode `npm run lint` quando quiser.
- A galeria só executa o preview dos cards visíveis (IntersectionObserver) para não estourar
  o limite de contextos WebGL do navegador ao rodar dezenas de canvases.
