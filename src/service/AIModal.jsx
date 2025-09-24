import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
});

// Try these in order if the first one is overloaded
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

function isRetryable(err) {
  const code = err?.error?.code ?? err?.code;
  const status = err?.error?.status ?? err?.status;
  return code === 503 || status === 'UNAVAILABLE' || code === 429 || status === 'RESOURCE_EXHAUSTED';
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function sendOnce(model, text) {
  const chat = ai.chats.create({ model, config: { temperature: 0.7 }, history: [] });
  const res = await chat.sendMessage({ message: text });
  if (typeof res.text === 'function') return await res.text();
  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  return parts.map(p => p.text || '').join('').trim();
}

export async function sendToGemini(prompt, {
  maxRetries = 4,         // per model
  baseDelay = 500,        // ms
  models = FALLBACK_MODELS,
} = {}) {
  const text = String(prompt ?? '').trim();
  if (!text) throw new Error('Prompt is empty.');

  let lastErr;
  for (const model of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await sendOnce(model, text);
      } catch (err) {
        lastErr = err;
        if (!isRetryable(err) || attempt === maxRetries) break; // move to next model
        const delay = Math.min(8000, baseDelay * 2 ** attempt) + Math.random() * 250; // jitter
        console.warn(`[Gemini] ${model} busy (retry ${attempt + 1}/${maxRetries}) → waiting ${Math.round(delay)}ms`);
        await sleep(delay);
      }
    }
    console.warn(`[Gemini] switching to fallback model…`);
  }
  throw lastErr;
}
