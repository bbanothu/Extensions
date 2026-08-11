import { RESUME_SYSTEM_PROMPT, buildResumeUserMessage } from './resumePrompt.js';

const BASE_URL = 'https://openrouter.ai/api/v1';

export async function listFreeOpenRouterModels() {
  const res = await fetch(`${BASE_URL}/models`);
  if (!res.ok) throw new Error(`OpenRouter returned ${res.status}`);
  const data = await res.json();
  return (data.data || [])
    .filter((m) => Number(m.pricing?.prompt) === 0 && Number(m.pricing?.completion) === 0)
    .map((m) => ({ id: m.id, name: m.name || m.id }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function tailorResumeOpenRouter({ apiKey, model, resumeText, jobText, jobTitle }) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: RESUME_SYSTEM_PROMPT },
        { role: 'user', content: buildResumeUserMessage({ resumeText, jobText, jobTitle }) },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenRouter request failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}
