'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../dashboard.module.css';
import authStyles from '../../auth.module.css';

type Step = 'docs' | 'payment' | 'track';

export default function ClientDashboard() {
  const [currentStep, setCurrentStep] = useState<Step>('docs');
  const [processStatus, setProcessStatus] = useState<'analyzing' | 'in_progress' | 'approved'>('analyzing');

  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'rgFront' | 'rgBack' | 'proofOfAddress') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
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
        <div className={styles.logo}>🛡️ Limpa Nome</div>
        <div className={styles.userProfile}>👤 cliente@email.com</div>
      </nav>

      <main className={styles.mainContent}>
        {renderStepper()}

        <div className={styles.panelCard}>
          {currentStep === 'docs' && (
            <div>
              <h2 className={styles.panelTitle}>Envio de Documentação Completa</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div className={styles.gridContent}>
                  <div className={authStyles.formGroup}>
                    <label className={authStyles.label}>Nome Completo</label>
                    <input type="text" className={authStyles.input} required placeholder="Ex: João da Silva" />
                  </div>
                  <div className={authStyles.formGroup}>
                    <label className={authStyles.label}>CPF</label>
                    <input type="text" className={authStyles.input} required placeholder="000.000.000-00" />
                  </div>
                  <div className={authStyles.formGroup}>
                    <label className={authStyles.label}>Endereço Completo</label>
                    <input type="text" className={authStyles.input} required placeholder="Rua, Número, Bairro" />
                  </div>
                  <div className={authStyles.formGroup}>
                    <label className={authStyles.label}>CEP</label>
                    <input type="text" className={authStyles.input} required placeholder="00000-000" />
                  </div>
                  
                  <div className={styles.fullWidth}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Anexos de Identificação</h3>
                  </div>

                  <div>
                     <label className={authStyles.label}>RG / CNH (Frente)</label>
                     <div className={styles.uploadBox}>
                       <span className={styles.uploadIcon}>📄</span>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                         {formData.rgFront ? formData.rgFront.name : 'Clique para enviar imagem'}
                       </p>
                       <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'rgFront')} id="rgFront" />
                       <label htmlFor="rgFront" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}></label>
                     </div>
                  </div>

                  <div>
                     <label className={authStyles.label}>RG / CNH (Verso)</label>
                     <div className={styles.uploadBox}>
                       <span className={styles.uploadIcon}>📄</span>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                         {formData.rgBack ? formData.rgBack.name : 'Clique para enviar imagem'}
                       </p>
                       <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'rgBack')} id="rgBack" />
                       <label htmlFor="rgBack" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}></label>
                     </div>
                  </div>

                  <div className={styles.fullWidth}>
                     <label className={authStyles.label}>Comprovante de Residência</label>
                     <div className={styles.uploadBox}>
                       <span className={styles.uploadIcon}>🏠</span>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                         {formData.proofOfAddress ? formData.proofOfAddress.name : 'Clique para enviar imagem'}
                       </p>
                       <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'proofOfAddress')} id="proofOfAddress" />
                       <label htmlFor="proofOfAddress" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}></label>
                     </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button type="submit" className={authStyles.submitBtn} style={{ maxWidth: '300px' }}>
                    Salvar e Ir para Pagamento
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 'payment' && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h2 className={styles.panelTitle}>Pagamento para Liberação</h2>
              <div style={{ display: 'inline-block', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>R$ 150,00</p>
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
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--warning)' }}>Em análise de documentos</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                     <button className={authStyles.submitBtn} style={{ maxWidth: '180px', fontSize: '0.7rem', padding: '0.5rem', background: '#e2e8f0', color: '#1e293b' }} onClick={() => setProcessStatus('in_progress')}>
                       Simular Início de Processo
                     </button>
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
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#3B82F6' }}>Processo Jurídico em Divulgação</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                     <button className={authStyles.submitBtn} style={{ maxWidth: '180px', fontSize: '0.7rem', padding: '0.5rem', background: '#10B981', color: '#fff' }} onClick={() => setProcessStatus('approved')}>
                       Simular Nome Limpo (Finalizado)
                     </button>
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
