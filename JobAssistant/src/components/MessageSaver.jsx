import { useEffect, useRef, useState } from 'react';

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
    <div className="panel panel-bottom-actions">
      <div className="row-between">
        <div className="row">
          <strong>Message Saver</strong>
          <span
            className="info-icon"
            title="Use the arrows to navigate messages. Type a title and message, then Save. Copy to clipboard, or delete with the trash icon."
          >
            &#9432;
          </span>
        </div>
        <button className="btn btn-danger btn-icon" onClick={del} title="Delete this message">
          🗑
        </button>
      </div>

      <div className="row-between">
        <button className="btn btn-ghost btn-icon" onClick={back} disabled={index === 0}>
          ‹
        </button>
        <span className="muted small">
          {index + 1}/{messages.length}
        </span>
        <button className="btn btn-ghost btn-icon" onClick={forward}>
          ›
        </button>
      </div>

      <div>
        <label>Title</label>
        <input
          ref={titleRef}
          type="text"
          value={current.title}
          onChange={(e) => updateCurrent({ title: e.target.value })}
          placeholder="e.g. Cold outreach"
        />
      </div>

      <div>
        <label>Message</label>
        <textarea
          value={current.content}
          onChange={(e) => updateCurrent({ content: e.target.value })}
          placeholder="Write the message you want to reuse..."
        />
      </div>

      <div className="row bottom-actions">
        <button className="btn btn-success" onClick={save} style={{ flex: 1 }}>
          Save
        </button>
        <button className="btn btn-ghost" onClick={copy} style={{ flex: 1 }}>
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
}
