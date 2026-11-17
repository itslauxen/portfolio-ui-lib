// Figura "núcleo" feita com a skill hairline-create (fonte e verificação em ~/casa/painel-pc/figuras/nucleo).
// @ts-nocheck
import { HL } from "./hairline-kernel.js";
/**
 * nucleo: a core floating in a cage of three rings, with no base (o Gabriel tirou o pedestal).
 * No painel a figura não segue o ponteiro: os anéis giram sozinhos, devagar, cada um numa velocidade,
 * com a inclinação balançando de leve, e a figura toda flutua; com prefers-reduced-motion ela fica parada.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rad,
  spring, stepS, mk, put, register, disposer, solid,
} = HL;

const ZC = 46, RC = 15, BW = 2.6, PR = 34, PH = 6, SR = 10, SH = 7, NS = 40;
const V = [0.6124, 0.6124, 0.5]; // toward the viewer, at Cam(45, 0.5)
// Each ring: radius, rest azimuth and tilt of its normal (off/tp: da versão que seguia o ponteiro).
const RINGS = [
  { R: 29, az: 25, tl: 16, off: 0, tp: 56 },
  { R: 25.5, az: 112, tl: 62, off: 62, tp: 74 },
  { R: 22, az: -28, tl: 76, off: -62, tp: 80 },
];
const CHARGE0 = 0.42, SHELLS = [0.26, 0.5, 0.74];

const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.2);
  const box = [];
  // only the cage: the rings sweep a sphere of the largest radius around the core
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) box.push([sx * 29, sy * 29, ZC + 29], [sx * 29, sy * 29, ZC - 29]);
  fit(C, box, 200, 160);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // Ring backs are painted before the core, ring fronts after it.
  const backs = mk("g", {}, g);
  const pts = [];
  for (let i = 0; i <= 12; i++) for (let j = 0; j < 24; j++) {
    const th = (i / 12) * Math.PI, ph = (j / 24) * 2 * Math.PI;
    pts.push(P(RC * Math.sin(th) * Math.cos(ph), RC * Math.sin(th) * Math.sin(ph), ZC + RC * Math.cos(th)));
  }
  const rim = hull(pts), [cx, cy] = P(0, 0, ZC);
  const core = mk("g", {}, g);
  mk("path", { d: poly(rim), class: "sil hi" }, core);
  const eq = [];
  for (let k = 0; k <= 24; k++) {
    const s = rad(-45) + (k / 24) * Math.PI;
    eq.push(P(RC * Math.cos(s), RC * Math.sin(s), ZC + 2));
  }
  mk("path", { d: open(eq), class: "nf lo" }, core);
  // o "olho": os círculos de dentro do miolo, num grupo próprio para poderem se deslocar atrás do mouse
  const olho = mk("g", {}, core);
  const shells = SHELLS.map(() => mk("path", { class: "nf lo" }, olho));
  const fronts = mk("g", {}, g);

  const rings = RINGS.map((r) => {
    const mkHalf = (parent) => ({
      band: mk("path", { class: "fo" }, parent),
      out: mk("path", { class: "nf" }, parent),
      inn: mk("path", { class: "nf lo" }, parent),
    });
    return { ...r, az: spring(rad(r.az)), tl: spring(rad(r.tl)), back: mkHalf(backs), front: mkHalf(fronts), drawn: "" };
  });
  rings.forEach((r) => r.front.out.setAttribute("class", "nf sil"));
  const charge = spring(CHARGE0, { eps: 0.002 });
  let drawnQ = NaN;

  function drawRing(r) {
    const a = r.az.x, t = r.tl.x, key = a.toFixed(4) + t.toFixed(4);
    if (key === r.drawn) return;
    r.drawn = key;
    const u = [-Math.sin(a), Math.cos(a), 0], v = [Math.cos(t) * Math.cos(a), Math.cos(t) * Math.sin(a), -Math.sin(t)];
    const s0 = Math.atan2(dot3(v, V), dot3(u, V)) - Math.PI / 2;
    const arc = (R, from) => {
      const o = [];
      for (let k = 0; k <= NS; k++) {
        const s = from + (k / NS) * Math.PI, c = Math.cos(s), n = Math.sin(s);
        o.push(P(R * (c * u[0] + n * v[0]), R * (c * u[1] + n * v[1]), ZC + R * (c * u[2] + n * v[2])));
      }
      return o;
    };
    for (const [h, from] of [[r.front, s0], [r.back, s0 + Math.PI]]) {
      const ao = arc(r.R, from), ai = arc(r.R - BW, from);
      h.band.setAttribute("d", poly(ao.concat(ai.slice().reverse())));
      h.out.setAttribute("d", open(ao));
      h.inn.setAttribute("d", open(ai));
    }
    r.depth = Math.abs(Math.cos(t)); // the flatter the ring, the more of its front lies over the others
  }
  let lastOrder = "";
  function order() {
    // Fronts: the ring standing most upright is painted first, the flattest last.
    const sorted = rings.slice().sort((p, q) => p.depth - q.depth), key = sorted.map((r) => r.R).join();
    if (key === lastOrder) return;
    lastOrder = key;
    sorted.forEach((r) => {
      for (const k of ["band", "out", "inn"]) fronts.append(r.front[k]);
    });
  }
  function drawCore() {
    const q = charge.x;
    if (q === drawnQ) return;
    drawnQ = q;
    SHELLS.forEach((f, k) => {
      const s = f * clamp(q * 3 - k, 0, 1) * 0.98;
      shells[k].setAttribute("d", s < 0.02 ? "" : poly(rim.map(([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s])));
    });
  }

  // inclinação de repouso: precisa existir antes do register, que já roda um primeiro quadro
  rings.forEach((r, i) => { r.az0d = RINGS[i].az; r.tl0 = RINGS[i].tl; });

  // giro sozinho, devagar: cada anel numa velocidade e direção, com a inclinação balançando de leve
  // (no lugar de seguir o ponteiro; quem pede menos movimento vê a figura parada)
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GIRO = [0.22, -0.3, 0.16];   // rad/s
  // energia (0 a 1), vinda de fora pelo set(): o som da conversa. Com ela os anéis aceleram e balançam mais
  // (o miolo não muda).
  let energia = 0, suave = 0;
  // Magnetismo: quanto mais perto o mouse chega da figura (até uns 650 px), mais o olho se desloca na direção
  // dele, até 19 unidades do desenho (a esfera tem uns 36 de raio: a pupila chega perto da borda sem sair), e
  // sempre com atraso (a mola abaixo). PUPILA aumenta o olho em volta do próprio centro.
  const ALCANCE = 650, PUXAO = 19, PUPILA = 1.35;
  let alvoX = 0, alvoY = 0, olhoX = 0, olhoY = 0;
  const aoMover = (e) => {
    const c = svg.getBoundingClientRect();
    if (!c.width) return;
    const dx = e.clientX - (c.left + c.width / 2), dy = e.clientY - (c.top + c.height / 2), d = Math.hypot(dx, dy);
    const forca = d > 1 ? Math.pow(clamp(1 - d / ALCANCE, 0, 1), 0.6) : 0;   // some com a distância, mas segura a força de longe
    alvoX = d > 1 ? (dx / d) * PUXAO * forca : 0;
    alvoY = d > 1 ? (dy / d) * PUXAO * forca : 0;
  };
  const aoSair = () => { alvoX = 0; alvoY = 0; };
  addEventListener("pointermove", aoMover, { passive: true });
  document.addEventListener("pointerleave", aoSair);
  bag.add(() => { removeEventListener("pointermove", aoMover); document.removeEventListener("pointerleave", aoSair); });
  const B = register(stage, (dt, now) => {
    suave += (energia - suave) * Math.min(1, dt * 9);   // segue o som sem tremer
    olhoX += (alvoX - olhoX) * Math.min(1, dt * 4.5);   // o olho chega devagar aonde o mouse puxa
    olhoY += (alvoY - olhoY) * Math.min(1, dt * 4.5);
    olho.setAttribute("transform", `translate(${(olhoX + cx).toFixed(2)} ${(olhoY + cy).toFixed(2)}) scale(${PUPILA}) translate(${-cx} ${-cy})`);
    // o miolo fica sempre igual (um círculo só, o "olho"): a energia mexe só nos anéis
    if (!quieto) rings.forEach((r, i) => {
      r.az.t += GIRO[i] * (1 + 7 * suave) * dt;
      r.tl.t = rad(r.tl0 + (9 + 22 * suave) * Math.sin(now / 3200 + i * 2.1));
    });
    // flutuando: sobe e desce devagar (±4 unidades, ~5 s) com uma leve deriva de lado
    if (!quieto) g.setAttribute("transform", `translate(${(1.5 * Math.sin(now / 2300)).toFixed(2)} ${(4 * Math.sin(now / 800)).toFixed(2)})`);
    let m = stepS(charge, dt) || !quieto;
    for (const r of rings) { if (stepS(r.az, dt)) m = true; if (stepS(r.tl, dt)) m = true; drawRing(r); }
    order();
    drawCore();
    return m;
  });
  bag.add(B.unregister);

  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { energia = clamp(+v || 0, 0, 1); B.wake(); },
    destroy: bag.dispose,
  };
}

export const nucleo = ({
  name: "nucleo",
  means: "A core floating in a cage of rings that turn slowly on their own.",
  rules: [1, 3, 5, 6],
  range: [50, 90, 140],
  tour: [[330, 145], [60, 130], [200, 137], null],
  mount,
});
