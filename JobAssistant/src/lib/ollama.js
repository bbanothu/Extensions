import { RESUME_SYSTEM_PROMPT, buildResumeUserMessage } from './resumePrompt.js';

const BASE_URL = 'http://localhost:11434';

export async function listOllamaModels() {
  const res = await fetch(`${BASE_URL}/api/tags`);
  if (!res.ok) throw new Error(`Ollama returned ${res.status}`);
  const data = await res.json();
  return (data.models || []).map((m) => m.name);
}

export async function tailorResumeOllama({ model, resumeText, jobText, jobTitle }) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: RESUME_SYSTEM_PROMPT },
        { role: 'user', content: buildResumeUserMessage({ resumeText, jobText, jobTitle }) },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama request failed (${res.status}). Is "ollama serve" running?`);
  }
  const data = await res.json();
  return data.message?.content ?? '';
}
