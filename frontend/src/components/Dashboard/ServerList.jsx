import { useState } from 'react';
import apiClient from '../../api/client';

export default function ServerList() {
  const [serverName, setServerName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('create');

  const handleCreateServer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/api/servers', { name: serverName });
      setServerName('');
      // Refresh page or navigate
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create server');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinServer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post(`/api/servers/join/${inviteCode}`);
      setInviteCode('');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-chathaven-bg-main">
      <div className="bg-chathaven-bg-panel rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-chathaven-text-primary mb-6 text-center">
          Servers
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-2 px-4 rounded transition ${
              tab === 'create'
                ? 'bg-chathaven-accent-primary text-white'
                : 'bg-chathaven-bg-main text-chathaven-text-primary hover:bg-opacity-80'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-2 px-4 rounded transition ${
              tab === 'join'
                ? 'bg-chathaven-accent-primary text-white'
                : 'bg-chathaven-bg-main text-chathaven-text-primary hover:bg-opacity-80'
            }`}
          >
            Join
          </button>
        </div>

        {/* Create Server Form */}
        {tab === 'create' && (
          <form onSubmit={handleCreateServer} className="space-y-4">
            <div>
              <label className="block text-chathaven-text-primary text-sm font-medium mb-2">
                Server Name
              </label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="My Awesome Server"
                className="w-full px-4 py-2 bg-chathaven-bg-main text-chathaven-text-primary border border-chathaven-text-muted rounded focus:outline-none focus:border-chathaven-accent-primary"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900 text-red-200 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-chathaven-accent-primary hover:bg-opacity-90 text-white font-semibold py-2 rounded transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Server'}
            </button>
          </form>
        )}

        {/* Join Server Form */}
        {tab === 'join' && (
          <form onSubmit={handleJoinServer} className="space-y-4">
            <div>
              <label className="block text-chathaven-text-primary text-sm font-medium mb-2">
                Invite Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="abc123def456"
                className="w-full px-4 py-2 bg-chathaven-bg-main text-chathaven-text-primary border border-chathaven-text-muted rounded focus:outline-none focus:border-chathaven-accent-primary"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900 text-red-200 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-chathaven-accent-primary hover:bg-opacity-90 text-white font-semibold py-2 rounded transition disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Server'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
