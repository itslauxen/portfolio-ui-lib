import styles from "./ui.module.css";
import { CopyButton } from "./CopyButton";

interface Props {
  code: string;
  language?: string;
}

/** Bloco de código com cabeçalho e botão de copiar. */
export function CodeBlock({ code, language = "code" }: Props) {
  return (
    <div className={styles.code}>
      <div className={styles.codeHeader}>
        <span>{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className={styles.codePre}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
