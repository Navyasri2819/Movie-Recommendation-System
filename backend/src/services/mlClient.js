import { config } from '../config.js';

export async function getRecommendations(movie) {
  const url = `${config.mlApiUrl}/recommend/${encodeURIComponent(movie)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const payload = await safeJson(response);
    const error = new Error(payload.error || 'ML service request failed.');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

