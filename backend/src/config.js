import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  mlApiUrl: process.env.ML_API_URL || 'http://localhost:5001',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  tmdbApiKey: process.env.TMDB_API_KEY || ''
};

