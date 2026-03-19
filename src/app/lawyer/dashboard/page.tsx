'use client';

import { useState } from 'react';
import styles from '../../lawyer.module.css';
import cardStyles from '../../dashboard.module.css';
import formStyles from '../../auth.module.css';

type SidebarTab = 'overview' | 'clients' | 'finance' | 'settings';

export default function LawyerDashboard() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('overview');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [releaseSpecs, setReleaseSpecs] = useState('');
  const [releasePdf, setReleasePdf] = useState<File | null>(null);
  const [sendWpStart, setSendWpStart] = useState(true);
  const [sendWpFinish, setSendWpFinish] = useState(true);
  const [systemLogo, setSystemLogo] = useState<File | null>(null);

  const mockClients = [
    { id: 1, name: 'João Silva', cpf: '123.456.789-00', status: 'pending', docs: 'Completo', pay: 'Pago' },
    { id: 2, name: 'Maria Souza', cpf: '987.654.321-11', status: 'approved', docs: 'Completo', pay: 'Pago' },
    { id: 3, name: 'Pedro Alves', cpf: '456.789.123-22', status: 'pending', docs: 'Pendente', pay: 'Aguardando' }
  ];

  const renderOverview = () => (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Painel Administrativo</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Saldo Disponível</div>
          <div className={styles.statValue}>R$ 4.250,00</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Clientes</div>
          <div className={styles.statValue}>12</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Em Análise</div>
          <div className={styles.statValue}>5</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Taxa Conversão</div>
          <div className={styles.statValue}>88%</div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Solicitações Recentes</h2>
          <button className={styles.actionBtn} onClick={() => setActiveTab('clients')}>Ver Todos</button>
        </div>
        
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Documentos</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.cpf}</td>
                <td>{client.docs}</td>
                <td>{client.pay}</td>
                <td>
                  <span className={`${styles.badge} ${client.status === 'pending' ? styles.pending : styles.success}`}>
                    {client.status === 'pending' ? 'Em Análise' : 'Concluído'}
                  </span>
                </td>
                <td>
                  <button className={styles.actionBtn} onClick={() => { setSelectedClient(client); setActiveTab('clients'); }}>
                    Gerenciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClients = () => (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Lista de Clientes</h1>
      
      {selectedClient ? (
        <div className={cardStyles.panelCard}>
          <button className={styles.actionBtn} onClick={() => setSelectedClient(null)} style={{ marginBottom: '1rem' }}>
            ← Voltar
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Gerenciar: {selectedClient.name}
          </h2>
          
          <div className={cardStyles.gridContent} style={{ marginBottom: '2rem' }}>
             <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CPF</p>
               <p style={{ fontWeight: 600 }}>{selectedClient.cpf}</p>
             </div>
             <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status Pagamento</p>
               <p style={{ fontWeight: 600, color: 'var(--success)' }}>{selectedClient.pay}</p>
             </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Documentos Enviados</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
             <button className={styles.actionBtn} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📂 Baixar RG Frente
             </button>
             <button className={styles.actionBtn} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📂 Baixar RG Verso
             </button>
             <button className={styles.actionBtn} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📂 Baixar Comprovante Res.
             </button>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Gerenciamento do Processo</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
             <button type="button" className={styles.actionBtn} style={{ background: '#3B82F6', color: '#fff', padding: '0.6rem 1rem', border: 'none' }} onClick={() => alert('Status alterado: Cliente notificado ' + (sendWpStart ? '✅ VIA WHATSAPP ' : ' ') + 'que o processo foi iniciado!')}>
                ⚖️ Dar Início ao Processo
             </button>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={sendWpStart} onChange={(e) => setSendWpStart(e.target.checked)} /> Enviar WhatsApp ao iniciar
             </label>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Nome liberado e PDF enviado! ' + (sendWpFinish ? '✅ CLIENTE NOTIFICADO VIA WHATSAPP' : '')); setSelectedClient(null); }}>
             <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Notificação Especial (Opcional)</label>
                <textarea 
                   className={formStyles.input} 
                   rows={3} 
                   value={releaseSpecs}
                   onChange={(e) => setReleaseSpecs(e.target.value)}
                   style={{ resize: 'none' }}
                   placeholder="Ex: Seu nome foi retirado do SPC no dia 19/03..." 
                />
             </div>

             <div className={formStyles.formGroup} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <label className={formStyles.label}>Anexar Termo / Certidão de Quitação (PDF)</label>
                <div className={cardStyles.uploadBox} style={{ padding: '1.5rem', position: 'relative' }}>
                   <span className={cardStyles.uploadIcon} style={{ fontSize: '1.5rem' }}>📄</span>
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                     {releasePdf ? releasePdf.name : 'Clique para enviar o PDF de quitação'}
                   </p>
                   <input 
                     type="file" 
                     accept="application/pdf" 
                     style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
                     onChange={(e) => setReleasePdf(e.target.files?.[0] || null)} 
                   />
                </div>
             </div>

             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="submit" className={formStyles.submitBtn} style={{ maxWidth: '250px', margin: 0 }}>
                   Liberar Nome do Cliente
                </button>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                   <input type="checkbox" checked={sendWpFinish} onChange={(e) => setSendWpFinish(e.target.checked)} /> Enviar WhatsApp ao finalizar
                </label>
             </div>
          </form>
        </div>
      ) : (
        <div className={styles.tableSection}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Documentos</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {mockClients.map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.cpf}</td>
                  <td>{client.docs}</td>
                  <td>{client.pay}</td>
                  <td>
                    <span className={`${styles.badge} ${client.status === 'pending' ? styles.pending : styles.success}`}>
                      {client.status === 'pending' ? 'Em Análise' : 'Concluído'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => setSelectedClient(client)}>
                      Analisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderFinance = () => (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Extrato Financeiro (Asaas)</h1>
      
      <div className={styles.tableSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Saldo Líquido</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>R$ 4.250,00</p>
          </div>
          <button className={styles.actionBtn}>Solicitar Saque</button>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Valor Bruto</th>
              <th>Taxa</th>
              <th>Líquido</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>19/03/2026</td>
              <td>João Silva</td>
              <td>PIX</td>
              <td>R$ 150,00</td>
              <td>R$ 1,99</td>
              <td style={{ fontWeight: 600 }}>R$ 148,01</td>
            </tr>
            <tr>
              <td>18/03/2026</td>
              <td>Maria Souza</td>
              <td>Cartão</td>
              <td>R$ 150,00</td>
              <td>R$ 3,50</td>
              <td style={{ fontWeight: 600 }}>R$ 146,50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Configurações do Sistema</h1>
      <div className={cardStyles.panelCard}>
        <form onSubmit={async (e) => { 
          e.preventDefault(); 
          if (!systemLogo) { alert('Escolha uma logo para salvar!'); return; }
          const formData = new FormData();
          formData.append('logo', systemLogo);
          const res = await fetch('/api/admin/settings/logo', { method: 'POST', body: formData });
          if (res.ok) alert('Logo atualizada com sucesso! Recarregue a página para ver o resultado.');
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Identidade Visual</h3>
          
          <div className={formStyles.formGroup} style={{ marginBottom: '1.5rem' }}>
             <label className={formStyles.label}>Logo do Sistema</label>
             <div className={styles.uploadBox} style={{ padding: '2rem', position: 'relative' }}>
                <span className={styles.uploadIcon} style={{ fontSize: '2rem' }}>🖼️</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {systemLogo ? systemLogo.name : 'Clique para enviar imagem da Logo'}
                </p>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
                  onChange={(e) => setSystemLogo(e.target.files?.[0] || null)} 
                />
             </div>
          </div>

          <button type="submit" className={formStyles.submitBtn} style={{ maxWidth: '200px' }}>
             Salvar Logo
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className={styles.lawyerGrid}>
      <aside className={styles.sidebar}>
        <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '2rem' }}>⚙️ Administração</div>
        <nav className={styles.sidebarNav}>
          <div className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => { setActiveTab('overview'); setSelectedClient(null); }}>
             📊 Visão Geral
          </div>
          <div className={`${styles.navItem} ${activeTab === 'clients' ? styles.active : ''}`} onClick={() => { setActiveTab('clients'); }}>
             👥 Clientes
          </div>
          <div className={`${styles.navItem} ${activeTab === 'finance' ? styles.active : ''}`} onClick={() => { setActiveTab('finance'); setSelectedClient(null); }}>
             💳 Extrato Asaas
          </div>
          <div className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`} onClick={() => { setActiveTab('settings'); setSelectedClient(null); }}>
             ⚙️ Configurações
          </div>
        </nav>
      </aside>

      <main className={styles.mainPanel}>
         {activeTab === 'overview' && renderOverview()}
         {activeTab === 'clients' && renderClients()}
         {activeTab === 'finance' && renderFinance()}
         {activeTab === 'settings' && renderSettings()}
      </main>

      <div className={styles.bottomNav}>
        <div className={`${styles.bottomItem} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => { setActiveTab('overview'); setSelectedClient(null); }}>
           <span style={{ fontSize: '1.2rem' }}>📊</span>
           <span>Visão Geral</span>
        </div>
        <div className={`${styles.bottomItem} ${activeTab === 'clients' ? styles.active : ''}`} onClick={() => { setActiveTab('clients'); }}>
           <span style={{ fontSize: '1.2rem' }}>👥</span>
           <span>Clientes</span>
        </div>
        <div className={`${styles.bottomItem} ${activeTab === 'finance' ? styles.active : ''}`} onClick={() => { setActiveTab('finance'); setSelectedClient(null); }}>
           <span style={{ fontSize: '1.2rem' }}>💳</span>
           <span>Extrato</span>
        </div>
        <div className={`${styles.bottomItem} ${activeTab === 'settings' ? styles.active : ''}`} onClick={() => { setActiveTab('settings'); setSelectedClient(null); }}>
           <span style={{ fontSize: '1.2rem' }}>⚙️</span>
           <span>Config</span>
        </div>
      </div>
    </div>
  );
}
