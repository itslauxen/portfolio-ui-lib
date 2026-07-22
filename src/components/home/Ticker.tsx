// Faixa marquee brutalist: itens em loop infinito entre linhas de 1px.
// Puro CSS (barato e confiável); pausa no hover; estático com reduced-motion.
import styles from "./ticker.module.css";

const ITEMS = [
  "desenvolvedor fullstack",
  "node + express",
  "react",
  "docker",
  "sequelize + sql",
  "three.js + webgl",
  "shaders glsl",
  "gsap",
  "react three fiber",
  "framer motion",
  "canvas 2d",
  "backgrounds parametrizados",
  "postgresql",
  "agentes de ia",
];

export function Ticker() {
  const row = ITEMS.map((t, i) => (
    <span key={i} className={styles.item}>
      {t}
      <span className={styles.sep} aria-hidden="true">
        {"///"}
      </span>
    </span>
  ));

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.row}>{row}</div>
        <div className={styles.row}>{row}</div>
      </div>
    </div>
  );
}
