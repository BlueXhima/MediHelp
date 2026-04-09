const API_URL = 'http://localhost:5000/api';

export async function fetchResponse(text) {
  const res = await fetch(`${API_URL}/parse-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to fetch response');
  return res.json();
}