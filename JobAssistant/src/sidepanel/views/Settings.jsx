import { useEffect, useState } from 'react';
import {
  getApiKey,
  setApiKey,
  getProvider,
  setProvider,
  getOllamaModel,
  setOllamaModel,
  getOpenRouterKey,
  setOpenRouterKey,
  getOpenRouterModel,
  setOpenRouterModel,
} from '../../lib/storage.js';
import { listOllamaModels } from '../../lib/ollama.js';
import { listFreeOpenRouterModels } from '../../lib/openrouter.js';
import CustomInfo from './CustomInfo.jsx';

const SECTIONS = [
  { id: 'models', label: 'Models' },
  { id: 'custom', label: 'Custom Info' },
];

const PROVIDERS = [
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'ollama', label: 'Ollama (local)' },
  { id: 'openrouter', label: 'OpenRouter' },
];

export default function Settings({ onClose }) {
  const [section, setSection] = useState('models');
  const [provider, setProviderState] = useState('anthropic');
  const [draftKey, setDraftKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);

  const [models, setModels] = useState([]);
  const [modelStatus, setModelStatus] = useState('loading'); // loading | ok | error
  const [selectedModel, setSelectedModel] = useState('');

  const [orKey, setOrKey] = useState('');
  const [orModel, setOrModel] = useState('');
  const [orSaved, setOrSaved] = useState(false);
  const [freeModels, setFreeModels] = useState(null); // null = not loaded, [] = loaded empty
  const [freeStatus, setFreeStatus] = useState('idle'); // idle | loading | error

  useEffect(() => {
    getProvider().then(setProviderState);
    getApiKey().then(setDraftKey);
    getOllamaModel().then(setSelectedModel);
    getOpenRouterKey().then(setOrKey);
    getOpenRouterModel().then(setOrModel);
  }, []);

  useEffect(() => {
    if (provider !== 'ollama') return;
    setModelStatus('loading');
    listOllamaModels()
      .then((list) => {
        setModels(list);
        setModelStatus('ok');
        setSelectedModel((prev) => {
          const next = prev || list[0] || '';
          if (!prev && next) setOllamaModel(next);
          return next;
        });
      })
      .catch(() => setModelStatus('error'));
  }, [provider]);

  async function chooseProvider(id) {
    setProviderState(id);
    await setProvider(id);
  }

  async function saveKey() {
    await setApiKey(draftKey.trim());
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 1200);
  }

  async function chooseModel(name) {
    setSelectedModel(name);
    await setOllamaModel(name);
  }

  async function loadFreeModels() {
    setFreeStatus('loading');
    try {
      setFreeModels(await listFreeOpenRouterModels());
      setFreeStatus('idle');
    } catch {
      setFreeStatus('error');
    }
  }

  async function saveOpenRouter() {
    await setOpenRouterKey(orKey.trim());
    await setOpenRouterModel(orModel.trim());
    setOrSaved(true);
    setTimeout(() => setOrSaved(false), 1200);
  }

  return (
    <div className="panel">
      <div className="row-between">
        <span className="section-header title">Settings</span>
        <button className="btn btn-ghost btn-icon" onClick={onClose} title="Close">
          ✕
        </button>
      </div>

      <div className="subtabs">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`subtab${section === s.id ? ' active' : ''}`}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'custom' && <CustomInfo />}

      {section === 'models' && (
        <>
          <div>
            <label>Provider</label>
            <select value={provider} onChange={(e) => chooseProvider(e.target.value)}>
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {provider === 'anthropic' && (
            <div className="card">
              <label>Anthropic API Key</label>
              <input
                type="password"
                placeholder="sk-ant-..."
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
              />
              <div className="muted small" style={{ marginTop: 12 }}>
                Used to generate tailored resumes. Stored locally in this browser and only ever sent
                to Anthropic's API.
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16, width: '100%' }}
                onClick={saveKey}
              >
                {savedKey ? 'Saved ✓' : 'Save Key'}
              </button>
            </div>
          )}

          {provider === 'ollama' && (
            <div className="card">
              <label>Model</label>
              {modelStatus === 'loading' && (
                <div className="muted small">Checking localhost:11434…</div>
              )}
              {modelStatus === 'error' && (
                <div className="error-box">
                  Couldn't reach Ollama at localhost:11434. Run <code>ollama serve</code> and make
                  sure at least one model is pulled (e.g. <code>ollama pull llama3.1</code>).
                </div>
              )}
              {modelStatus === 'ok' && models.length === 0 && (
                <div className="muted small">
                  No models pulled yet. Run <code>ollama pull llama3.1</code>.
                </div>
              )}
              {modelStatus === 'ok' && models.length > 0 && (
                <select value={selectedModel} onChange={(e) => chooseModel(e.target.value)}>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
              <div className="muted small" style={{ marginTop: 12 }}>
                Runs fully on your machine — nothing leaves your computer. No API key needed.
              </div>
            </div>
          )}

          {provider === 'openrouter' && (
            <div className="card">
              <label>OpenRouter API Key</label>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={orKey}
                onChange={(e) => setOrKey(e.target.value)}
              />
              <div className="row-between" style={{ marginTop: 16 }}>
                <label style={{ marginBottom: 0 }}>Model</label>
                <button className="btn btn-ghost small" onClick={loadFreeModels}>
                  {freeStatus === 'loading' ? 'Loading…' : 'Browse free models'}
                </button>
              </div>
              <input
                type="text"
                placeholder="anthropic/claude-3.5-sonnet"
                value={orModel}
                onChange={(e) => setOrModel(e.target.value)}
              />

              {freeStatus === 'error' && (
                <div className="error-box" style={{ marginTop: 10 }}>
                  Couldn't load the model list from OpenRouter.
                </div>
              )}
              {freeModels && freeModels.length > 0 && (
                <select
                  value=""
                  onChange={(e) => e.target.value && setOrModel(e.target.value)}
                  style={{ marginTop: 10 }}
                >
                  <option value="">{freeModels.length} free models — pick one…</option>
                  {freeModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="muted small" style={{ marginTop: 12 }}>
                Free models are tagged <code>:free</code> in their slug. Key is stored locally and
                sent only to OpenRouter.
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16, width: '100%' }}
                onClick={saveOpenRouter}
              >
                {orSaved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
