import { useEffect, useState } from 'react';
import { getHistory, removeHistoryEntry } from '../../lib/history.js';

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function History() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    getHistory().then(setItems);
  }, []);

  async function remove(id) {
    setItems(await removeHistoryEntry(id));
    if (openId === id) setOpenId(null);
  }

  if (!items.length) {
    return (
      <div className="panel">
        <div className="card muted small">
          No tailored resumes yet. Generate one from the Tailor Resume tab and it'll show up here.
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      {items.map((item) => (
        <div
          key={item.id}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 600 }}>{item.sourceLabel}</div>
              <div className="muted small">
                {item.resumeLabel} · {formatDate(item.createdAt)}
              </div>
            </div>
            <div className="row">
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                title="View"
              >
                {openId === item.id ? '︿' : '﹀'}
              </button>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => remove(item.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
          {openId === item.id && (
            <>
              <textarea readOnly value={item.result} style={{ minHeight: 220 }} />
              <button
                className="btn btn-ghost"
                onClick={() => navigator.clipboard.writeText(item.result)}
              >
                Copy
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
