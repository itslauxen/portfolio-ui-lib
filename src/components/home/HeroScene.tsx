"use client";

// Cena 3D do hero: terreno infinito em wireframe (grade quadrada no fragment
// shader) deslocado por ruído simplex no vertex shader, linhas lima sobre
// preto, fog por distância e parallax sutil de câmera seguindo o mouse.
// Cena renderizada ao vivo.
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec2 vGrid;
  varying float vElev;
  varying float vDepth;
  varying vec2 vUvv;

  // Ruído simplex 2D (Ashima / Ian McEwan, domínio público).
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUvv = uv;
    // O mesh é rotacionado -90° em X, então no espaço LOCAL do plano:
    // x = largura, y = profundidade (vira -z no mundo), z = altura (vira +y).
    // Coordenada que "anda" para a câmera: grid e relevo fluem juntos.
    vec2 flow = vec2(position.x, position.y + uTime * 2.4);
    vGrid = flow * 0.5;

    float n = snoise(flow * 0.11) * 0.75 + snoise(flow * 0.045) * 1.5;
    // Vale plano no centro (por onde a câmera "voa"), montanhas nas bordas.
    float valley = smoothstep(1.2, 7.5, abs(position.x));
    float elev = n * uAmp * (0.22 + 0.78 * valley);

    vElev = elev;
    vec3 p = vec3(position.xy, elev);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vGrid;
  varying float vElev;
  varying float vDepth;
  varying vec2 vUvv;

  void main() {
    // Linhas de grade quadradas, anti-aliased (sem diagonais de wireframe).
    vec2 g = abs(fract(vGrid - 0.5) - 0.5) / fwidth(vGrid);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    // Fog: some no horizonte. Fade também nas laterais do plano.
    float fog = 1.0 - smoothstep(6.0, 34.0, vDepth);
    float edge = smoothstep(0.0, 0.12, vUvv.x) * smoothstep(0.0, 0.12, 1.0 - vUvv.x);

    // Picos mais brilhantes + pulso de luz viajando do horizonte.
    float peak = smoothstep(0.4, 2.6, vElev) * 0.55;
    float pulse = smoothstep(0.028, 0.0, abs(fract(vGrid.y * 0.04 + uTime * 0.06) - 0.5)) * 0.35;

    float glow = line * fog * edge;
    vec3 base = vec3(0.012, 0.014, 0.010);
    vec3 col = base + uColor * glow * (0.42 + peak + pulse);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Terrain({ segments }: { segments: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 2.1 },
      uColor: { value: new THREE.Color("#c6ff3a") },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
    // Parallax suave: a câmera desliza levemente na direção do mouse.
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, mouse.current.x * 1.4, 0.04);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, 2.3 - mouse.current.y * 0.5, 0.04);
    cam.lookAt(0, 0.6, -14);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      {/* Plano no XZ (rotacionado): x = largura, z = profundidade. */}
      <planeGeometry args={[46, 44, segments, segments]} />
      <shaderMaterial ref={matRef} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  );
}

export default function HeroScene() {
  // Menos geometria no mobile; nada de render se o usuário prefere menos motion.
  const [segments, setSegments] = useState(128);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) setSegments(72);
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 2.3, 9], fov: 60, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Terrain segments={segments} />
    </Canvas>
  );
}
