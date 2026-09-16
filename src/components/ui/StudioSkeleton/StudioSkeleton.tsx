import styles from "./studioSkeleton.module.css";

// Esqueleto do estúdio da biblioteca: mesma silhueta do layout real
// (sidebar + cabeçalho + palco + painel), com shimmer, para o conteúdo
// aparecer sem "pulo" quando o bundle/WebGL terminar de carregar.
export function StudioSkeleton() {
  return (
    <div className={styles.wrap} role="status" aria-label="Carregando biblioteca">
      <aside className={styles.side}>
        <span className={`${styles.bone} ${styles.search}`} />
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={`${styles.bone} ${styles.item}`} />
        ))}
      </aside>
      <div className={styles.main}>
        <span className={`${styles.bone} ${styles.stage}`} />
        <span className={`${styles.bone} ${styles.panel}`} />
      </div>
    </div>
  );
}
