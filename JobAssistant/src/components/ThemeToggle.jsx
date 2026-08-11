import { useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, setStoredTheme } from '../lib/theme.js';

const CYCLE = ['system', 'light', 'dark'];
const ICON = { system: '◐', light: '☀', dark: '☾' };
const LABEL = { system: 'System', light: 'Light', dark: 'Dark' };

export default function ThemeToggle() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    getStoredTheme().then((t) => {
      setTheme(t);
      applyTheme(t);
    });
  }, []);

  function cycle() {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
    setTheme(next);
    applyTheme(next);
    setStoredTheme(next);
  }

  return (
    <button
      className="btn btn-ghost btn-icon"
      onClick={cycle}
      title={`Theme: ${LABEL[theme]} (click to change)`}
    >
      {ICON[theme]}
    </button>
  );
}
