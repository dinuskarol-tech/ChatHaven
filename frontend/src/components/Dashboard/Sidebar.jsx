import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ servers, activeServerId, onServerSelect }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-chathaven-bg-panel flex flex-col border-r border-chathaven-text-muted">
      {/* Header */}
      <div className="p-4 border-b border-chathaven-text-muted">
        <h1 className="text-xl font-bold text-chathaven-accent-primary">ChatHaven</h1>
        <p className="text-xs text-chathaven-text-muted">Welcome, {user?.username}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        <button
          onClick={() => navigate('/dashboard/dms')}
          className="w-full text-left px-4 py-2 rounded hover:bg-chathaven-bg-main text-chathaven-text-primary transition"
        >
          💬 Direct Messages
        </button>

        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-chathaven-text-muted uppercase tracking-wider">
            Servers
          </p>
        </div>

        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => {
              onServerSelect(server.id);
              navigate(`/dashboard/server/${server.id}`);
            }}
            className={`w-full text-left px-4 py-2 rounded transition ${
              activeServerId === server.id
                ? 'bg-chathaven-accent-primary text-white'
                : 'hover:bg-chathaven-bg-main text-chathaven-text-primary'
            }`}
          >
            {server.name}
          </button>
        ))}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full text-left px-4 py-2 rounded hover:bg-chathaven-bg-main text-chathaven-accent-secondary transition"
        >
          + Create/Join Server
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-chathaven-text-muted">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
