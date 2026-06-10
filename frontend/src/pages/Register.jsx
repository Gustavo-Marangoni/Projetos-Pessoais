import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>✅ TaskManager</h1>
        <p style={styles.subtitle}>Crie sua conta</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} type="text" placeholder="Seu nome"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Senha (mínimo 6 caracteres)"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            minLength={6} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          Já tem conta? <Link to="/login" style={{ color: '#7c6af7' }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f0f5' },
  card: { background: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  title: { textAlign: 'center', fontSize: '28px', margin: '0 0 4px', color: '#7c6af7' },
  subtitle: { textAlign: 'center', color: '#888', margin: '0 0 24px', fontSize: '14px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  btn: { padding: '12px', background: '#7c6af7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' },
};
