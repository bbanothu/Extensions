import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import * as ui from '../styles/ui.js';

const emptyMessage = { title: '', content: '' };

export default function MessageSaver() {
  const [messages, setMessages] = useState([emptyMessage]);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    chrome.storage.sync.get('savedMessages', (items) => {
      if (items.savedMessages?.length) setMessages(items.savedMessages);
    });
  }, []);

  const current = messages[index] ?? emptyMessage;

  function updateCurrent(patch) {
    setMessages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  function save() {
    chrome.storage.sync.set({ savedMessages: messages });
  }

  function copy() {
    navigator.clipboard.writeText(current.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function back() {
    if (index > 0) setIndex(index - 1);
  }

  function forward() {
    if (index < messages.length - 1) {
      setIndex(index + 1);
    } else {
      setMessages((prev) => [...prev, { ...emptyMessage }]);
      setIndex(index + 1);
    }
  }

  function del() {
    setMessages((prev) => {
      let next;
      let nextIndex = index;
      if (prev.length > 1) {
        next = prev.filter((_, i) => i !== index);
        nextIndex = Math.max(0, index - 1);
      } else {
        next = [{ ...emptyMessage }];
        nextIndex = 0;
      }
      chrome.storage.sync.set({ savedMessages: next });
      setIndex(nextIndex);
      return next;
    });
  }

  return (
    <div className={`${ui.panel} gap-4`}>
      <div className={ui.rowBetween}>
        <div className={ui.row}>
          <span className={ui.sectionHeaderTitle}>Message Saver</span>
          <span
            className={ui.infoIcon}
            title="Use the arrows to navigate messages. Type a title and message, then Save. Copy to clipboard, or delete with the trash icon."
          >
            &#9432;
          </span>
        </div>
        <div className={ui.row}>
          <button className={`${ui.btn} ${ui.btnIconSm}`} onClick={del} title="Delete this message">
            🗑
          </button>
          <ThemeToggle size="sm" />
        </div>
      </div>

      <div
        className={`${ui.rowBetween} bg-surface border border-surface-strong rounded-pill px-2 py-1.5`}
      >
        <button
          className={`${ui.btn} ${ui.btnIconSm}`}
          onClick={back}
          disabled={index === 0}
          title="Previous message"
        >
          ‹
        </button>
        <span className={`${ui.muted} ${ui.small} font-medium`}>
          {index + 1} / {messages.length}
        </span>
        <button className={`${ui.btn} ${ui.btnIconSm}`} onClick={forward} title="Next message">
          ›
        </button>
      </div>

      <div>
        <label className={ui.label}>Title</label>
        <input
          ref={titleRef}
          type="text"
          className={ui.input}
          value={current.title}
          onChange={(e) => updateCurrent({ title: e.target.value })}
          placeholder="e.g. Cold outreach"
        />
      </div>

      <div>
        <label className={ui.label}>Message</label>
        <textarea
          className={`${ui.textarea} min-h-[140px]`}
          value={current.content}
          onChange={(e) => updateCurrent({ content: e.target.value })}
          placeholder="Write the message you want to reuse..."
        />
      </div>

      <div className={ui.row}>
        <button className={`${ui.btn} ${ui.btnPrimary} flex-1`} onClick={save}>
          Save
        </button>
        <button className={`${ui.btn} flex-1`} onClick={copy}>
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
}
