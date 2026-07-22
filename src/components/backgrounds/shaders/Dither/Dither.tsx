"use client";

// Dither, ondas de ruido fractal com pos-processamento de dithering retro
// (three.js + postprocessing). A versao original usava um wrapper R3F de
// pos-processamento que nao esta disponivel aqui, entao o pipeline foi
// reescrito com EffectComposer puro mantendo a mesma API de props e visual.
// O contexto GL e criado uma unica vez; o loop le propsRef a cada frame.
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import styles from "./Dither.module.css";

const waveVertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Shader do efeito de pos-processamento: pixelizacao + dithering Bayer 8x8.
// Os uniforms "resolution" e "inputBuffer" sao injetados pela lib postprocessing.
const ditherFragmentShader = `
uniform float colorNum;
uniform float pixelSize;
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroEffect extends Effect {
  constructor(colorNum: number, pixelSize: number) {
    super("RetroEffect", ditherFragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["colorNum", new THREE.Uniform(colorNum)],
        ["pixelSize", new THREE.Uniform(pixelSize)]
      ])
    });
  }
}

interface DitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Snapshot das props com defaults aplicados, lido a cada frame pelo loop.
  const propsRef = useRef({
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    colorNum,
    pixelSize,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius
  });
  propsRef.current = {
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    colorNum,
    pixelSize,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = propsRef.current;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    // Paridade com o original, que fixava o devicePixelRatio em 1.
    renderer.setPixelRatio(1);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms: Record<string, THREE.IUniform> = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
      waveSpeed: { value: initial.waveSpeed },
      waveFrequency: { value: initial.waveFrequency },
      waveAmplitude: { value: initial.waveAmplitude },
      waveColor: { value: new THREE.Color(...initial.waveColor) },
      mousePos: { value: new THREE.Vector2(0, 0) },
      enableMouseInteraction: { value: initial.enableMouseInteraction ? 1 : 0 },
      mouseRadius: { value: initial.mouseRadius }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms
    });
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const retro = new RetroEffect(initial.colorNum, initial.pixelSize);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera, retro));

    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      const pr = renderer.getPixelRatio();
      (uniforms.resolution.value as THREE.Vector2).set(Math.floor(w * pr), Math.floor(h * pr));
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    const mouseRef = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      if (!propsRef.current.enableMouseInteraction) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const pr = renderer.getPixelRatio();
      mouseRef.set((e.clientX - rect.left) * pr, (e.clientY - rect.top) * pr);
    };
    renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: true });

    const clock = new THREE.Clock();
    let prevColor: [number, number, number] = [...initial.waveColor] as [number, number, number];

    let raf = 0;
    const animate = () => {
      const p = propsRef.current;

      if (!p.disableAnimation) {
        uniforms.time.value = clock.getElapsedTime();
      }

      // Atualiza uniforms ao vivo a partir das props atuais.
      uniforms.waveSpeed.value = p.waveSpeed;
      uniforms.waveFrequency.value = p.waveFrequency;
      uniforms.waveAmplitude.value = p.waveAmplitude;
      uniforms.enableMouseInteraction.value = p.enableMouseInteraction ? 1 : 0;
      uniforms.mouseRadius.value = p.mouseRadius;
      if (!prevColor.every((v, i) => v === p.waveColor[i])) {
        (uniforms.waveColor.value as THREE.Color).setRGB(p.waveColor[0], p.waveColor[1], p.waveColor[2]);
        prevColor = [...p.waveColor] as [number, number, number];
      }
      retro.uniforms.get("colorNum")!.value = p.colorNum;
      retro.uniforms.get("pixelSize")!.value = p.pixelSize;

      if (p.enableMouseInteraction) {
        (uniforms.mousePos.value as THREE.Vector2).copy(mouseRef);
      }

      composer.render();
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      composer.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.container} />;
}
