import { useEffect, useRef, useState } from 'react';
import { extractPdfText } from '../../lib/pdf.js';
import { tailorResume } from '../../lib/anthropic.js';
import { tailorResumeOllama } from '../../lib/ollama.js';
import { tailorResumeOpenRouter } from '../../lib/openrouter.js';
import {
  getApiKey,
  getProvider,
  getOllamaModel,
  getOpenRouterKey,
  getOpenRouterModel,
  getResumeDraft,
  setResumeDraft,
} from '../../lib/storage.js';
import { addHistoryEntry } from '../../lib/history.js';
import { getProfile, serializeProfile } from '../../lib/profile.js';
import { buildResumeFilename, downloadResumePdf } from '../../lib/pdfExport.js';
import * as ui from '../../styles/ui.js';

const MODES = [
  { id: 'url', label: 'By URL' },
  { id: 'page', label: 'By Current Page' },
  { id: 'custom', label: 'By Custom Info' },
];

function fetchPageText(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'fetchPageText', url }, (response) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (response?.error) return reject(new Error(response.error));
      resolve(response);
    });
  });
}

export default function TailorResume() {
  const [mode, setMode] = useState('url');
  const [apiKey, setApiKeyState] = useState('');
  const [provider, setProviderState] = useState('anthropic');

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jdText, setJdText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const loadedDraft = useRef(false);

  const [status, setStatus] = useState('idle'); // idle | parsing | fetching | generating | done | error
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [resultMeta, setResultMeta] = useState({ resumeLabel: '', jobTitle: '' });
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getApiKey().then(setApiKeyState);
    getProvider().then(setProviderState);
    getResumeDraft().then((draft) => {
      setMode(draft.mode);
      setResumeText(draft.resumeText);
      setResumeFileName(draft.resumeFileName);
      setJobUrl(draft.jobUrl);
      setJdText(draft.jdText);
      loadedDraft.current = true;
    });
  }, []);

  useEffect(() => {
    if (!loadedDraft.current) return;
    setResumeDraft({ mode, resumeText, resumeFileName, jobUrl, jdText });
  }, [mode, resumeText, resumeFileName, jobUrl, jdText]);

  async function handleFile(file) {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a PDF resume.');
      return;
    }
    setError('');
    setResumeFile(file);
    setResumeFileName(file.name);
    setStatus('parsing');
    try {
      const text = await extractPdfText(file);
      setResumeText(text);
      setStatus('idle');
    } catch (e) {
      setError(`Could not read PDF: ${e.message}`);
      setStatus('error');
    }
  }

  function clearDraft() {
    setResumeFile(null);
    setResumeFileName('');
    setResumeText('');
    setJobUrl('');
    setJdText('');
    setResult('');
    setResultMeta({ resumeLabel: '', jobTitle: '' });
    setError('');
    setStatus('idle');
  }

  async function redoResume() {
    setError('');
    setResult('');

    const currentProvider = await getProvider();
    setProviderState(currentProvider);

    let key = '';
    let ollamaModel = '';
    let orKey = '';
    let orModel = '';
    if (currentProvider === 'anthropic') {
      key = await getApiKey();
      setApiKeyState(key);
      if (!key) {
        setError('Add your Anthropic API key in Settings (gear icon above) first.');
        return;
      }
    } else if (currentProvider === 'ollama') {
      ollamaModel = await getOllamaModel();
      if (!ollamaModel) {
        setError('Pick an Ollama model in Settings (gear icon above) first.');
        return;
      }
    } else {
      orKey = await getOpenRouterKey();
      orModel = await getOpenRouterModel();
      if (!orKey || !orModel) {
        setError('Add your OpenRouter API key and model in Settings (gear icon above) first.');
        return;
      }
    }

    let sourceResumeText = resumeText;
    let resumeLabel = resumeFile?.name || resumeFileName || '';
    if (mode === 'custom') {
      const profile = await getProfile();
      sourceResumeText = serializeProfile(profile);
      resumeLabel = 'Custom Info';
      if (!profile.identity?.name && !profile.experience?.length) {
        setError('Fill out your Custom Info profile in Settings first.');
        return;
      }
    } else if (!sourceResumeText) {
      setError('Upload your resume (PDF) first.');
      return;
    }

    if (mode === 'url' && !jobUrl.trim()) {
      setError('Enter the job posting URL.');
      return;
    }
    if ((mode === 'page' || mode === 'custom') && !jdText.trim()) {
      setError('Paste the job description.');
      return;
    }

    try {
      let jobText = jdText.trim();
      let jobTitle = '';
      let sourceLabel = `${jdText.trim().slice(0, 60)}${jdText.trim().length > 60 ? '…' : ''}`;

      if (mode === 'url') {
        setStatus('fetching');
        const page = await fetchPageText(jobUrl.trim());
        jobText = page.text;
        jobTitle = page.title;
        sourceLabel = jobUrl.trim();
      }

      setStatus('generating');
      let tailored;
      if (currentProvider === 'anthropic') {
        tailored = await tailorResume({
          apiKey: key,
          resumeText: sourceResumeText,
          jobText,
          jobTitle,
        });
      } else if (currentProvider === 'ollama') {
        tailored = await tailorResumeOllama({
          model: ollamaModel,
          resumeText: sourceResumeText,
          jobText,
          jobTitle,
        });
      } else {
        tailored = await tailorResumeOpenRouter({
          apiKey: orKey,
          model: orModel,
          resumeText: sourceResumeText,
          jobText,
          jobTitle,
        });
      }

      setResult(tailored);
      setResultMeta({ resumeLabel, jobTitle });
      setStatus('done');
      addHistoryEntry({
        sourceLabel,
        resumeLabel,
        result: tailored,
      });
    } catch (e) {
      setError(e.message || 'Something went wrong.');
      setStatus('error');
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function downloadResult() {
    downloadResumePdf(result, buildResumeFilename(resultMeta));
  }

  const busy = status === 'fetching' || status === 'generating' || status === 'parsing';

  return (
    <div className={`${ui.panel} ${ui.panelBottomActions}`}>
      <div>
        <div className={ui.rowBetween}>
          <label className={`${ui.label} mb-0`}>Source</label>
          <button className={`${ui.btn} ${ui.small}`} onClick={clearDraft} type="button">
            Clear
          </button>
        </div>
        <select
          className={`${ui.select} mt-2.5`}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {provider === 'anthropic' && !apiKey && (
        <div className={`${ui.card} ${ui.muted} ${ui.small}`}>
          No Anthropic API key set yet — add one in Settings (gear icon, top right).
        </div>
      )}
      {provider === 'ollama' && (
        <div className={`${ui.card} ${ui.muted} ${ui.small}`}>
          Using Ollama locally — pick a model in Settings if you haven't yet.
        </div>
      )}
      {provider === 'openrouter' && (
        <div className={`${ui.card} ${ui.muted} ${ui.small}`}>
          Using OpenRouter — set your API key and model in Settings if you haven't yet.
        </div>
      )}

      {mode === 'custom' ? (
        <div className={`${ui.card} ${ui.muted} ${ui.small}`}>
          Using your saved Custom Info profile — edit it in Settings → Custom Info.
        </div>
      ) : (
        <div>
          <label className={ui.label}>Resume (PDF)</label>
          <div
            className={`${ui.dropzone} ${dragOver ? ui.dropzoneActive : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            {status === 'parsing' ? (
              <span>Reading PDF…</span>
            ) : resumeFile || resumeFileName ? (
              <span className={ui.filename}>{resumeFile?.name || resumeFileName} ✓</span>
            ) : (
              <span>Click or drop your resume PDF here</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        </div>
      )}

      {mode === 'url' ? (
        <div>
          <label className={ui.label}>Job Posting URL</label>
          <input
            type="url"
            className={ui.input}
            placeholder="https://company.com/careers/job-id"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <label className={ui.label}>Job Description</label>
          <textarea
            className={`${ui.textarea} min-h-[200px]`}
            placeholder="Paste the job description here…"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>
      )}

      {error && <div className={ui.errorBox}>{error}</div>}

      {result && (
        <div className={ui.card}>
          <div className={ui.rowBetween}>
            <label className={`${ui.label} mb-0`}>Tailored Resume</label>
            <div className={ui.row}>
              <button className={`${ui.btn} ${ui.small}`} onClick={copyResult}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className={`${ui.btn} ${ui.small}`} onClick={downloadResult}>
                Download
              </button>
            </div>
          </div>
          <textarea
            className={`${ui.textarea} min-h-[260px] mt-2`}
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
        </div>
      )}

      <div className={ui.bottomActions}>
        <button
          className={`${ui.btn} ${ui.btnPrimary} flex-1`}
          onClick={redoResume}
          disabled={busy}
        >
          {busy && <span className={ui.spinner} />}
          {status === 'fetching' && 'Reading job posting…'}
          {status === 'generating' && 'Rewriting resume…'}
          {!busy && 'Redo This Resume'}
        </button>
      </div>
    </div>
  );
}
