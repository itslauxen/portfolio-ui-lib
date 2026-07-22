"use client";

import dynamic from "next/dynamic";

// R3F/three só existe no cliente: carrega a cena sem SSR (o fundo aparece
// num fade natural quando o bundle chega, sobre o preto do hero).
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * Fundo do hero: terreno infinito em wireframe (three.js + React Three Fiber),
 * ruído Perlin no vertex shader, linhas lima sobre preto, fog e parallax de
 * câmera seguindo o mouse. Terreno wireframe animado por vertex shader,
 * rodando ao vivo.
 */
export function HeroBackdrop() {
  return <HeroScene />;
}
