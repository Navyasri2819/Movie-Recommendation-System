import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { config } from './config.js';
import { recommendRouter } from './routes/recommend.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: config.frontendOrigin,
    methods: ['GET']
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

app.use('/recommend', recommendRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Unexpected backend error'
  });
});

app.listen(config.port, () => {
  console.log(`Backend API running at http://localhost:${config.port}`);
});

