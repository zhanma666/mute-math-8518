import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeechProvider } from './contexts/SpeechContext';
import Home from './pages/Home/Home';
import ProfessionalSelection from './pages/ProfessionalSelection/ProfessionalSelection';
import TopicGeneration from './pages/TopicGeneration/TopicGeneration';
import SpeechSimulation from './pages/SpeechSimulation/SpeechSimulation';
import './App.css';

function App() {
  return (
    <SpeechProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/professional-selection" element={<ProfessionalSelection />} />
            <Route path="/topic-generation" element={<TopicGeneration />} />
            <Route path="/speech-simulation" element={<SpeechSimulation />} />
          </Routes>
        </div>
      </Router>
    </SpeechProvider>
  );
}

export default App;
