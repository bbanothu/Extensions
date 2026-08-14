import { useEffect, useState } from 'react';
import { getHistory, removeHistoryEntry } from '../../lib/history.js';
import * as ui from '../../styles/ui.js';

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function History({ onClose }) {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    getHistory().then(setItems);
  }, []);

  async function remove(id) {
    setItems(await removeHistoryEntry(id));
    if (openId === id) setOpenId(null);
  }

  return (
    <div className={ui.panel}>
      <div className={ui.row}>
        <button className={`${ui.btn} ${ui.btnIcon} text-[20px]`} onClick={onClose} title="Back">
          ←
        </button>
        <span className={ui.sectionHeaderTitle}>History</span>
      </div>

      {!items.length && (
        <div className={`${ui.card} ${ui.muted} ${ui.small}`}>
          No tailored resumes yet. Generate one from the Resume tab and it'll show up here.
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className={`${ui.card} flex flex-col gap-3`}>
          <div className={ui.rowBetween}>
            <div>
              <div className="font-semibold">{item.sourceLabel}</div>
              <div className={`${ui.muted} ${ui.small}`}>
                {item.resumeLabel} · {formatDate(item.createdAt)}
              </div>
            </div>
            <div className={ui.row}>
              <button
                className={`${ui.btn} ${ui.btnIcon} text-[20px]`}
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                title="View"
              >
                {openId === item.id ? '▲' : '▼'}
              </button>
              <button
                className={`${ui.btn} ${ui.btnIcon} text-[20px]`}
                onClick={() => remove(item.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
          {openId === item.id && (
            <>
              <textarea readOnly className={`${ui.textarea} min-h-[220px]`} value={item.result} />
              <button className={ui.btn} onClick={() => navigator.clipboard.writeText(item.result)}>
                Copy
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
