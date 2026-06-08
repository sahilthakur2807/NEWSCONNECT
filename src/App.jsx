import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import LandingPage from './routes/LandingPage';
import ExtensionPage from './routes/ExtensionPage';
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignupPage';
import RoomPage from './routes/RoomPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Auth routes without Navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Main routes with Navbar */}
            <Route path="*" element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/extension" element={<ExtensionPage />} />
                    <Route path="/room/:roomId" element={<RoomPage />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
