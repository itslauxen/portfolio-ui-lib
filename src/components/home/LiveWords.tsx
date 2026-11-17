import s from "./liveWords.module.css";

/**
 * Palavra de destaque do título: um degradê verde que corre por dentro das letras, com um brilho
 * claro passando de tempos em tempos. Só CSS (background-clip: text), sem shader nem JavaScript.
 */
export function LiveWords({ text }: { text: string }) {
  return <span className={s.word}>{text}</span>;
}
