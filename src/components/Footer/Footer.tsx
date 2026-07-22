import { profile } from "@/data/profile";
import styles from "./footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div>
          <div className={styles.brand}>{profile.name}</div>
          <div className={styles.meta}>
            © {year} · {profile.role}
          </div>
        </div>
        <div className={styles.links}>
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
          {profile.email && <a href={`mailto:${profile.email}`}>Contato</a>}
        </div>
      </div>
    </footer>
  );
}
