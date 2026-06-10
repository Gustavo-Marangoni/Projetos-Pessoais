import { useState, useEffect } from 'react';
import { taskService } from '../services/api';

const STATUS_LABELS = { pending: 'Pendente', in_progress: 'Em andamento', done: 'Concluída' };
const STATUS_COLORS = { pending: '#f59e0b', in_progress: '#3b82f6', done: '#10b981' };
const PRIORITY_LABELS = { low: 'Baixa', medium: 'Média', high: 'Alta' };
const PRIORITY_COLORS = { low: '#6b7280', medium: '#f59e0b', high: '#ef4444' };

const EMPTY_FORM = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const { data } = await taskService.getAll(params);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, [filters]);

  function openCreate() {
    setEditingTask(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, form);
      } else {
        await taskService.create(form);
      }
      setShowModal(false);
      loadTasks();
    } catch (err) {
      alert('Erro ao salvar tarefa');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deletar esta tarefa?')) return;
    await taskService.delete(id);
    loadTasks();
  }

  async function toggleDone(task) {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    await taskService.update(task.id, { ...task, status: newStatus });
    loadTasks();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Minhas Tarefas</h2>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>{tasks.length} tarefa(s)</p>
        </div>
        <button onClick={openCreate} style={btnStyle}>+ Nova Tarefa</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
          placeholder="🔍 Buscar tarefas..."
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
        <select
          style={{ ...inputStyle, minWidth: '160px' }}
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="done">Concluída</option>
        </select>
      </div>

      {/* Lista de tarefas */}
      {loading ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '48px 0' }}>Carregando...</p>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#aaa' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ fontSize: '16px' }}>Nenhuma tarefa encontrada</p>
          <button onClick={openCreate} style={{ ...btnStyle, marginTop: '16px' }}>Criar primeira tarefa</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map(task => (
            <div key={task.id} style={{
              background: '#fff', borderRadius: '12px', padding: '16px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${STATUS_COLORS[task.status]}`,
              opacity: task.status === 'done' ? 0.7 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => toggleDone(task)}
                  style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '15px', fontWeight: 600,
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      color: task.status === 'done' ? '#9ca3af' : '#111',
                    }}>{task.title}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: STATUS_COLORS[task.status] + '20', color: STATUS_COLORS[task.status], fontWeight: 600 }}>
                      {STATUS_LABELS[task.status]}
                    </span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: PRIORITY_COLORS[task.priority] + '20', color: PRIORITY_COLORS[task.priority], fontWeight: 600 }}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  </div>
                  {task.description && (
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#666' }}>{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#aaa' }}>
                      📅 {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(task)} style={iconBtn}>✏️</button>
                  <button onClick={() => handleDelete(task.id)} style={{ ...iconBtn, color: '#ef4444' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={overlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700 }}>
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input style={inputStyle} placeholder="Título *" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                placeholder="Descrição (opcional)" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select style={inputStyle} value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="low">Baixa prioridade</option>
                  <option value="medium">Média prioridade</option>
                  <option value="high">Alta prioridade</option>
                </select>
                <select style={inputStyle} value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="done">Concluída</option>
                </select>
              </div>
              <input style={inputStyle} type="date" value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...btnStyle, background: '#fff', color: '#333', border: '1px solid #ddd', flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" style={{ ...btnStyle, flex: 1 }}>
                  {editingTask ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = { background: '#7c6af7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 };
const inputStyle = { padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff', width: '100%', boxSizing: 'border-box' };
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px', borderRadius: '4px' };
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
const modalStyle = { background: '#fff', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };
