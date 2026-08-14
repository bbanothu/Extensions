import { useEffect, useRef, useState } from 'react';
import * as ui from '../../styles/ui.js';

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
    <div className={`${ui.card} p-0 overflow-hidden flex flex-col h-full`}>
      <div className="flex items-center justify-between gap-2.5 pl-3.5 pr-2 py-2 bg-surface-strong cursor-move shrink-0 grid-tile-handle">
        <span className="font-semibold text-[13px] text-ink overflow-hidden text-ellipsis whitespace-nowrap">
          {tile.label}
        </span>
        <div className="flex gap-0.5 shrink-0">
          <button
            className={`${ui.btn} ${ui.btnIconSm}`}
            onClick={reload}
            title="Refresh"
            type="button"
          >
            ⟳
          </button>
          <button
            className={`${ui.btn} ${ui.btnIconSm}`}
            onClick={openInTab}
            title="Open in tab"
            type="button"
          >
            ⇱
          </button>
          <button
            className={`${ui.btn} ${ui.btnIconSm}`}
            onClick={onRemove}
            title="Remove"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="relative flex-1 flex">
        {status === 'loading' && (
          <div className="absolute top-3.5 right-3.5 w-[17px] h-[17px] rounded-full border-[2.5px] border-surface-strong border-t-muted animate-spin pointer-events-none" />
        )}
        {status === 'timeout' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 p-6 text-center bg-surface">
            <p className={`${ui.muted} ${ui.small}`}>
              This is taking too long to load embedded — the site may be blocking it (bot protection
              or anti-embedding scripts).
            </p>
            <div className={ui.row}>
              <button className={`${ui.btn} ${ui.small}`} onClick={reload} type="button">
                Retry
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary} ${ui.small}`}
                onClick={openInTab}
                type="button"
              >
                Open in Tab
              </button>
            </div>
          </div>
        )}
        <iframe
          key={reloadKey}
          src={tile.url}
          title={tile.label}
          className={`flex-1 w-full border-none bg-white ${status === 'timeout' ? 'hidden' : 'block'}`}
          onLoad={() => setStatus('loaded')}
        />
      </div>
    </div>
  );
}
