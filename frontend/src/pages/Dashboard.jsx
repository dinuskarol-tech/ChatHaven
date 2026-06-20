import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import ServerList from '../components/Dashboard/ServerList';
import ChannelChat from '../components/Dashboard/ChannelChat';
import DMList from '../components/Dashboard/DMList';
import DMChat from '../components/Dashboard/DMChat';
import apiClient from '../api/client';

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [activeServerId, setActiveServerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await apiClient.get('/api/servers');
      setServers(response.data.servers);
      if (response.data.servers.length > 0) {
        setActiveServerId(response.data.servers[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-chathaven-bg-main">
        <div className="text-chathaven-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-chathaven-bg-main">
      <Sidebar servers={servers} activeServerId={activeServerId} onServerSelect={setActiveServerId} />

      <Routes>
        <Route path="/" element={<ServerList />} />
        <Route path="/server/:serverId/*" element={<ChannelChat />} />
        <Route path="/dms" element={<DMList />} />
        <Route path="/dm/:userId" element={<DMChat />} />
      </Routes>
    </div>
  );
}
