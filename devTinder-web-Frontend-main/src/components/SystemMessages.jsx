import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const SystemMessages = () => {
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedMessages, setDismissedMessages] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchSystemMessages();
    }
  }, [user]);

  const fetchSystemMessages = async () => {
    try {
      const response = await axios.get(
        BASE_URL + "/report/system-messages",
        { withCredentials: true }
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching system messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const dismissMessage = (messageId) => {
    setDismissedMessages(prev => new Set([...prev, messageId]));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'alert-error';
      case 'high': return 'alert-warning';
      case 'medium': return 'alert-info';
      case 'low': return 'alert-success';
      default: return 'alert-info';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return '🔧';
      case 'feature_update': return '✨';
      case 'alert': return '⚠️';
      case 'general': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const visibleMessages = messages.filter(msg => !dismissedMessages.has(msg._id));

  if (loading || !user || visibleMessages.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 w-96">
      {visibleMessages.map((message) => (
        <div
          key={message._id}
          className={`alert ${getPriorityColor(message.priority)} shadow-lg`}
        >
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <span className="text-lg">{getTypeIcon(message.type)}</span>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{message.title}</h3>
                <p className="text-xs mt-1">{message.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs opacity-70">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                  {message.expiresAt && (
                    <span className="text-xs opacity-70">
                      Expires: {new Date(message.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dismissMessage(message._id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default SystemMessages;