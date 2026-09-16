// Logo monocromática de tecnologia (simple-icons, CC0), herdando a cor do
// texto via currentColor — no site aparecem em cinza opaco. Nomes sem logo
// oficial caem num "spark" neutro.
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siNodedotjs,
  siExpress,
  siVuedotjs,
  siDocker,
  siPostgresql,
  siMongodb,
  siThreedotjs,
  siSequelize,
  siIonic,
  siQuasar,
  siGsap,
  siPwa,
  siWebgl,
  siOpenjdk,
  siFramer,
  siFigma,
} from "simple-icons";

const MAP: Record<string, { path: string }> = {
  React: siReact,
  "Next.js": siNextdotjs,
  TypeScript: siTypescript,
  "Node.js": siNodedotjs,
  Express: siExpress,
  "Vue.js": siVuedotjs,
  Docker: siDocker,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  "Three.js": siThreedotjs,
  Sequelize: siSequelize,
  Ionic: siIonic,
  Quasar: siQuasar,
  GSAP: siGsap,
  PWA: siPwa,
  WebGL: siWebgl,
  Java: siOpenjdk,
  Motion: siFramer,
  "Design de Interface": siFigma,
  "Interface Design": siFigma,
};

export function TechIcon({ name, size = 16 }: { name: string; size?: number }) {
  const icon = MAP[name];
  if (!icon) {
    // fallback: spark neutro
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M12 3.2 13.9 9l5.9 1.9-5.9 1.9L12 18.6l-1.9-5.8-5.9-1.9L10.1 9 12 3.2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
