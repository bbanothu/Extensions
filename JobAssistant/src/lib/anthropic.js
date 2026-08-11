import Anthropic from '@anthropic-ai/sdk';
import { RESUME_SYSTEM_PROMPT, buildResumeUserMessage } from './resumePrompt.js';

export async function tailorResume({ apiKey, resumeText, jobText, jobTitle }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const message = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 4096,
    system: RESUME_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: buildResumeUserMessage({ resumeText, jobText, jobTitle }) },
    ],
  });

  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}
