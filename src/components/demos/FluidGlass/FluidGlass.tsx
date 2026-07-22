"use client";

// Vidro liquido 3D: uma primitiva de vidro (toro, cubo ou esfera) segue o
// ponteiro e refrata o conteudo da cena, que e renderizado antes num FBO.
// Os modelos .glb da ideia original foram substituidos por geometrias
// nativas do three, e o texto usa textura de canvas (sem fontes externas).

/* eslint-disable react/no-unknown-property */

import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, useFBO } from "@react-three/drei";
import styles from "./FluidGlass.module.css";

type Modo = "torus" | "cubo" | "esfera";

export interface FluidGlassProps {
  /** Forma da lente de vidro. */
  mode?: Modo;
  /** Escala da lente. */
  scale?: number;
  /** Indice de refracao do vidro. */
  ior?: number;
  /** Espessura optica do vidro. */
  thickness?: number;
  /** Aberracao cromatica nas bordas. */
  chromaticAberration?: number;
  anisotropy?: number;
  /** A lente segue o ponteiro; desligado, fica ao centro. */
  followPointer?: boolean;
  /** Cor de destaque dos elementos da cena. */
  color?: string;
  /** Cor de fundo da cena refratada. */
  backgroundColor?: string;
  /** Texto exibido atras do vidro. */
  text?: string;
}

// Gera a textura do texto num canvas fora da tela (nada de fontes remotas).
function useTexturaDeTexto(texto: string): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const familia = "Arial Black, Arial, sans-serif";
    let fontSize = 300;
    ctx.font = `900 ${fontSize}px ${familia}`;
    const largura = ctx.measureText(texto).width;
    const maxLargura = canvas.width * 0.92;
    if (largura > maxLargura) fontSize = (fontSize * maxLargura) / largura;
    ctx.font = `900 ${fontSize}px ${familia}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }, [texto]);
}

// Conteudo da cena refratada: texto central e satelites coloridos em orbita.
function Conteudo({ color, text }: { color: string; text: string }) {
  const grupoRef = useRef<THREE.Group>(null);
  const textura = useTexturaDeTexto(text);

  const satelites = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angulo: (i / 7) * Math.PI * 2,
        raio: 2.6 + (i % 3) * 0.35,
        tamanho: 0.12 + (i % 3) * 0.06,
        velocidade: 0.6 + (i % 4) * 0.18,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!grupoRef.current) return;
    grupoRef.current.children.forEach((filho, i) => {
      const s = satelites[i];
      if (!s) return;
      const a = s.angulo + t * 0.25 * s.velocidade;
      filho.position.set(Math.cos(a) * s.raio, Math.sin(a) * s.raio * 0.5, Math.sin(t * s.velocidade + i) * 0.5);
    });
  });

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[6.4, 1.6]} />
        <meshBasicMaterial map={textura} transparent />
      </mesh>
      <group ref={grupoRef}>
        {satelites.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.tamanho, 24, 24]} />
            <meshBasicMaterial color={i % 2 === 0 ? color : "#ffffff"} />
          </mesh>
        ))}
      </group>
    </>
  );
}

interface CenaProps {
  mode: Modo;
  scale: number;
  ior: number;
  thickness: number;
  chromaticAberration: number;
  anisotropy: number;
  followPointer: boolean;
  color: string;
  backgroundColor: string;
  text: string;
}

function CenaVidro({
  mode,
  scale,
  ior,
  thickness,
  chromaticAberration,
  anisotropy,
  followPointer,
  color,
  backgroundColor,
  text,
}: CenaProps) {
  const lenteRef = useRef<THREE.Mesh>(null);
  const buffer = useFBO();
  const { viewport } = useThree();
  const [cena] = useState(() => new THREE.Scene());

  useEffect(() => {
    cena.background = new THREE.Color(backgroundColor);
  }, [cena, backgroundColor]);

  useFrame((state, delta) => {
    const { gl, camera, pointer } = state;
    const lente = lenteRef.current;
    if (!lente) return;

    // Amortecimento exponencial rumo ao ponteiro (plano z = 15)
    const v = state.viewport.getCurrentViewport(camera, [0, 0, 15]);
    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = followPointer ? (pointer.y * v.height) / 2 : 0;
    const k = 1 - Math.exp(-delta / 0.15);
    lente.position.x += (destX - lente.position.x) * k;
    lente.position.y += (destY - lente.position.y) * k;
    lente.position.z = 15;

    // Giro lento para evidenciar a refracao
    lente.rotation.x += delta * 0.35;
    lente.rotation.y += delta * 0.2;

    // Renderiza o conteudo no FBO antes do quadro principal
    gl.setRenderTarget(buffer);
    gl.render(cena, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(<Conteudo color={color} text={text} />, cena)}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>
      <mesh ref={lenteRef} scale={scale}>
        {mode === "cubo" ? (
          <boxGeometry args={[0.55, 0.55, 0.55]} />
        ) : mode === "esfera" ? (
          <sphereGeometry args={[0.38, 64, 64]} />
        ) : (
          <torusGeometry args={[0.32, 0.15, 48, 96]} />
        )}
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          transmission={1}
          roughness={0}
          ior={ior}
          thickness={thickness}
          anisotropy={anisotropy}
          chromaticAberration={chromaticAberration}
        />
      </mesh>
    </>
  );
}

export default function FluidGlass({
  mode = "torus",
  scale = 1,
  ior = 1.15,
  thickness = 5,
  chromaticAberration = 0.1,
  anisotropy = 0.01,
  followPointer = true,
  color = "#c6ff3a",
  backgroundColor = "#060608",
  text = "Vidro fluido",
}: FluidGlassProps) {
  return (
    <div className={styles.container}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <CenaVidro
          mode={mode}
          scale={scale}
          ior={ior}
          thickness={thickness}
          chromaticAberration={chromaticAberration}
          anisotropy={anisotropy}
          followPointer={followPointer}
          color={color}
          backgroundColor={backgroundColor}
          text={text}
        />
      </Canvas>
    </div>
  );
}
