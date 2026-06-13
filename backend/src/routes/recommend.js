import { Router } from 'express';
import { getRecommendations } from '../services/mlClient.js';
import { enrichWithPoster } from '../services/tmdbClient.js';

export const recommendRouter = Router();

recommendRouter.get('/:movie', async (req, res, next) => {
  try {
    const movie = decodeURIComponent(req.params.movie || '').trim();

    if (!movie) {
      return res.status(400).json({ error: 'Movie name is required.' });
    }

    const mlResponse = await getRecommendations(movie);
    const enriched = await Promise.all(
      mlResponse.recommendations.map((item) => enrichWithPoster(item))
    );

    res.json({
      query: mlResponse.query,
      matchedMovie: mlResponse.matchedMovie,
      recommendations: enriched
    });
  } catch (error) {
    next(error);
  }
});

