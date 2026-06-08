import { Puzzle, Download, MousePointer2, MessageSquare } from 'lucide-react';

const ExtensionPage = () => {
  return (
    <div className="extension-page">
      <div className="container">
        <div className="extension-hero">
          <div className="extension-icon-large">
            <Puzzle size={32} />
          </div>
          <h1 className="extension-title">Browser Extension</h1>
          <p className="extension-subtitle">
            One click on any news article opens the live NewsConnect <br />
            discussion for that story.
          </p>
          
          <button className="btn-download">
            <Download size={20} />
            Download for Chrome / Edge / Brave
          </button>
        </div>

        <div className="instructions-grid">
          <div className="instruction-card">
            <Download className="icon-red" size={24} />
            <h3>1. Download & unzip</h3>
            <p>Download the .zip above and extract it anywhere on your computer.</p>
          </div>
          
          <div className="instruction-card">
            <Puzzle className="icon-red" size={24} />
            <h3>2. Load unpacked</h3>
            <p>Open chrome://extensions, enable Developer mode, click "Load unpacked", select the folder.</p>
          </div>
          
          <div className="instruction-card">
            <MousePointer2 className="icon-red" size={24} />
            <h3>3. Click on any article</h3>
            <p>Visit a news article and click the NewsConnect icon to jump straight to the discussion.</p>
          </div>
        </div>

        <div className="how-it-works-box">
          <h2>How it works</h2>
          <ul className="benefits-list">
            <li>
              <MessageSquare className="benefit-icon" size={18} />
              <span>Article URLs are normalized so the same story from different referrers maps to one discussion room.</span>
            </li>
            <li>
              <MessageSquare className="benefit-icon" size={18} />
              <span>If no room exists for the article, the extension creates one automatically.</span>
            </li>
            <li>
              <MessageSquare className="benefit-icon" size={18} />
              <span>Works on any site — BBC, CNN, Reuters, NDTV, blogs, anywhere.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPage;
