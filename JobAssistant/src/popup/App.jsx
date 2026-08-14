import MessageSaver from '../components/MessageSaver.jsx';
import * as ui from '../styles/ui.js';

async function openSidePanel() {
  const win = await chrome.windows.getCurrent();
  await chrome.sidePanel.open({ windowId: win.id });
}

export default function App() {
  return (
    <div className={ui.app}>
      <MessageSaver />
      <div className="px-4 pb-4">
        <button className={`${ui.btn} ${ui.btnPrimary} w-full`} onClick={openSidePanel}>
          Open Tailor Resume →
        </button>
      </div>
    </div>
  );
}
