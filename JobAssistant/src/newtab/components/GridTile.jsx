import { useEffect, useRef, useState } from 'react';

const LOAD_TIMEOUT_MS = 8000;

export default function GridTile({ tile, onRemove }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState('loading'); // loading | loaded | timeout
  const timerRef = useRef(null);

  useEffect(() => {
    setStatus('loading');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus((s) => (s === 'loading' ? 'timeout' : s));
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timerRef.current);
  }, [reloadKey, tile.url]);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  function openInTab() {
    chrome.tabs.create({ url: tile.url });
  }

  return (
    <div className="grid-tile">
      <div className="grid-tile-handle">
        <span className="grid-tile-label">{tile.label}</span>
        <div className="grid-tile-actions">
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={reload}
            title="Refresh"
            type="button"
          >
            ⟳
          </button>
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={openInTab}
            title="Open in tab"
            type="button"
          >
            ⇱
          </button>
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={onRemove}
            title="Remove"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="grid-tile-body">
        {status === 'loading' && <div className="grid-tile-spinner" />}
        {status === 'timeout' && (
          <div className="grid-tile-fallback">
            <p className="muted small">
              This is taking too long to load embedded — the site may be blocking it (bot protection
              or anti-embedding scripts).
            </p>
            <div className="row">
              <button className="btn btn-ghost small" onClick={reload} type="button">
                Retry
              </button>
              <button className="btn btn-primary small" onClick={openInTab} type="button">
                Open in Tab
              </button>
            </div>
          </div>
        )}
        <iframe
          key={reloadKey}
          src={tile.url}
          title={tile.label}
          className="grid-tile-frame"
          style={{ display: status === 'timeout' ? 'none' : 'block' }}
          onLoad={() => setStatus('loaded')}
        />
      </div>
    </div>
  );
}
