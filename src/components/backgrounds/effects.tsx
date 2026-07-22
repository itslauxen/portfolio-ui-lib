"use client";
// ============================================================================
// Um componente React por background. Gerado a partir do catálogo.
// Uso: <FluidBackground /> ou <AuroraBackground params={{ speed: 2 }} />
// Regenere com: node scripts/gen-backgrounds.mjs
// ============================================================================
import { AnimatedBackground, type BackgroundOwnProps } from "@/components/AnimatedBackground/AnimatedBackground";

/** Simulação de Fluido, Fluido. Navier-Stokes na GPU (WebGL) com respingos coloridos automáticos. Reage ao mouse. */
export function FluidBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="fluid" {...props} />;
}

/** Pipeline, Linhas. Tubos luminosos que percorrem a tela em curvas de 45°, deixando rastros (Ambient Canvas). */
export function PipelineBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="pipeline" {...props} />;
}

/** Mesh Gradient, Gradiente. Manchas de cor suaves que flutuam e se fundem com desfoque, gradiente em malha. */
export function MeshBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="mesh" {...props} />;
}

/** Lava / Blobs, Gradiente. Bolhas coloridas que sobem e flutuam como uma lâmpada de lava, bem desfocadas. */
export function BlobsBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="blobs" {...props} />;
}

/** Aurora, Gradiente. Cortinas de luz onduladas como uma aurora boreal, suaves e desfocadas. */
export function AuroraBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="aurora" {...props} />;
}

/** Gradiente Cônico, Gradiente. Leque de cores girando a partir do centro, com leve desfoque sedoso. */
export function ConicBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="conic" {...props} />;
}

/** Constelação, Partículas. Pontos que flutuam e se conectam por linhas quando próximos. Reage ao mouse. */
export function NetworkBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="network" {...props} />;
}

/** Matrix Glitch, Partículas. Chuva digital de glifos caindo com falhas/glitch. Inspirado no componente MatrixGlitch. */
export function MatrixBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="matrix" {...props} />;
}

/** Hiperespaço, Partículas. Estrelas que correm em direção a você em velocidade de dobra, deixando rastros. */
export function StarfieldBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="starfield" {...props} />;
}

/** Vaga-lumes, Partículas. Pontos de luz que vagam suavemente pelo ruído e cintilam no escuro. */
export function FirefliesBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="fireflies" {...props} />;
}

/** Neve, Partículas. Flocos caindo suavemente com balanço lateral. Tranquilo e minimalista. */
export function SnowBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="snow" {...props} />;
}

/** Bolhas, Partículas. Bolhas translúcidas que sobem com leve oscilação e brilho. */
export function BubblesBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="bubbles" {...props} />;
}

/** Campo de Fluxo, Geométrico. Milhares de partículas seguindo um campo de ruído, formando correntes sedosas. */
export function FlowlinesBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="flowlines" {...props} />;
}

/** Ondas, Geométrico. Camadas de ondas senoidais translúcidas deslizando umas sobre as outras. */
export function SinewavesBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="sinewaves" {...props} />;
}

/** Low Poly, Geométrico. Malha de triângulos que ondula e muda de tom como um cristal animado. */
export function LowpolyBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="lowpoly" {...props} />;
}

/** Favo Pulsante, Geométrico. Grade de hexágonos que pulsa em ondas a partir do centro. */
export function HexpulseBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="hexpulse" {...props} />;
}

/** Ondulações, Geométrico. Anéis concêntricos que se expandem pela tela. Reage ao mouse. */
export function RipplesBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="ripples" {...props} />;
}

/** Grade Synthwave, Geométrico. Grade em perspectiva correndo até o horizonte com sol retrô. Estética anos 80. */
export function SynthgridBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="synthgrid" {...props} />;
}

/** Caleidoscópio, Geométrico. Padrões coloridos espelhados em simetria radial, girando lentamente. */
export function KaleidoBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="kaleido" {...props} />;
}

/** Voronoi, Geométrico. Mosaico de células orgânicas que se movem e respiram, tipo vitral. */
export function VoronoiBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="voronoi" {...props} />;
}

/** Spirograph, Geométrico. Curva harmonográfica luminosa que se redesenha em laços hipnóticos. */
export function SpiroBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="spiro" {...props} />;
}

/** Plasma, Shader. Plasma clássico de demoscene, ondas de cor fundindo-se na GPU. */
export function PlasmaBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="plasma" {...props} />;
}

/** Seda (Fluxo de Ruído), Shader. Domain warping de ruído fractal, superfície sedosa que escorre devagar. */
export function NoiseflowBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="noiseflow" {...props} />;
}

/** Túnel, Shader. Mergulho infinito por um túnel listrado que gira e pulsa. */
export function TunnelBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="tunnel" {...props} />;
}

/** Redemoinho, Shader. Vórtice de ruído que rodopia em torno do centro como tinta na água. */
export function SwirlBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="swirl" {...props} />;
}

/** Star Nest, Shader. Campo estelar fractal volumétrico, viagem cósmica infinita (shader clássico de Kali). */
export function StarnestBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="starnest" {...props} />;
}

/** Nuvens de Cor, Shader. Nuvens fractais suaves que se transformam lentamente entre três cores. */
export function CloudsBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="clouds" {...props} />;
}

/** Túnel Neon 3D, 3D. Voo infinito por um túnel de anéis neon que pulsam, clima de festival eletrônico. */
export function Tunnel3dBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="tunnel3d" {...props} />;
}

/** Voo sobre Terreno, 3D. Sobrevoo de um relevo wireframe estilo synthwave, rolando até o horizonte. */
export function Terrain3dBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="terrain3d" {...props} />;
}

/** Icosaedro Neon, 3D. Poliedro neon girando em 3D com faces brilhantes e arestas que reluzem. Arraste para girar. */
export function Solids3dBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="solids3d" {...props} />;
}

/** Equalizador 3D, 3D. Cidade de barras 3D pulsando como um espectro de áudio, clima de palco eletrônico. */
export function Bars3dBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="bars3d" {...props} />;
}

/** Núcleo 3D / Galáxia, 3D. Campo de partículas pseudo-3D formando galáxia, sistema solar, anéis, toro ou átomo. Arraste para girar. */
export function Particles3dBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="particles3d" {...props} />;
}

/** Cubo Neon (Core), 3D. Cubos de arame neon aninhados girando em 3D, tipo um mini núcleo Jarvis. Arraste para girar. */
export function CubecoreBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="cubecore" {...props} />;
}

/** Onda Gradiente, Shader. Gradiente fluido que ondula entre três cores, fundo calmo e moderno. */
export function GradientwaveBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="gradientwave" {...props} />;
}

/** Confete, Partículas. Papéis coloridos girando enquanto caem. Festivo e cheio de cor. */
export function ConfettiBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="confetti" {...props} />;
}

/** Raymarch Infinito, Shader. Render 3D em tempo real (raymarching), campo infinito de objetos neon voando até você. */
export function RaymarchBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="raymarch" {...props} />;
}

/** Túnel de Esferas, Shader. Voo por um campo infinito de esferas iluminadas, em loop contínuo. */
export function RmspheresBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="rmspheres" {...props} />;
}

/** Anéis Infinitos, Shader. Atravesse uma sucessão infinita de anéis (toros) neon que vêm na sua direção. */
export function RmringsBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="rmrings" {...props} />;
}

/** Túnel de Octaedros, Shader. Cristais octaédricos repetidos ao infinito, iluminados, em voo contínuo. */
export function RmoctaBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="rmocta" {...props} />;
}

/** Colunata Infinita, Shader. Corredor sem fim ladeado por colunas neon que passam dos dois lados. */
export function RmcolumnsBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="rmcolumns" {...props} />;
}

/** Mandala Geométrica (SVG), Geométrico. Animação vetorial em SVG: polígonos concêntricos girando em simetria, geometria pura e nítida. */
export function SvgGeoBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="svgGeo" {...props} />;
}

/** Ondas Geométricas (SVG), Geométrico. Camadas de ondas vetoriais (SVG) deslizando suavemente, translúcidas e sobrepostas. */
export function SvgWavesBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="svgWaves" {...props} />;
}

/** Vetores (apontam pro mouse), Interativo. Uma malha de palitinhos que giram para apontar (ou fugir) do cursor, com retorno suave quando o mouse sai. Funciona com toque no mobile. */
export function VectorfieldBackground(props: BackgroundOwnProps) {
  return <AnimatedBackground effectId="vectorfield" {...props} />;
}

// Mapa id -> componente, útil para render dinâmico.
export const BACKGROUND_COMPONENTS = {
  "fluid": FluidBackground,
  "pipeline": PipelineBackground,
  "mesh": MeshBackground,
  "blobs": BlobsBackground,
  "aurora": AuroraBackground,
  "conic": ConicBackground,
  "network": NetworkBackground,
  "matrix": MatrixBackground,
  "starfield": StarfieldBackground,
  "fireflies": FirefliesBackground,
  "snow": SnowBackground,
  "bubbles": BubblesBackground,
  "flowlines": FlowlinesBackground,
  "sinewaves": SinewavesBackground,
  "lowpoly": LowpolyBackground,
  "hexpulse": HexpulseBackground,
  "ripples": RipplesBackground,
  "synthgrid": SynthgridBackground,
  "kaleido": KaleidoBackground,
  "voronoi": VoronoiBackground,
  "spiro": SpiroBackground,
  "plasma": PlasmaBackground,
  "noiseflow": NoiseflowBackground,
  "tunnel": TunnelBackground,
  "swirl": SwirlBackground,
  "starnest": StarnestBackground,
  "clouds": CloudsBackground,
  "tunnel3d": Tunnel3dBackground,
  "terrain3d": Terrain3dBackground,
  "solids3d": Solids3dBackground,
  "bars3d": Bars3dBackground,
  "particles3d": Particles3dBackground,
  "cubecore": CubecoreBackground,
  "gradientwave": GradientwaveBackground,
  "confetti": ConfettiBackground,
  "raymarch": RaymarchBackground,
  "rmspheres": RmspheresBackground,
  "rmrings": RmringsBackground,
  "rmocta": RmoctaBackground,
  "rmcolumns": RmcolumnsBackground,
  "svgGeo": SvgGeoBackground,
  "svgWaves": SvgWavesBackground,
  "vectorfield": VectorfieldBackground,
} as const;
