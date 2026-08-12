import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle.jsx';
import TailorResume from './views/TailorResume.jsx';
import History from './views/History.jsx';
import Settings from './views/Settings.jsx';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (showSettings) {
    return (
      <div className="app">
        <Settings onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="app">
        <History onClose={() => setShowHistory(false)} />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="logo" />
        <h1>Job Assistant</h1>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setShowHistory(true)}
          title="History"
        >
          🕒
        </button>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setShowSettings(true)}
          title="Settings"
        >
          ⚙
        </button>
        <ThemeToggle />
      </div>
      <TailorResume />
    </div>
  );
}
