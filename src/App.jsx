import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './routes/LandingPage';
import ExtensionPage from './routes/ExtensionPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/extension" element={<ExtensionPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
