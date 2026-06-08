import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';

const TrendingSections = () => {
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const [trendingRes, recentRes] = await Promise.all([
          fetch('/api/rooms/trending'),
          fetch('/api/rooms/recent')
        ]);

        if (trendingRes.ok && recentRes.ok) {
          const trendingData = await trendingRes.json();
          const recentData = await recentRes.json();
          setTrending(trendingData);
          setRecent(recentData);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getDomain = (urlStr) => {
    try {
      const url = new URL(urlStr);
      return url.hostname.replace('www.', '');
    } catch (e) {
      return 'News Link';
    }
  };

  const renderRoomList = (rooms, emptyMessage) => {
    if (rooms.length === 0) {
      return (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="rooms-list">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="room-card" 
            onClick={() => navigate(`/room/${room.id}`)}
          >
            <div className="room-card-header">
              <span className="room-domain">{getDomain(room.url)}</span>
              <span className="room-chat-count">
                <MessageSquare size={14} />
                {room.message_count} {room.message_count === 1 ? 'chat' : 'chats'}
              </span>
            </div>
            <h3 className="room-card-title">{room.title}</h3>
            <div className="room-card-footer">
              <span className="room-go">
                Join discussion <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="trending-container">
      <div className="container">
        {loading ? (
          <div className="trending-loading">
            <div className="spinner"></div>
            <p>Loading active rooms...</p>
          </div>
        ) : (
          <div className="trending-grid">
            <div className="trending-column">
              <h2 className="section-title">
                <Flame size={20} className="icon-trending" />
                Trending Discussions
              </h2>
              {renderRoomList(
                trending, 
                'No discussions yet. Be the first — paste an article URL above.'
              )}
            </div>
            
            <div className="trending-column">
              <h2 className="section-title">
                <Clock size={20} className="icon-recent" />
                Recently Active
              </h2>
              {renderRoomList(
                recent, 
                'No active rooms yet.'
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingSections;
