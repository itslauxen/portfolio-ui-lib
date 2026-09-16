// ============================================================================
// Traduções EN do catálogo da biblioteca (nomes, categorias e descrições).
// Os catálogos-fonte ficam em pt-BR; o estúdio troca em runtime pelo idioma.
// Itens sem entrada aqui caem no texto pt-BR original.
// ============================================================================

/** Categorias (rótulo curto exibido no palco e na busca). */
export const CAT_EN: Record<string, string> = {
  Gradiente: "Gradient",
  Fluido: "Fluid",
  Luz: "Light",
  Pontos: "Dots",
  Retrô: "Retro",
  Shader: "Shader",
  Cards: "Cards",
  "3D": "3D",
  Galeria: "Gallery",
  Navegação: "Navigation",
  Formulário: "Form",
  Hover: "Hover",
  Partículas: "Particles",
  Vitrine: "Showcase",
  Cursor: "Cursor",
  Overlay: "Overlay",
  Clique: "Click",
  Textura: "Texture",
  Borda: "Border",
  Marquee: "Marquee",
  Entrada: "Entrance",
  Digitação: "Typing",
  Estilo: "Style",
  Revelação: "Reveal",
  Linhas: "Lines",
  Geométrico: "Geometric",
  Interativo: "Interactive",
};

/** Nome e descrição EN por id de efeito. */
export const CATALOG_EN: Record<string, { name: string; desc: string }> = {
  // ---- fundos do motor canvas ----
  fluid: {
    name: "Fluid Simulation",
    desc: "GPU Navier-Stokes (WebGL) with automatic colorful splashes. Reacts to the mouse.",
  },
  pipeline: {
    name: "Pipeline",
    desc: "Glowing tubes tracing 45° paths across the screen, leaving trails.",
  },
  mesh: {
    name: "Mesh Gradient",
    desc: "Soft color blobs drifting and blending with blur — a mesh gradient.",
  },
  blobs: {
    name: "Lava / Blobs",
    desc: "Colorful bubbles rising and floating like a lava lamp, heavily blurred.",
  },
  aurora: {
    name: "Aurora",
    desc: "Wavy curtains of light like an aurora borealis, soft and blurred.",
  },
  conic: {
    name: "Conic Gradient",
    desc: "A fan of colors spinning from the center, with a silky soft blur.",
  },
  network: {
    name: "Constellation",
    desc: "Floating dots that connect with lines when close. Reacts to the mouse.",
  },
  matrix: {
    name: "Matrix Glitch",
    desc: "Digital rain of falling glyphs with glitches. Inspired by the MatrixGlitch component.",
  },
  starfield: {
    name: "Hyperspace",
    desc: "Stars racing toward you at warp speed, leaving light trails.",
  },
  fireflies: {
    name: "Fireflies",
    desc: "Points of light wandering through noise, twinkling in the dark.",
  },
  snow: {
    name: "Snow",
    desc: "Flakes falling gently with lateral sway. Calm and minimal.",
  },
  bubbles: {
    name: "Bubbles",
    desc: "Translucent bubbles rising with a slight wobble and shine.",
  },
  flowlines: {
    name: "Flow Field",
    desc: "Thousands of particles following a noise field, forming silky streams.",
  },
  sinewaves: {
    name: "Waves",
    desc: "Layers of translucent sine waves gliding over each other.",
  },
  lowpoly: {
    name: "Low Poly",
    desc: "A triangle mesh that ripples and shifts tone like an animated crystal.",
  },
  hexpulse: {
    name: "Pulsing Honeycomb",
    desc: "A hexagon grid pulsing in waves from the center.",
  },
  ripples: {
    name: "Ripples",
    desc: "Concentric rings expanding across the screen. Reacts to the mouse.",
  },
  synthgrid: {
    name: "Synthwave Grid",
    desc: "A perspective grid rushing to the horizon with a retro sun. 80s vibes.",
  },
  kaleido: {
    name: "Kaleidoscope",
    desc: "Mirrored colorful patterns in radial symmetry, slowly rotating.",
  },
  voronoi: {
    name: "Voronoi",
    desc: "A mosaic of organic cells that move and breathe, like stained glass.",
  },
  spiro: {
    name: "Spirograph",
    desc: "A glowing harmonograph curve redrawing itself in hypnotic loops.",
  },
  plasma: {
    name: "Plasma",
    desc: "Classic demoscene plasma, waves of color blending on the GPU.",
  },
  noiseflow: {
    name: "Silk (Noise Flow)",
    desc: "Fractal noise domain warping, a silky surface slowly flowing.",
  },
  tunnel: {
    name: "Tunnel",
    desc: "An endless dive through a striped tunnel that spins and pulses.",
  },
  swirl: {
    name: "Swirl",
    desc: "A noise vortex swirling around the center like ink in water.",
  },
  starnest: {
    name: "Star Nest",
    desc: "Volumetric fractal star field, an endless cosmic journey (a classic shader).",
  },
  clouds: {
    name: "Color Clouds",
    desc: "Soft fractal clouds slowly morphing between three colors.",
  },
  tunnel3d: {
    name: "3D Neon Tunnel",
    desc: "An endless flight through pulsing neon rings, electronic-festival mood.",
  },
  terrain3d: {
    name: "Terrain Flyover",
    desc: "Flying over a synthwave wireframe landscape scrolling to the horizon.",
  },
  solids3d: {
    name: "Neon Icosahedron",
    desc: "A neon polyhedron spinning in 3D with glowing faces and edges. Drag it.",
  },
  bars3d: {
    name: "3D Equalizer",
    desc: "A city of 3D bars pulsing like an audio spectrum, electronic-stage mood.",
  },
  particles3d: {
    name: "3D Core / Galaxy",
    desc: "A pseudo-3D particle field forming a galaxy, solar system, rings, torus or atom.",
  },
  cubecore: {
    name: "Neon Cube (Core)",
    desc: "Nested neon wireframe cubes spinning in 3D, like a mini Jarvis core. Drag it.",
  },
  gradientwave: {
    name: "Gradient Wave",
    desc: "A fluid gradient waving between three colors — a calm, modern backdrop.",
  },
  confetti: {
    name: "Confetti",
    desc: "Colorful paper spinning as it falls. Festive and full of color.",
  },
  raymarch: {
    name: "Infinite Raymarch",
    desc: "Real-time 3D (raymarching), an endless field of neon objects flying by.",
  },
  rmspheres: {
    name: "Sphere Tunnel",
    desc: "A flight through an endless field of lit spheres, looping forever.",
  },
  rmrings: {
    name: "Infinite Rings",
    desc: "Pass through an endless run of neon rings coming your way.",
  },
  rmocta: {
    name: "Octahedron Tunnel",
    desc: "Octahedral crystals repeated to infinity, lit, in continuous flight.",
  },
  rmcolumns: {
    name: "Infinite Colonnade",
    desc: "An endless corridor lined with neon columns passing on both sides.",
  },
  svgGeo: {
    name: "Geometric Mandala (SVG)",
    desc: "SVG vector animation: concentric polygons spinning in symmetry.",
  },
  svgWaves: {
    name: "Geometric Waves (SVG)",
    desc: "Layers of translucent SVG waves gliding softly over each other.",
  },
  vectorfield: {
    name: "Vectors (point at the mouse)",
    desc: "A grid of little sticks turning to point at (or flee) the cursor, with springy return.",
  },

  // ---- shaders React/OGL ----
  "aurora-gl": {
    name: "Aurora Borealis",
    desc: "Waving curtains of light in a WebGL shader, with organic noise and smooth blending of three colors.",
  },
  grainient: {
    name: "Grainy Gradient",
    desc: "A WebGL2 shader gradient with warp, film grain and rotation — colors melting in slow motion.",
  },
  gradientblinds: {
    name: "Gradient Blinds",
    desc: "WebGL gradient blinds with a spotlight that follows the mouse — vibrant and interactive.",
  },
  plasmawave: {
    name: "Plasma Wave",
    desc: "Raymarched plasma waves, glowing ribbons that ripple and flow.",
  },
  lightrays: {
    name: "Light Rays",
    desc: "Volumetric light beams from an origin point, with soft glow and mouse response.",
  },
  ferrofluid: {
    name: "Ferrofluid",
    desc: "Dark magnetic fluid with glowing crests that drip and merge, in a WebGL shader.",
  },
  lightfall: {
    name: "Lightfall",
    desc: "Colored light beams streaming down a curved tunnel, with sparkle and background glow.",
  },
  liquidether: {
    name: "Liquid Ether",
    desc: "A colorful fluid simulation that reacts to the cursor and drifts on its own when idle.",
  },
  dotgrid: {
    name: "Dot Grid",
    desc: "An interactive dot grid: fast mouse movement pushes dots and clicks fire shockwaves.",
  },
  faultyterminal: {
    name: "Faulty Terminal",
    desc: "A retro CRT terminal with procedural digits, scanlines, glitches and adjustable curvature.",
  },
  pixelblast: {
    name: "Pixel Blast",
    desc: "Fractal-noise pixels with click ripples, in four cell shapes.",
  },
  colorbends: {
    name: "Color Bends",
    desc: "Bands of color folding and flowing in organic waves, with parallax and mouse response.",
  },
  beams: {
    name: "Light Beams",
    desc: "3D vertical beams deformed by Perlin noise, with physical lighting and subtle grain.",
  },
  dither: {
    name: "Retro Waves (Dither)",
    desc: "Fractal-noise waves quantized with retro Bayer dithering, in a few pixelated tones.",
  },

  // ---- demos / componentes ----
  dotfield: {
    name: "Dot Field",
    desc: "A 2D canvas dot grid that bulges or repels around the cursor, with an optional ambient wave.",
  },
  magicbento: {
    name: "Magic Bento",
    desc: "A bento grid with spotlight, border glow, particles and cursor magnetism.",
  },
  fluidglass: {
    name: "Fluid Glass",
    desc: "A 3D glass lens following the cursor, refracting the scene with chromatic aberration.",
  },
  tiltedcard: {
    name: "Tilted Card",
    desc: "An image card tilting in 3D with the cursor, with a floating caption.",
  },
  masonry: {
    name: "Animated Masonry",
    desc: "A masonry image grid with GSAP entrance and soft zoom on hover.",
  },
  dock: {
    name: "Magnetic Dock",
    desc: "A dock-style shortcut bar where icons grow as the cursor approaches.",
  },
  gooeynav: {
    name: "Gooey Nav",
    desc: "A menu with liquid transitions and particle bursts when switching items.",
  },
  pixelcard: {
    name: "Pixel Card",
    desc: "A card that gets a rain of colored pixels on hover or focus.",
  },
  spotlightcard: {
    name: "Spotlight Card",
    desc: "A dark card with a soft colored spotlight following the cursor.",
  },
  borderglow: {
    name: "Border Glow",
    desc: "A card whose border lights a conic glow tracking the cursor angle.",
  },
  stepper: {
    name: "Stepper",
    desc: "A wizard with animated sliding steps, clickable indicators and progress.",
  },
  glarehover: {
    name: "Glare Hover",
    desc: "A card swept by a streak of glare as the cursor passes.",
  },
  pixeltransition: {
    name: "Pixel Transition",
    desc: "Content swap through a sweep of random pixels on hover.",
  },
  antigravity: {
    name: "Antigravity",
    desc: "3D particles levitating and orbiting the cursor into a magnetic ring.",
  },
  logoloop: {
    name: "Logo Loop",
    desc: "An endless row of logos sliding in a loop, fading at the edges.",
  },
  targetcursor: {
    name: "Target Cursor",
    desc: "A crosshair cursor that spins at rest and locks its corners onto targets.",
  },
  magnetlines: {
    name: "Magnet Lines",
    desc: "A grid of strokes rotating to point at the cursor, like compasses.",
  },
  ghostcursor: {
    name: "Ghost Cursor",
    desc: "An ethereal smoke trail with bloom that follows the cursor and fades.",
  },
  gradualblur: {
    name: "Gradual Blur",
    desc: "A progressive blur band dissolving content at one edge.",
  },
  clickspark: {
    name: "Click Spark",
    desc: "A burst of radial sparks on every click inside the area.",
  },
  magnet: {
    name: "Magnet",
    desc: "An element gently pulled toward the cursor within a set radius.",
  },
  metallicpaint: {
    name: "Metallic Paint",
    desc: "Liquid metallic paint flowing inside procedurally generated text.",
  },
  noise: {
    name: "Noise",
    desc: "Animated film grain covering the area, with adjustable scale and opacity.",
  },
  shapeblur: {
    name: "Shape Reveal",
    desc: "An SDF shape whose outline is revealed by a soft circle following the cursor.",
  },
  starborder: {
    name: "Star Border",
    desc: "A button with points of light running along the border in opposite directions.",
  },
  metaballs: {
    name: "Meta Balls",
    desc: "Liquid blobs merging organically and following the cursor, in WebGL.",
  },
  curvedloop: {
    name: "Curved Loop",
    desc: "Text looping endlessly along a curve, draggable with the pointer.",
  },
  splittext: {
    name: "Split Text",
    desc: "Letters or words animate in one by one with GSAP.",
  },
  blurtext: {
    name: "Blur Text",
    desc: "Text entering from blur to focus, word by word or letter by letter.",
  },
  texttype: {
    name: "Typewriter",
    desc: "Cyclic typing and deleting of phrases, with a blinking caret.",
  },
  gradienttext: {
    name: "Gradient Text",
    desc: "An animated gradient sweeping the text, with adjustable direction and rhythm.",
  },
  decryptedtext: {
    name: "Decrypted Text",
    desc: "Scrambled characters deciphering to reveal the text in sequence.",
  },
  asciitext: {
    name: "ASCII Text",
    desc: "Waving 3D text rendered as a grid of ASCII characters.",
  },
  variableproximity: {
    name: "Variable Font",
    desc: "Font weight shifting with the cursor's proximity to each letter.",
  },
  shinytext: {
    name: "Shiny Text",
    desc: "A streak of shine sliding across the text in a loop, with adjustable angle and pace.",
  },
};
