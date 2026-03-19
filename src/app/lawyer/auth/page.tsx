'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../auth.module.css';

export default function LawyerAuth() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/lawyer/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            Painel Administrativo
          </h1>
          <p className={styles.authSubtitle}>
            Acesse para gerenciar os clientes e pagamentos.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input 
              type="email" 
              name="email" 
              className={styles.input} 
              required 
              placeholder="admin@email.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <input 
              type="password" 
              name="password" 
              className={styles.input} 
              required 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Entrar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/" className={styles.switchLink} style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
