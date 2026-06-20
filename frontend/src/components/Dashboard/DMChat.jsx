import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';

export default function DMChat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchMessages();
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.on('dm:new', (message) => {
      if (message.senderId === userId || message.recipientId === userId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('dm:new');
    };
  }, [socket, userId]);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      setOtherUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get(`/api/dms/${userId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('dm:send', {
      recipientId: userId,
      content: newMessage,
    });

    setNewMessage('');
  };

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chathaven-bg-main">
        <p className="text-chathaven-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-chathaven-text-muted bg-chathaven-bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-chathaven-accent-primary flex items-center justify-center text-white font-bold">
            {otherUser.username[0].toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-chathaven-text-primary">
            {otherUser.username}
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-chathaven-bg-main">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.senderId === user.id
                  ? 'bg-chathaven-accent-primary text-white'
                  : 'bg-chathaven-bg-panel text-chathaven-text-primary'
              }`}
            >
              <p>{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === user.id
                    ? 'text-blue-200'
                    : 'text-chathaven-text-muted'
                }`}
              >
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-chathaven-text-muted bg-chathaven-bg-panel">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-chathaven-bg-main text-chathaven-text-primary border border-chathaven-text-muted rounded focus:outline-none focus:border-chathaven-accent-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-chathaven-accent-primary hover:bg-opacity-90 text-white rounded transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
