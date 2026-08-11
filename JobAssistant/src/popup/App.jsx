import MessageSaver from '../components/MessageSaver.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

async function openSidePanel() {
  const win = await chrome.windows.getCurrent();
  await chrome.sidePanel.open({ windowId: win.id });
}

export default function App() {
  return (
    <div className="app">
      <div className="app-header">
        <div className="logo" />
        <h1>Job Assistant</h1>
        <ThemeToggle />
      </div>
      <MessageSaver />
      <div style={{ padding: '0 16px 16px' }}>
        <button className="btn btn-purple" style={{ width: '100%' }} onClick={openSidePanel}>
          Open Tailor Resume →
        </button>
      </div>
    </div>
  );
}
