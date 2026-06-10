import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, aiService } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, done: 0 });
  const [suggestion, setSuggestion] = useState('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  useEffect(() => {
    taskService.getStats().then(({ data }) => setStats(data)).catch(console.error);
  }, []);

  async function handleSuggest() {
    setLoadingSuggestion(true);
    setSuggestion('');
    try {
      const { data } = await aiService.suggest();
      setSuggestion(data.suggestion);
    } catch {
      setSuggestion('Erro ao buscar sugestão. Verifique sua chave da API.');
    } finally {
      setLoadingSuggestion(false);
    }
  }

  const completionRate = stats.total > 0
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  const cards = [
    { label: 'Total de Tarefas', value: stats.total, color: '#7c6af7', icon: '📋' },
    { label: 'Pendentes', value: stats.pending, color: '#f59e0b', icon: '⏳' },
    { label: 'Em Andamento', value: stats.in_progress, color: '#3b82f6', icon: '🔄' },
    { label: 'Concluídas', value: stats.done, color: '#10b981', icon: '✅' },
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700 }}>
        Olá, {user?.name}! 👋
      </h2>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Aqui está seu resumo de produtividade
      </p>

      {/* Cards de stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map(({ label, value, color, icon }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: '12px', padding: '20px',
            borderTop: `4px solid ${color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Barra de progresso */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontWeight: 600 }}>Taxa de conclusão</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{completionRate}%</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '99px', height: '12px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '99px',
            width: `${completionRate}%`, background: '#10b981',
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
          {stats.done} de {stats.total} tarefas concluídas
        </p>
      </div>

      {/* Sugestões de IA */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>🤖 Sugestões de IA</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>
              Powered by Claude
            </p>
          </div>
          <button onClick={handleSuggest} disabled={loadingSuggestion} style={{
            background: '#7c6af7', color: '#fff', border: 'none',
            padding: '10px 18px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 600,
          }}>
            {loadingSuggestion ? '⏳ Gerando...' : '✨ Gerar sugestão'}
          </button>
        </div>

        {suggestion ? (
          <div style={{ background: '#f5f3ff', borderRadius: '10px', padding: '16px', fontSize: '14px', lineHeight: '1.7', color: '#333', whiteSpace: 'pre-line' }}>
            {suggestion}
          </div>
        ) : (
          <p style={{ color: '#aaa', fontSize: '14px', fontStyle: 'italic' }}>
            Clique em "Gerar sugestão" para receber dicas de produtividade baseadas nas suas tarefas.
          </p>
        )}
      </div>
    </div>
  );
}
