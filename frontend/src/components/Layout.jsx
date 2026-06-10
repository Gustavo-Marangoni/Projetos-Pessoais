import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', background: '#1a1a2e', color: '#fff',
        padding: '24px 16px', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#7c6af7', margin: 0 }}>
            ✅ TaskManager
          </h1>
          <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>Olá, {user?.name}</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { to: '/dashboard', icon: '📊', label: 'Dashboard' },
            { to: '/tasks', icon: '📋', label: 'Minhas Tarefas' },
          ].map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
              color: isActive ? '#fff' : '#aaa',
              background: isActive ? '#7c6af7' : 'transparent',
              fontSize: '14px', fontWeight: isActive ? 600 : 400,
              transition: 'all 0.2s',
            })}>
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>

        <button onClick={logout} style={{
          background: 'none', border: '1px solid #444', color: '#aaa',
          padding: '10px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '13px', marginTop: 'auto',
        }}>
          🚪 Sair
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: '#f5f5f5', padding: '32px', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
