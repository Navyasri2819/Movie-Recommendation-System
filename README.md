# Netflix-Style Movie Recommendation System

A full-stack movie recommender built with:

- React + Tailwind CSS frontend
- Node.js + Express backend gateway
- Python Flask ML service
- TF-IDF genre similarity over a MovieLens-style dataset
- Optional TMDB poster enrichment

## Project Structure

```text
movie rcmd/
  backend/      Express API gateway
  frontend/     React + Tailwind Netflix-style UI
  ml-service/   Flask recommender service
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- A TMDB API key for real poster images

The app still works without a TMDB key by showing styled fallback posters.

## Setup

### 1. ML Service

```bash
cd ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The ML service runs on `http://localhost:5001`.

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set `TMDB_API_KEY` in `backend/.env` for poster images.

The backend runs on `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Flow

```text
React UI -> Express /recommend/:movie -> Flask /recommend/:movie -> Express enriches posters via TMDB -> React renders cards
```

## Example Searches

Try:

- Toy Story
- Jumanji
- Heat
- Sabrina
- GoldenEye

