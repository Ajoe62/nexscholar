import Groq from 'groq-sdk';

// Initialize lazily so builds don't fail when GROQ_API_KEY is absent.
const apiKey = process.env.GROQ_API_KEY;

export const groq = new Groq({
  apiKey: apiKey || 'demo-key',
});

export const isGroqConfigured = () =>
  Boolean(apiKey && apiKey !== 'your_actual_groq_api_key_here');

export const GROQ_MODEL = 'llama3-8b-8192'; // Fast and reliable model
