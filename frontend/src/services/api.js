const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchRecommendations(movie) {
  const response = await fetch(`${API_BASE_URL}/recommend/${encodeURIComponent(movie)}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const suggestions = payload.suggestions?.length
      ? ` Try: ${payload.suggestions.join(', ')}.`
      : '';
    throw new Error(`${payload.error || 'Could not fetch recommendations.'}${suggestions}`);
  }

  return payload;
}

