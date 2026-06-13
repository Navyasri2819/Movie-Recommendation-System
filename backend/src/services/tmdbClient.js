import { config } from '../config.js';

const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export async function enrichWithPoster(movie) {
  const posterUrl = await findPoster(movie.title, movie.year);

  return {
    ...movie,
    posterUrl: posterUrl || createFallbackPoster(movie.title)
  };
}

async function findPoster(title, year) {
  if (!config.tmdbApiKey) {
    return null;
  }

  const params = new URLSearchParams({
    api_key: config.tmdbApiKey,
    query: title,
    include_adult: 'false'
  });

  if (year) {
    params.set('year', String(year));
  }

  const response = await fetch(`${TMDB_SEARCH_URL}?${params.toString()}`);

  if (!response.ok) {
    console.warn(`TMDB lookup failed for "${title}" with ${response.status}`);
    return null;
  }

  const data = await response.json();
  const posterPath = data.results?.[0]?.poster_path;

  return posterPath ? `${TMDB_IMAGE_BASE}${posterPath}` : null;
}

function createFallbackPoster(title) {
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#141414"/>
          <stop offset="45%" stop-color="#3b0b0b"/>
          <stop offset="100%" stop-color="#e50914"/>
        </linearGradient>
      </defs>
      <rect width="500" height="750" fill="url(#bg)"/>
      <circle cx="410" cy="100" r="120" fill="#ffffff" opacity="0.08"/>
      <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="112" font-weight="800" fill="#ffffff">${escapeXml(initials || 'MOV')}</text>
      <text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff">${escapeXml(title.slice(0, 24))}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (char) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;'
    };

    return entities[char];
  });
}

