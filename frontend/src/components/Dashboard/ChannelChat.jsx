import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';

export default function ChannelChat() {
  const { serverId, channelId } = useParams();
  const socket = useSocket();
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (serverId) {
      fetchChannels();
    }
  }, [serverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket || !activeChannel) return;

    socket.emit('channel:join', { channelId: activeChannel.id, serverId });

    socket.on('message:new', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message:new');
      socket.emit('channel:leave', { channelId: activeChannel.id });
    };
  }, [socket, activeChannel, serverId]);

  const fetchChannels = async () => {
    try {
      const response = await apiClient.get(`/api/channels/${serverId}/channels`);
      setChannels(response.data.channels);
      if (response.data.channels.length > 0) {
        setActiveChannel(response.data.channels[0]);
        fetchMessages(response.data.channels[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const fetchMessages = async (cId) => {
    try {
      const response = await apiClient.get(`/api/messages/channel/${cId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !activeChannel) return;

    socket.emit('message:send', {
      channelId: activeChannel.id,
      content: newMessage,
      serverId,
    });

    setNewMessage('');
  };

  if (!activeChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chathaven-bg-main">
        <p className="text-chathaven-text-muted">Select a channel</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Channels Sidebar */}
      <div className="w-48 bg-chathaven-bg-panel border-r border-chathaven-text-muted flex flex-col">
        <div className="p-4 border-b border-chathaven-text-muted">
          <h3 className="text-lg font-bold text-chathaven-accent-primary">Channels</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                setActiveChannel(channel);
                fetchMessages(channel.id);
              }}
              className={`w-full text-left px-4 py-2 rounded transition ${
                activeChannel.id === channel.id
                  ? 'bg-chathaven-accent-primary text-white'
                  : 'hover:bg-chathaven-bg-main text-chathaven-text-primary'
              }`}
            >
              #{channel.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-chathaven-text-muted">
          <h2 className="text-xl font-bold text-chathaven-text-primary">
            #{activeChannel.name}
          </h2>
          {activeChannel.topic && (
            <p className="text-sm text-chathaven-text-muted">{activeChannel.topic}</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-chathaven-accent-primary flex items-center justify-center text-white font-bold">
                {message.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-chathaven-text-primary">
                    {message.username}
                  </span>
                  <span className="text-xs text-chathaven-text-muted">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-chathaven-text-primary mt-1">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-chathaven-text-muted">
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
    </div>
  );
}
