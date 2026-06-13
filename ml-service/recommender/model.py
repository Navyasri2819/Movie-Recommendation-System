import re
from dataclasses import dataclass
from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class MovieRecommender:
    movies: pd.DataFrame
    similarity_matrix: object

    @classmethod
    def from_csv(cls, csv_path: str):
        path = Path(csv_path)

        if not path.exists():
            raise FileNotFoundError(f"MovieLens dataset not found at {path.resolve()}")

        movies = pd.read_csv(path)
        required_columns = {"movieId", "title", "genres"}
        missing_columns = required_columns.difference(movies.columns)

        if missing_columns:
            raise ValueError(f"Dataset missing required columns: {sorted(missing_columns)}")

        movies = movies.copy()
        movies["display_title"] = movies["title"].map(format_display_title)
        movies["clean_title"] = movies["display_title"].map(normalize_title)
        movies["year"] = movies["title"].map(extract_year)
        movies["raw_clean_title"] = movies["title"].map(normalize_title)

        # MovieLens genres are pipe-delimited, so spaces make them useful TF-IDF tokens.
        genre_corpus = movies["genres"].fillna("").str.replace("|", " ", regex=False)
        tfidf_matrix = TfidfVectorizer(stop_words="english").fit_transform(genre_corpus)
        similarity_matrix = cosine_similarity(tfidf_matrix)

        return cls(movies=movies, similarity_matrix=similarity_matrix)

    def recommend(self, query: str, top_n: int = 5):
        match_index = self._find_movie_index(query)

        if match_index is None:
            return None

        scores = list(enumerate(self.similarity_matrix[match_index]))
        ranked = sorted(scores, key=lambda item: item[1], reverse=True)
        ranked = [item for item in ranked if item[0] != match_index][:top_n]

        matched_movie = self.movies.iloc[match_index]
        recommendations = [
            self._serialize_movie(index, score)
            for index, score in ranked
        ]

        return {
            "query": query,
            "matchedMovie": self._serialize_movie(match_index, 1.0),
            "recommendations": recommendations,
        }

    def suggest_titles(self, query: str, limit: int = 5):
        normalized_query = normalize_title(query)
        suggestions = self.movies[
            self.movies["clean_title"].str.contains(normalized_query, na=False)
        ].head(limit)

        return suggestions["display_title"].tolist()

    def _find_movie_index(self, query: str):
        normalized_query = normalize_title(query)
        exact_matches = self.movies.index[self.movies["clean_title"] == normalized_query].tolist()

        if exact_matches:
            return exact_matches[0]

        partial_matches = self.movies.index[
            self.movies["clean_title"].str.contains(normalized_query, na=False)
            | self.movies["raw_clean_title"].str.contains(normalized_query, na=False)
        ].tolist()

        return partial_matches[0] if partial_matches else None

    def _serialize_movie(self, index: int, score: float):
        row = self.movies.iloc[index]

        return {
            "movieId": int(row["movieId"]),
            "title": row["display_title"],
            "rawTitle": row["title"],
            "year": None if pd.isna(row["year"]) else int(row["year"]),
            "genres": row["genres"].split("|") if isinstance(row["genres"], str) else [],
            "similarity": round(float(score), 4),
        }


def normalize_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()


def extract_year(title: str):
    match = re.search(r"\((\d{4})\)\s*$", title)
    return int(match.group(1)) if match else None


def format_display_title(title: str) -> str:
    title_without_year = re.sub(r"\s+\(\d{4}\)$", "", title)
    article_match = re.match(r"^(.*),\s+(The|A|An)$", title_without_year)

    if article_match:
        return f"{article_match.group(2)} {article_match.group(1)}"

    return title_without_year
