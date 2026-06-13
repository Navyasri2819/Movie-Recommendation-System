import { MovieCard } from './MovieCard.jsx';

export function RecommendationRow({ movies, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex gap-5 overflow-hidden pb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-[360px] min-w-[220px] animate-pulse rounded-2xl bg-zinc-900" />
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-zinc-300">
        Your recommendations will appear here in a horizontal Netflix-style row.
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex snap-x gap-5 overflow-x-auto pb-8 pt-3">
      {movies.map((movie) => (
        <MovieCard key={movie.movieId} movie={movie} />
      ))}
    </div>
  );
}

