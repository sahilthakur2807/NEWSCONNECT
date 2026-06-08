import { Flame, Clock } from 'lucide-react';

const TrendingSections = () => {
  return (
    <div className="trending-container">
      <div className="container">
        <div className="trending-grid">
          <div className="trending-column">
            <h2 className="section-title">
              <Flame size={20} className="icon-trending" />
              Trending this week
            </h2>
            <div className="empty-state">
              <p>No trending rooms yet. Be the first — paste an article URL above.</p>
            </div>
          </div>
          
          <div className="trending-column">
            <h2 className="section-title">
              <Clock size={20} className="icon-recent" />
              Recently active
            </h2>
            <div className="empty-state">
              <p>No rooms yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSections;
