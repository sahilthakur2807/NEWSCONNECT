import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrendingSections from './components/TrendingSections';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <TrendingSections />
      </main>
    </div>
  );
}

export default App;
