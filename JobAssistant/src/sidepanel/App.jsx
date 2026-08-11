import { useState } from 'react';
import MessageSaver from '../components/MessageSaver.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import TailorResume from './views/TailorResume.jsx';
import History from './views/History.jsx';
import Settings from './views/Settings.jsx';

const TABS = [
  { id: 'messages', label: 'Messages' },
  { id: 'resume', label: 'Resume' },
  { id: 'history', label: 'History' },
];

export default function App() {
  const [tab, setTab] = useState('messages');
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return (
      <div className="app">
        <Settings onClose={() => setShowSettings(false)} />
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
          onClick={() => setShowSettings(true)}
          title="Settings"
        >
          ⚙
        </button>
        <ThemeToggle />
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'messages' && <MessageSaver />}
      {tab === 'resume' && <TailorResume />}
      {tab === 'history' && <History />}
    </div>
  );
}
