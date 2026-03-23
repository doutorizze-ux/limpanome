'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../dashboard.module.css';
import authStyles from '../../auth.module.css';

type Step = 'docs' | 'payment' | 'track';

export default function ClientDashboard() {
  const [currentStep, setCurrentStep] = useState<Step>('docs');
  const [docSubStep, setDocSubStep] = useState<'info' | 'term' | 'uploads'>('info');
  const [processStatus, setProcessStatus] = useState<'analyzing' | 'in_progress' | 'approved'>('analyzing');
  const [signature, setSignature] = useState<string | null>(null);
  const [chargePrice, setChargePrice] = useState('150,00');
  const [logoBase64, setLogoBase64] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => { 
        if (data.chargePrice) setChargePrice(data.chargePrice); 
        if (data.logoBase64) setLogoBase64(data.logoBase64);
      })
      .catch(console.error);

    const uId = localStorage.getItem('user_id');
    if (uId) {
      fetch(`/api/client/me?userId=${uId}`)
        .then(r => r.json())
        .then(data => {
            if (data.status) setCurrentStep(data.status);
            if (data.processStatus) setProcessStatus(data.processStatus as any);
            setFormData(prev => ({
                ...prev,
                fullName: data.fullName || '',
                cpf: data.cpf || '',
                phone: data.phone || ''
            }));
        })
        .catch(console.error);
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    rg: '',
    address: '',
    city: '',
    state: '',
    cep: '',
    rgFront: null as File | null,
    rgBack: null as File | null,
    proofOfAddress: null as File | null
  });

  const handleNext = () => {
    if (currentStep === 'docs') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('track');
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!signature) {
      alert('Por favor, assine o termo para continuar.');
      return;
    }

    try {
      const uId = localStorage.getItem('user_id');
      if (!uId) throw new Error('Seção expirada. Faça login novamente.');

      const res = await fetch('/api/client/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uId,
          fullName: formData.fullName,
          cpf: formData.cpf,
          phone: formData.phone,
          signature: signature
        })
      });

      if (!res.ok) throw new Error('Falha ao salvar detalhes.');

      handleNext();

    } catch (err: any) {
      alert(err.message);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a1a1a';
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx?.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = (e: React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const renderStepper = () => (
    <div className={styles.stepper}>
      <div className={`${styles.step} ${currentStep === 'docs' ? styles.active : styles.completed}`}>
        <div className={styles.stepIcon}>1</div>
        <div className={styles.stepLabel}>Documentos</div>
      </div>
      <div className={`${styles.step} ${currentStep === 'payment' ? styles.active : currentStep === 'track' ? styles.completed : ''}`}>
        <div className={styles.stepIcon}>2</div>
        <div className={styles.stepLabel}>Pagamento</div>
      </div>
      <div className={`${styles.step} ${currentStep === 'track' ? styles.active : ''}`}>
        <div className={styles.stepIcon}>3</div>
        <div className={styles.stepLabel}>Painel</div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.navbar}>
         <div className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src={logoBase64 || '/logo.png'} alt="Logo" style={{ height: '32px', width: 'auto' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span>🛡️ Limpa Nome</span>
         </div>
         <div className={styles.userProfile}>👤 {formData.fullName || 'Cliente'}</div>
      </nav>

      <main className={styles.mainContent}>
        {renderStepper()}

        <div className={styles.panelCard}>
          {currentStep === 'docs' && (
            <div>
              <h2 className={styles.panelTitle} style={{ marginBottom: '1.5rem' }}>
                {docSubStep === 'info' && '1. Seus Dados de Contato'}
                {docSubStep === 'term' && '2. Assinatura do Termo Associativo'}
              </h2>

              {docSubStep === 'info' && (
                <form onSubmit={(e) => { e.preventDefault(); setDocSubStep('term'); }}>
                  <div className={styles.gridContent}>
                    <div className={authStyles.formGroup}>
                      <label className={authStyles.label}>Nome Completo / Razão Social</label>
                      <input type="text" className={authStyles.input} required placeholder="Ex: João da Silva" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                    </div>
                    <div className={authStyles.formGroup}>
                      <label className={authStyles.label}>CPF / CNPJ</label>
                      <input type="text" className={authStyles.input} required placeholder="000.000.000-00" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} />
                    </div>
                    <div className={authStyles.formGroup}>
                      <label className={authStyles.label}>E-mail</label>
                      <input type="email" className={authStyles.input} required placeholder="seu@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className={authStyles.formGroup}>
                      <label className={authStyles.label}>Telefone / WhatsApp (Contato)</label>
                      <input type="text" className={authStyles.input} required placeholder="(00) 90000-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button type="submit" className={authStyles.submitBtn} style={{ maxWidth: '300px' }}>
                      Continuar para o Termo
                    </button>
                  </div>
                </form>
              )}

              {docSubStep === 'term' && (
                <form onSubmit={(e) => { e.preventDefault(); if (signature) handleNext(); else alert('Por favor, assine o termo para continuar.'); }}>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.25rem', color: '#1e293b' }}>FICHA DE INSCRIÇÃO ASSOCIATIVA / DECLARAÇÃO / AUTORIZAÇÃO</h3>
                    <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#475569', marginBottom: '1.5rem', textAlign: 'justify' }}>
                      Por meio da presente, venho requerer a minha inscrição como associado (a), desta associação.
                      Ao assinar este instrumento, declaro estar ciente do inteiro teor do estatuto social da
                      Associação, bem como dos direitos e deveres impostos aos membros desta instituição. Declaro
                      que consinto com a propositura de Ação de Obrigação de Fazer com Pedido de Tutela de
                      Urgência e Indenização por Danos Morais, para defesa de direito difuso ou coletivo, em meu
                      nome, movida por esta associação, bem como, que me responsabilizo a efetuar os
                      pagamentos acertados previamente.
                    </p>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontSize: '0.85rem', color: '#1e293b' }}>
                      <p style={{ marginBottom: '0.5rem' }}><strong>NOME / RAZÃO SOCIAL:</strong> {formData.fullName || '---'}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>CPF / CNPJ:</strong> {formData.cpf || '---'}</p>
                      <p><strong>DATA:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className={authStyles.formGroup}>
                    <label className={authStyles.label} style={{ textAlign: 'center', display: 'block', marginBottom: '0.75rem' }}>Assine no quadro abaixo:</label>
                    <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                      <canvas 
                        ref={canvasRef} 
                        width="380" 
                        height="150" 
                        style={{ border: '2px dashed #cbd5e1', borderRadius: 'var(--radius-sm)', background: '#fff', display: 'block', cursor: 'crosshair', touchAction: 'none' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      ></canvas>
                      <button className={authStyles.submitBtn} style={{ position: 'absolute', top: '5px', right: '5px', padding: '0.25rem 0.5rem', fontSize: '0.65rem', background: '#f1f5f9', color: '#475569', width: 'auto', border: '1px solid #e2e8f0' }} onClick={clearCanvas}>
                        Limpar
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                    <button type="button" className={authStyles.submitBtn} style={{ maxWidth: '150px', backgroundColor: '#e2e8f0', color: '#1e293b' }} onClick={() => setDocSubStep('info')}>
                      Voltar
                    </button>
                    <button type="submit" className={authStyles.submitBtn} style={{ maxWidth: '250px' }}>
                      Confirmar e Assinar
                    </button>
                  </div>
                </form>
              )}

              {/* Uploads removed as per request */}
            </div>
          )}

          {currentStep === 'payment' && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h2 className={styles.panelTitle}>Pagamento para Liberação</h2>
              <div style={{ display: 'inline-block', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', marginBottom: '2rem' }}>
                 <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>R$ {chargePrice}</p>
                 <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Taxa única de processamento</p>
              </div>

              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <button className={authStyles.submitBtn} style={{ backgroundColor: '#00D1B2', borderColor: '#00D1B2' }} onClick={handleNext}>
                    Pagar com PIX (Rápido)
                  </button>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <button className={authStyles.submitBtn} style={{ backgroundColor: '#212529' }} onClick={handleNext}>
                    Pagar com Cartão / Boleto
                  </button>
                </div>
                
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}> 
                  🛡️ Pagamento processado com segurança pela Asaas.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'track' && (
            <div style={{ padding: '1rem 0' }}>
              {processStatus === 'analyzing' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>
                    ⏳
                  </div>
                  <h2 className={styles.panelTitle} style={{ marginBottom: '0.5rem' }}>Aguardando Liberação</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
                    Documentos enviados! Nossa equipe jurídica está analisando sua papelada para dar início ao processo de limpeza.
                  </p>

                  <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'inline-block', backgroundColor: 'var(--bg-primary)', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Atual</p>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--warning)' }}>Em análise jurídica</p>
                  </div>
                </div>
              )}

              {processStatus === 'in_progress' && (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease-out' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
                    ⚖️
                  </div>
                  <h2 className={styles.panelTitle} style={{ marginBottom: '0.5rem' }}>Processo Iniciado</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
                    Boas notícias! O advogado já deu entrada no seu processo jurídico para a retirada das restrições do seu nome.
                  </p>

                  <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'inline-block', backgroundColor: 'var(--bg-primary)', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Atual</p>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#3B82F6' }}>Processo Jurídico em Andamento</p>
                  </div>
                </div>
              )}

              {processStatus === 'approved' && (
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>
                      🎉
                    </div>
                    <h2 className={styles.panelTitle} style={{ marginBottom: '0.5rem', color: 'var(--success)' }}>Seu Nome Está Limpo!</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1rem auto', fontSize: '0.95rem' }}>
                      A ação foi concluída com sucesso. Seu nome já está liberado de restrições! Veja o comprovante abaixo.
                    </p>
                  </div>

                  <div style={{ width: '100%', height: '500px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#f9f9f9', marginTop: '1.5rem' }}>
                    <object 
                      data="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                      type="application/pdf" 
                      width="100%" 
                      height="100%"
                      style={{ border: 'none' }}
                    >
                      <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Seu navegador não suporta visualização de PDF. <a href="#" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Clique aqui para baixar</a>.
                      </p>
                    </object>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
