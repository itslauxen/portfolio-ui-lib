"use client";

// Lightfall: cortinas de feixes de luz caindo, raymarching em shader WebGL (OGL).
// Padrao propsRef: o contexto GL e criado uma unica vez e as props sao lidas
// a cada frame para atualizar os uniforms sem recriar o renderer.
import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import styles from "./Lightfall.module.css";

export interface LightfallProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  colors?: string[];
  backgroundColor?: string;
  speed?: number;
  streakCount?: number;
  streakWidth?: number;
  streakLength?: number;
  glow?: number;
  density?: number;
  twinkle?: number;
  zoom?: number;
  backgroundGlow?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  mixBlendMode?: string;
}

type RGB = [number, number, number];

const MAX_COLORS = 8;

const hexToRGB = (hex: string): RGB => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

// Prepara a paleta: preenche ate 8 cores e calcula a media (cor do mouse).
const prepColors = (input?: string[]) => {
  const base = (input && input.length ? input : ["#A6C8FF", "#5227FF", "#FF9FFC"]).slice(0, MAX_COLORS);
  const count = base.length;
  const arr: RGB[] = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg: RGB = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
  o = vec4(colr, uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

const DEFAULT_COLORS = ["#A6C8FF", "#5227FF", "#FF9FFC"];
const DEFAULT_BG = "#0A29FF";

const Lightfall: React.FC<LightfallProps> = (props) => {
  const { className, mixBlendMode } = props;

  // Ref com as props atuais, lida a cada frame pelo loop de animacao.
  const propsRef = useRef<LightfallProps>(props);
  propsRef.current = props;

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initial = propsRef.current;
    const initialDpr = initial.dpr ?? (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

    const renderer = new Renderer({ dpr: initialDpr, alpha: true, antialias: true });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const { arr, count, avg } = prepColors(initial.colors ?? DEFAULT_COLORS);

    const uniforms: Record<string, { value: unknown }> = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uBgColor: { value: hexToRGB(initial.backgroundColor ?? DEFAULT_BG) },
      uMouseColor: { value: avg },
      uSpeed: { value: initial.speed ?? 0.5 },
      uStreakCount: { value: Math.max(1, Math.min(16, Math.round(initial.streakCount ?? 2))) },
      uStreakWidth: { value: initial.streakWidth ?? 1 },
      uStreakLength: { value: initial.streakLength ?? 1 },
      uGlow: { value: initial.glow ?? 1 },
      uDensity: { value: initial.density ?? 0.6 },
      uTwinkle: { value: initial.twinkle ?? 1 },
      uZoom: { value: initial.zoom ?? 3 },
      uBgGlow: { value: initial.backgroundGlow ?? 0.5 },
      uOpacity: { value: initial.opacity ?? 1 },
      uMouseEnabled: { value: (initial.mouseInteraction ?? true) ? 1 : 0 },
      uMouseStrength: { value: initial.mouseStrength ?? 0.5 },
      uMouseRadius: { value: initial.mouseRadius ?? 1 },
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const mouseTarget: [number, number] = [0, 0];
    let lastTime = 0;
    // Chaves usadas para detectar mudanca de cores sem recriar o programa.
    let colorsKey = (initial.colors ?? DEFAULT_COLORS).join(",");
    let bgKey = initial.backgroundColor ?? DEFAULT_BG;

    const onPointerMove = (e: PointerEvent) => {
      const cur = propsRef.current;
      if (!(cur.mouseInteraction ?? true)) return;
      const rect = canvas.getBoundingClientRect();
      const sc = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * sc;
      const y = (rect.height - (e.clientY - rect.top)) * sc;
      mouseTarget[0] = x;
      mouseTarget[1] = y;
      if ((cur.mouseDampening ?? 0.15) <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    canvas.addEventListener("pointermove", onPointerMove);

    let rafId = 0;
    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop);
      const cur = propsRef.current;

      // Atualizacao ao vivo do DPR sem recriar o contexto.
      const targetDpr = cur.dpr ?? (window.devicePixelRatio || 1);
      if (renderer.dpr !== targetDpr) {
        renderer.dpr = targetDpr;
        resize();
      }

      uniforms.iTime.value = t * 0.001;

      // Suavizacao do mouse (dampening exponencial).
      const damp = cur.mouseDampening ?? 0.15;
      if (damp > 0) {
        if (!lastTime) lastTime = t;
        const dt = (t - lastTime) / 1000;
        lastTime = t;
        const tau = Math.max(1e-4, damp);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const curMouse = uniforms.iMouse.value as number[];
        curMouse[0] += (mouseTarget[0] - curMouse[0]) * factor;
        curMouse[1] += (mouseTarget[1] - curMouse[1]) * factor;
      } else {
        lastTime = t;
      }

      // Uniforms escalares lidos das props a cada frame.
      uniforms.uSpeed.value = cur.speed ?? 0.5;
      uniforms.uStreakCount.value = Math.max(1, Math.min(16, Math.round(cur.streakCount ?? 2)));
      uniforms.uStreakWidth.value = cur.streakWidth ?? 1;
      uniforms.uStreakLength.value = cur.streakLength ?? 1;
      uniforms.uGlow.value = cur.glow ?? 1;
      uniforms.uDensity.value = cur.density ?? 0.6;
      uniforms.uTwinkle.value = cur.twinkle ?? 1;
      uniforms.uZoom.value = cur.zoom ?? 3;
      uniforms.uBgGlow.value = cur.backgroundGlow ?? 0.5;
      uniforms.uOpacity.value = cur.opacity ?? 1;
      uniforms.uMouseEnabled.value = (cur.mouseInteraction ?? true) ? 1 : 0;
      uniforms.uMouseStrength.value = cur.mouseStrength ?? 0.5;
      uniforms.uMouseRadius.value = cur.mouseRadius ?? 1;

      // Paleta e fundo so reprocessados quando as cores mudam.
      const curColors = cur.colors ?? DEFAULT_COLORS;
      const key = curColors.join(",");
      if (key !== colorsKey) {
        colorsKey = key;
        const next = prepColors(curColors);
        for (let i = 0; i < MAX_COLORS; i++) uniforms[`uColor${i}`].value = next.arr[i];
        uniforms.uColorCount.value = next.count;
        uniforms.uMouseColor.value = next.avg;
      }
      const curBg = cur.backgroundColor ?? DEFAULT_BG;
      if (curBg !== bgKey) {
        bgKey = curBg;
        uniforms.uBgColor.value = hexToRGB(curBg);
      }

      if (!cur.paused) {
        try {
          renderer.render({ scene: mesh });
        } catch (err) {
          console.error(err);
        }
      }
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className ?? ""}`.trim()}
      style={{
        ...(mixBlendMode && { mixBlendMode: mixBlendMode as React.CSSProperties["mixBlendMode"] }),
      }}
    />
  );
};

export default Lightfall;
