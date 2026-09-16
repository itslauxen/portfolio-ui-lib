"use client";

// Asset do hero: PCB flutuando em 3D. Duas camadas SVG empilhadas com
// preserve-3d (placa embaixo, encapsulamentos acima em translateZ), tilt de
// perspectiva seguindo o mouse e flutuação lenta. As trilhas Manhattan, vias,
// SMDs e tempos dos pulsos são gerados proceduralmente com seed fixa — o
// mesmo desenho no servidor e no cliente (hidratação estável).
import { useEffect, useRef } from "react";
import styles from "./heroChip.module.css";

// LCG determinístico: nada de Math.random (quebraria a hidratação).
function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 48271) % 2147483647) / 2147483647);
}
const rand = lcg(20260915);
const between = (a: number, b: number) => a + (b - a) * rand();
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// ---- CPU central (200..280 x, 170..250 y) e pinos de onde saem trilhas ----
const PINS_X = [205, 215, 225, 235, 245, 255, 265, 275];

interface Trace {
  d: string;
  end: [number, number];
  dur: number;
  delay: number;
}

// Trilha Manhattan: sai do pino, anda, dá 1 cotovelo, anda de novo.
function trace(x: number, y: number, dir: "up" | "down" | "left" | "right"): Trace {
  const a = between(26, 74);
  const jog = between(14, 62) * (rand() > 0.5 ? 1 : -1);
  const b = between(14, 58);
  let d = `M${x} ${y}`;
  let ex = x;
  let ey = y;
  if (dir === "up" || dir === "down") {
    const sg = dir === "up" ? -1 : 1;
    ey = clamp(y + sg * a, 18, 402);
    d += ` V${ey}`;
    ex = clamp(x + jog, 22, 458);
    d += ` H${ex}`;
    ey = clamp(ey + sg * b, 18, 402);
    d += ` V${ey}`;
  } else {
    const sg = dir === "left" ? -1 : 1;
    ex = clamp(x + sg * a, 22, 458);
    d += ` H${ex}`;
    ey = clamp(y + jog, 18, 402);
    d += ` V${ey}`;
    ex = clamp(ex + sg * b, 22, 458);
    d += ` H${ex}`;
  }
  return { d, end: [ex, ey], dur: between(2.6, 5), delay: -between(0, 4) };
}

const TRACES: Trace[] = [
  ...PINS_X.map((x) => trace(x, 170, "up")),
  ...PINS_X.map((x) => trace(x, 250, "down")),
  ...PINS_X.map((y) => trace(200, y - 5 + 10, "left")),
  ...PINS_X.map((y) => trace(280, y - 5 + 10, "right")),
];

// Barramentos ligando a CPU ao chip secundário e à memória (3 linhas cada).
const BUSES: Trace[] = [0, 8, 16].flatMap((off) => [
  {
    d: `M280 ${188 + off / 2} H${316 + off / 2} V${120 - off / 2} H336`,
    end: [336, 120 - off / 2] as [number, number],
    dur: between(2.4, 3.6),
    delay: -between(0, 3),
  },
  {
    d: `M${212 + off / 2} 250 V${292 + off / 2} H172`,
    end: [172, 292 + off / 2] as [number, number],
    dur: between(2.8, 4),
    delay: -between(0, 3),
  },
]);

// SMDs (componentes pequenos) espalhados fora da zona da CPU.
const SMDS = Array.from({ length: 14 }, () => {
  let x = 0;
  let y = 0;
  do {
    x = between(34, 430);
    y = between(28, 380);
  } while (x > 150 && x < 330 && y > 120 && y < 300);
  return { x, y, w: rand() > 0.5 ? 14 : 9, rot: Math.round(between(0, 1)) * 90 };
});

// Vias soltas na placa.
const VIAS = Array.from({ length: 20 }, () => {
  let x = 0;
  let y = 0;
  do {
    x = between(30, 450);
    y = between(24, 396);
  } while (x > 160 && x < 320 && y > 130 && y < 290);
  return [x, y] as [number, number];
});

// Zonas ocupadas (CPU, chip secundário, memória) para os componentes novos.
const inZone = (x: number, y: number) =>
  (x > 150 && x < 330 && y > 120 && y < 300) ||
  (x > 320 && x < 405 && y > 78 && y < 162) ||
  (x > 66 && x < 190 && y > 262 && y < 322);

// Capacitores (camada do meio): cilindros vistos de topo.
const CAPS = Array.from({ length: 7 }, () => {
  let x = 0;
  let y = 0;
  do {
    x = between(48, 432);
    y = between(40, 384);
  } while (inZone(x, y));
  return { x, y, r: between(7, 11) };
});

// Serigrafia da placa: rótulos técnicos apagados, como numa PCB real.
const SILK = ["R12", "C7", "L3", "U2", "Q1", "C21", "R45", "J4"].map((label) => {
  let x = 0;
  let y = 0;
  do {
    x = between(50, 430);
    y = between(36, 390);
  } while (inZone(x, y));
  return { label, x, y };
});

const ALL = [...TRACES, ...BUSES];

export function HeroChip() {
  const sceneRef = useRef<HTMLDivElement>(null);

  // Tilt de perspectiva seguindo o mouse (só variáveis CSS; sem re-render).
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      el.style.setProperty("--rx", `${(-ny * 16).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(nx * 20).toFixed(2)}deg`);
      // Revelador (efeito "Forma Revelada" da biblioteca): círculo suave que
      // segue o cursor e acende o circuito por onde passa.
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(2)}%`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className={styles.scene} ref={sceneRef} aria-hidden="true">
      <div className={styles.float}>
        <div className={styles.tilt}>
          {/* -------- camada da PLACA -------- */}
          <svg className={styles.layer} viewBox="0 0 480 420" fill="none">
            <defs>
              <radialGradient id="hcGlow">
                <stop offset="0%" stopColor="rgba(78,240,140,0.28)" />
                <stop offset="100%" stopColor="rgba(78,240,140,0)" />
              </radialGradient>
            </defs>
            <rect className={styles.board} x="10" y="8" width="460" height="404" rx="26" />
            <circle cx="240" cy="210" r="86" fill="url(#hcGlow)" />
            {ALL.map((t, i) => (
              <path key={`t${i}`} className={styles.trace} d={t.d} />
            ))}
            {ALL.map((t, i) =>
              i % 2 === 0 ? (
                <path
                  key={`p${i}`}
                  className={styles.pulse}
                  d={t.d}
                  style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
                />
              ) : null,
            )}
            {ALL.map((t, i) => (
              <circle key={`e${i}`} className={styles.pad} cx={t.end[0]} cy={t.end[1]} r={3} />
            ))}
            {VIAS.map(([x, y], i) => (
              <circle key={`v${i}`} className={styles.via} cx={x} cy={y} r={2.2} />
            ))}
            {/* indutor em zigue-zague no canto superior esquerdo */}
            <path className={styles.trace} d="M52 62 h9 v-12 h9 v12 h9 v-12 h9 v12 h9 v-12 h9 v12 h8" />
            {/* serigrafia: rótulos técnicos apagados */}
            {SILK.map((sk, i) => (
              <text key={`sk${i}`} className={styles.silk} x={sk.x} y={sk.y}>
                {sk.label}
              </text>
            ))}
            {/* furos de canto da placa */}
            {[
              [30, 28],
              [450, 28],
              [30, 392],
              [450, 392],
            ].map(([x, y], i) => (
              <circle key={`h${i}`} className={styles.hole} cx={x} cy={y} r={5} />
            ))}
          </svg>

          {/* lente de "derretimento": desfoca a placa sob o círculo do
              cursor, dando o melt do Forma Revelada */}
          <div className={styles.meltLens} aria-hidden="true" />

          {/* -------- camada REVELADA: circuito aceso, visível só dentro do
              círculo suave que segue o cursor (Forma Revelada) -------- */}
          <svg className={`${styles.layer} ${styles.revealLayer}`} viewBox="0 0 480 420" fill="none">
            {ALL.map((t, i) => (
              <path key={`r${i}`} className={styles.revealTrace} d={t.d} />
            ))}
            {ALL.map((t, i) => (
              <circle key={`rp${i}`} className={styles.revealPad} cx={t.end[0]} cy={t.end[1]} r={3} />
            ))}
          </svg>

          {/* -------- camada do MEIO: componentes baixos (SMDs, capacitores,
              cristal, conector) pairando pouco acima da placa -------- */}
          <svg className={`${styles.layer} ${styles.layerMid}`} viewBox="0 0 480 420" fill="none">
            {SMDS.map((c, i) => (
              <rect
                key={`s${i}`}
                className={styles.smd}
                x={c.x}
                y={c.y}
                width={c.w}
                height={5}
                rx={1.4}
                transform={`rotate(${c.rot} ${c.x} ${c.y})`}
              />
            ))}
            {CAPS.map((c, i) => (
              <g key={`c${i}`}>
                <circle className={styles.cap} cx={c.x} cy={c.y} r={c.r} />
                <circle className={styles.capTop} cx={c.x} cy={c.y} r={c.r * 0.55} />
              </g>
            ))}
            {/* cristal oscilador ao lado da CPU */}
            <rect className={styles.crystal} x="138" y="128" width="30" height="14" rx="7" />
            {/* conector de pinos na borda inferior */}
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={`hp${i}`}
                className={styles.hpin}
                x={296 + i * 13}
                y={372}
                width={9}
                height={9}
                rx={1.5}
              />
            ))}
          </svg>

          {/* -------- camada dos CHIPS (flutua acima da placa) -------- */}
          <svg className={`${styles.layer} ${styles.layerChips}`} viewBox="0 0 480 420" fill="none">
            {/* CPU: pinos, encapsulamento, die e monograma */}
            {PINS_X.map((x) => (
              <g key={`pin${x}`}>
                <rect className={styles.pin} x={x - 2} y={163} width={4} height={8} rx={1} />
                <rect className={styles.pin} x={x - 2} y={249} width={4} height={8} rx={1} />
                <rect className={styles.pin} x={193} y={x - 2 + 5} width={8} height={4} rx={1} />
                <rect className={styles.pin} x={279} y={x - 2 + 5} width={8} height={4} rx={1} />
              </g>
            ))}
            <rect className={styles.cpu} x="200" y="170" width="80" height="80" rx="12" />
            <rect className={styles.die} x="214" y="184" width="52" height="52" rx="7" />
            <path className={styles.dieGrid} d="M214 201h52M214 218h52M231 184v52M248 184v52" />
            <text className={styles.mono} x="240" y="211">
              GL
            </text>

            {/* chip secundário */}
            <rect className={styles.cpu} x="336" y="92" width="56" height="56" rx="9" />
            <rect className={styles.die} x="347" y="103" width="34" height="34" rx="5" />

            {/* pente de memória */}
            <rect className={styles.cpu} x="82" y="278" width="90" height="30" rx="6" />
            <path className={styles.dieGrid} d="M96 284v18M112 284v18M128 284v18M144 284v18M160 284v18" />
          </svg>
        </div>
      </div>
    </div>
  );
}
