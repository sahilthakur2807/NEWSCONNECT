import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  MessageSquare, 
  Send, 
  ExternalLink, 
  Lock, 
  User, 
  TrendingUp, 
  ArrowLeft,
  Calendar,
  Globe
} from 'lucide-react';

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  // Fetch Room Info & Trending Sidebar
  useEffect(() => {
    const fetchRoomAndTrending = async () => {
      try {
        const [roomRes, trendingRes] = await Promise.all([
          fetch(`/api/rooms/${roomId}`),
          fetch('/api/rooms/trending')
        ]);

        if (!roomRes.ok) {
          throw new Error('Room not found');
        }

        const roomData = await roomRes.json();
        setRoom(roomData);

        if (trendingRes.ok) {
          const trendingData = await trendingRes.json();
          // Filter out current room from trending sidebar
          setTrending(trendingData.filter(r => r.id !== parseInt(roomId)));
        }
      } catch (err) {
        setError(err.message || 'Error loading room');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAndTrending();
  }, [roomId]);

  // Load and poll messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to send message. Please log in.');
      }

      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const getDomain = (urlStr) => {
    try {
      const url = new URL(urlStr);
      return url.hostname.replace('www.', '');
    } catch (e) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="room-page-loading">
        <div className="spinner"></div>
        <p>Connecting to discussion room...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container room-page-error">
        <h2>Discussion Room Error</h2>
        <p>{error || 'The room you are looking for does not exist.'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="room-page">
      <div className="container room-grid">
        {/* Left/Main Content: Article Header & Chat Room */}
        <div className="room-main">
          {/* Header */}
          <div className="room-header">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} /> Back to active rooms
            </Link>
            
            <div className="room-meta">
              <span className="room-meta-item">
                <Globe size={14} />
                {getDomain(room.url)}
              </span>
              {room.created_at && (
                <span className="room-meta-item">
                  <Calendar size={14} />
                  {new Date(room.created_at).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
            </div>

            <h1 className="room-title">{room.title}</h1>
            
            <a 
              href={room.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="original-article-link"
            >
              Read full original story <ExternalLink size={14} />
            </a>
          </div>

          {/* Chat Container */}
          <div className="chat-container-box">
            <div className="chat-header">
              <MessageSquare size={18} />
              <span>Live Discussion Room</span>
              <span className="chat-indicator">
                <span className="badge-dot"></span> Live
              </span>
            </div>

            {/* Messages Feed */}
            <div className="chat-messages-feed">
              {messages.length === 0 ? (
                <div className="chat-empty-state">
                  <MessageSquare size={36} />
                  <p>No messages yet. Be the first to start the discussion!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCurrentUser = user && user.username === msg.username;
                  return (
                    <div 
                      key={msg.id} 
                      className={`chat-bubble-wrapper ${isCurrentUser ? 'current-user' : ''}`}
                    >
                      <div className="chat-bubble-avatar">
                        {msg.username ? msg.username.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div className="chat-bubble-content">
                        <div className="chat-bubble-user-info">
                          <span className="username">{msg.username || 'Anonymous'}</span>
                          <span className="timestamp">
                            {new Date(msg.created_at).toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="chat-bubble-text">{msg.content}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="chat-input-area">
              {user ? (
                <form onSubmit={handleSendMessage} className="chat-form">
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    maxLength={1000}
                  />
                  <button type="submit" className="btn-send" disabled={!newMessage.trim() || sending}>
                    <Send size={18} />
                  </button>
                </form>
              ) : (
                <div className="chat-locked-state">
                  <Lock size={16} />
                  <p>
                    You must be signed in to post.{' '}
                    <Link to="/login" className="text-primary">Log In</Link> or{' '}
                    <Link to="/signup" className="text-primary">Sign Up</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content: Sidebar */}
        <div className="room-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <TrendingUp size={16} /> Trending Discussions
            </h3>
            {trending.length === 0 ? (
              <p className="sidebar-empty">No other trending rooms found.</p>
            ) : (
              <div className="sidebar-list">
                {trending.slice(0, 5).map(t => (
                  <div 
                    key={t.id} 
                    className="sidebar-item" 
                    onClick={() => navigate(`/room/${t.id}`)}
                  >
                    <span className="sidebar-item-domain">{getDomain(t.url)}</span>
                    <h4 className="sidebar-item-title">{t.title}</h4>
                    <span className="sidebar-item-chats">
                      <MessageSquare size={12} /> {t.message_count} chats
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
