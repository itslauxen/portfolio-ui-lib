import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.terminal} role="status" aria-label="Carregando biblioteca">
        <div className={styles.bar}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
          <span className={styles.title}>library — loading</span>
        </div>
        <pre className={styles.body}>
          <span className={`${styles.line} ${styles.line1}`}>
            <span className={styles.prompt}>$</span> booting component library
          </span>
          <span className={`${styles.line} ${styles.line2}`}>
            <span className={styles.prompt}>$</span> loading catalog — 94 components
          </span>
          <span className={`${styles.line} ${styles.line3}`}>
            <span className={styles.prompt}>$</span> compiling shaders
            <span className={styles.caret} />
          </span>
          <span className={styles.progress}>
            <span className={styles.fill} />
          </span>
        </pre>
      </div>
    </div>
  );
}
