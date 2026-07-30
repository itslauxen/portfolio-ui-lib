# gabriel_lauxen — portfolio & component library

A **Next.js (App Router) · React · TypeScript · CSS Modules** site that is, at the same time,
Gabriel Lauxen's **portfolio** (fullstack developer) and a **reusable library of ~90
parametrized visual components**.

**Neo-brutalist terminal** identity: monospace (JetBrains Mono), lime signature color
(`#c6ff3a`) over near-black, hard corners and blur-less shadows — all controlled by centralized
design tokens.

---

## What's inside

A **single library**, with search and live preview, bringing together:

- **Backgrounds (59)** — parametrized animated backgrounds mixed into one catalog:
  **43** effects from a custom `<canvas>` engine (2D/WebGL) + **16** React/OGL shaders
  (Aurora, Grainient, LightRays, LiquidEther, PlasmaWave, GradientBlinds, Dither, Beams…).
  Each one with **per-parameter sliders** and **copyable code**.
- **Demos (35)** — animations, text effects and UI components (Dock, MagicBento,
  TiltedCard, SplitText, ClickSpark, MagnetLines, GooeyNav…).
- **Original highlights** — **JarvisCore** (3D particles in pure canvas, no three.js),
  **MatrixGlitch** and an interactive **vector field**.

---

## Running it

Requires **Node 18+**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the build
npm run typecheck  # type checking (tsc --noEmit)
```

Main dependencies: `next`, `react`, `ogl` (WebGL shaders), `three` +
`@react-three/fiber` + `@react-three/drei` + `postprocessing` (3D effects), `gsap` and
`motion` (animation).

---

## Structure

```
src/
├─ app/
│  ├─ layout.tsx        # root layout + font (JetBrains Mono)
│  ├─ page.tsx          # HOME / showcase (hero, projects, stats)
│  ├─ backgrounds/      # background gallery + /[id] (parameter editor)
│  ├─ biblioteca/       # unified catalog with search + /[id] (detail)
│  ├─ sobre/            # about, experience, education and stack
│  └─ icon.svg          # favicon </>
├─ components/
│  ├─ AnimatedBackground/   # runner for the canvas effects (engine)
│  ├─ backgrounds/
│  │  ├─ shaders/           # 15 WebGL/OGL backgrounds (React)
│  │  └─ BackgroundStudio / Surface / Preview / Controls / ReactBackground
│  ├─ demos/                # 35 components (animations, text, UI)
│  ├─ JarvisCore/  MatrixGlitch/
│  └─ home/  Nav/  Footer/  ui/
├─ data/                # ⇦ YOUR CONTENT: profile.ts, projects.ts, animations.ts
├─ lib/backgrounds/     # engine.js, catalog.ts, react-catalog.ts, demo-catalog.ts, types.ts
└─ styles/              # tokens.css (design tokens), tokens.ts
```

---

## Customizing

### Look (colors / style)

Everything comes from **`src/styles/tokens.css`**. The signature color is a single variable:

```css
--accent: #c6ff3a; /* change it to reskin the whole site */
```

Typography, spacing, corners and shadows live there too. The site is **single dark theme** —
no theme switcher or light mode.

### Content

- **Profile, skills, experience and education:** `src/data/profile.ts`
- **Projects:** `src/data/projects.ts`
- **CSS animations:** `src/data/animations.ts`

### Using a background anywhere

```tsx
import { AuroraBackground } from "@/components/backgrounds/effects";

<div style={{ position: "relative", height: 400 }}>
  <AuroraBackground params={{ speed: 1.6 }} interactive={false} />
</div>
```

All of them accept `params`, `interactive`, `className` and `style`. The container needs a size.

### Adding a new background

- **Canvas effect:** register it with `reg({ id, name, cat, desc, params, fn })` in
  `src/lib/backgrounds/engine.js` and run `node scripts/gen-backgrounds.mjs` to regenerate
  `catalog.ts` + `effects.tsx`.
- **React/WebGL shader:** create the component in `src/components/backgrounds/shaders/` and
  register it in `src/lib/backgrounds/react-catalog.ts` (with slider `params` and a
  `propsFrom` that turns the values into props). It joins the unified catalog automatically.

### JarvisCore

```tsx
import JarvisCore from "@/components/JarvisCore/JarvisCore";

<JarvisCore color="#c6ff3a" count={3000} />
```

A 2D canvas with pseudo-3D projection (no three.js): drag to rotate/tilt; works on desktop and
mobile. `count` lowers the particle count on weaker devices.

---

## Credits

Several backgrounds and components are **adapted from [ReactBits](https://reactbits.dev)**
(MIT license) — a library I admire and use as a base. The canvas background engine,
**JarvisCore**, **MatrixGlitch**, the vector field and the site architecture are my own work.

## Technical notes

- `npm run build` runs type checking as a safety net; ESLint doesn't block the build
  (run `npm run lint` separately).
- The gallery only runs the preview for visible cards (IntersectionObserver) so it doesn't blow
  past the browser's WebGL context limit when running dozens of canvases at once.

---

Built by **Gabriel Lauxen** — [github.com/itslauxen](https://github.com/itslauxen) · [LinkedIn](https://www.linkedin.com/in/gabriel-lauxen-36822a231/)
