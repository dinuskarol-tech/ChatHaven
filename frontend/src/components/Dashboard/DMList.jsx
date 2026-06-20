import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

export default function DMList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await apiClient.get('/api/dms');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chathaven-bg-main">
        <p className="text-chathaven-text-muted">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-chathaven-bg-main">
      <div className="p-4 border-b border-chathaven-text-muted">
        <h2 className="text-xl font-bold text-chathaven-text-primary">Direct Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-chathaven-text-muted">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/dashboard/dm/${conv.id}`)}
                className="w-full text-left p-3 rounded hover:bg-chathaven-bg-panel transition border border-transparent hover:border-chathaven-text-muted"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-chathaven-text-primary">
                    {conv.username}
                  </span>
                  {conv.unread_count > 0 && (
                    <span className="bg-chathaven-accent-secondary text-white text-xs px-2 py-1 rounded-full">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-chathaven-text-muted truncate mt-1">
                  {conv.last_message || 'No messages yet'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
