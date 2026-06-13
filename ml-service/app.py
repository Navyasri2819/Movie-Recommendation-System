import csv
import math
from collections import Counter
from pathlib import Path

from flask import Flask, jsonify, make_response
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins=["http://localhost:5000", "http://localhost:5173"])
class MovieRecommender:
    def __init__(self, movies):
        self.movies = movies

    @classmethod
    def from_csv(cls, dataset_path, fallback_path):
        import csv
        from pathlib import Path

        dataset_path = Path(dataset_path)
        fallback_path = Path(fallback_path)

        csv_path = dataset_path if dataset_path.exists() else fallback_path

        movies = []
        with open(csv_path, newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                movies.append(
                    {
                        "movieId": int(row["movieId"]),
                        "title": row["title"],
                        "genres": row["genres"],
                        "title_normalized": row["title"].lower().strip(),
                    }
                )

        return cls(movies)

    def recommend(self, movie_query, limit=5):
        query = movie_query.lower().strip()

        matches = [
            movie
            for movie in self.movies
            if query in movie["title_normalized"]
        ]

        if not matches:
            return [
                {
                    "movieId": movie["movieId"],
                    "title": movie["title"],
                    "genres": movie["genres"],
                    "score": 0,
                }
                for movie in self.movies[:limit]
            ]

        selected = matches[0]
        selected_genres = set(selected["genres"].lower().split("|"))

        scored_movies = []
        for movie in self.movies:
            if movie["movieId"] == selected["movieId"]:
                continue

            movie_genres = set(movie["genres"].lower().split("|"))
            score = len(selected_genres.intersection(movie_genres))

            scored_movies.append((score, movie))

        scored_movies.sort(reverse=True, key=lambda item: item[0])

        return [
            {
                "movieId": movie["movieId"],
                "title": movie["title"],
                "genres": movie["genres"],
                "score": score,
            }
            for score, movie in scored_movies[:limit]
        ]

recommender = MovieRecommender.from_csv(
    dataset_path="data/movies.csv",
    fallback_path="data/sample_movies.csv",
)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "ml-service"})


@app.get("/recommend/<path:movie>")
def recommend(movie):
    recommendations = recommender.recommend(movie, limit=5)
    return jsonify({"query": movie, "recommendations": recommendations})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)


