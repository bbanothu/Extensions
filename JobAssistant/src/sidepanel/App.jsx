import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Logo from '../components/Logo.jsx';
import TailorResume from './views/TailorResume.jsx';
import History from './views/History.jsx';
import Settings from './views/Settings.jsx';
import * as ui from '../styles/ui.js';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (showSettings) {
    return (
      <div className={ui.app}>
        <Settings onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className={ui.app}>
        <History onClose={() => setShowHistory(false)} />
      </div>
    );
  }

  return (
    <div className={ui.app}>
      <div className={ui.appHeader}>
        <Logo />
        <h1 className={ui.appTitle}>Resume Assistant</h1>
        <button
          className={`${ui.btn} ${ui.btnIcon}`}
          onClick={() => setShowHistory(true)}
          title="History"
        >
          🕒
        </button>
        <button
          className={`${ui.btn} ${ui.btnIcon}`}
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
