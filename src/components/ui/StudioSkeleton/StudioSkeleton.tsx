import styles from "./studioSkeleton.module.css";

// Esqueleto do lab: mesma silhueta do layout real (lista lateral com cartão, abas e busca; à direita
// o palco com o painel, ou a grade de fotos), com shimmer, para o conteúdo aparecer sem "pulo"
// quando o bundle/WebGL terminar de carregar.
const LARGURAS = [58, 44, 66, 50, 72, 40, 62, 54, 70, 46, 60, 52, 68, 42];

export function StudioSkeleton({ grid = false }: { grid?: boolean }) {
  return (
    <div className={styles.wrap} role="status" aria-label="Carregando biblioteca">
      <aside className={styles.side}>
        <span className={`${styles.bone} ${styles.box}`} />
        <span className={`${styles.bone} ${styles.box}`} />
        <span className={`${styles.bone} ${styles.search}`} />
        <span className={styles.gap} />
        {LARGURAS.map((w, i) => (
          <span key={i} className={`${styles.bone} ${styles.item}`} style={{ width: `${w}%` }} />
        ))}
      </aside>
      {grid ? (
        <div className={styles.cards}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`${styles.bone} ${styles.card}`} />
          ))}
        </div>
      ) : (
        <div className={styles.main}>
          <span className={`${styles.bone} ${styles.stage}`} />
          <span className={`${styles.bone} ${styles.panel}`} />
        </div>
      )}
    </div>
  );
}
