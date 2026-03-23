'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../auth.module.css';

export default function ClientAuth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      try {
        const res = await fetch('/api/client/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao realizar login.');
        localStorage.setItem('user_id', data.userId);
        router.push('/client/dashboard');
        return;
      } catch (err: any) {
        setError(err.message);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      const res = await fetch('/api/client/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar cadastro.');
      }

      // Salvar ID temporário para usar no Upload de docs
      localStorage.setItem('user_id', data.userId);
      router.push('/client/dashboard');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            {isLogin ? 'Acessar Conta' : 'Criar Cadastro'}
          </h1>
          <p className={styles.authSubtitle}>
            {isLogin 
              ? 'Consulte o status do seu nome limpo.' 
              : 'Preencha seus dados para iniciar o processo.'}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Completo</label>
              <input 
                type="text" 
                name="name" 
                className={styles.input} 
                required 
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: João Silva" 
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input 
              type="email" 
              name="email" 
              className={styles.input} 
              required 
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com" 
            />
          </div>

          {!isLogin && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>WhatsApp / Celular</label>
                <input 
                  type="text" 
                  name="phone" 
                  className={styles.input} 
                  required 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000" 
                />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <input 
              type="password" 
              name="password" 
              className={styles.input} 
              required 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirmar Senha</label>
              <input 
                type="password" 
                name="confirmPassword" 
                className={styles.input} 
                required 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••" 
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Entrar' : 'Cadastrar e Continuar'}
          </button>
        </form>

        <p className={styles.switchAuth}>
          {isLogin ? 'Não tem conta?' : 'Já tem cadastro?'} <span 
            className={styles.switchLink}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </span>
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/" className={styles.switchLink} style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
