import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Limpe Seu Nome Hoje</h1>
        <p className={styles.subtitle}>
          Rápido, seguro e sem burocracia. Envie seus documentos e recupere seu crédito.
        </p>
      </header>

      <div className={styles.grid} style={{ maxWidth: '450px' }}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            🛡️
          </div>
          <h2 className={styles.cardTitle}>Iniciar Processo</h2>
          <p className={styles.cardDesc}>
            Cadastre-se, envie suas documentações e faça o pagamento para liberarmos seu nome com nossa equipe jurídica.
          </p>
          <Link href="/client/auth" className={styles.button}>
            Começar Agora
          </Link>
        </div>
      </div>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} - Assistência Jurídica Exclusiva.
      </footer>
    </div>
  );
}
