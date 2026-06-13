import { useState } from 'react';
import { Film, Loader2, Search } from 'lucide-react';
import { RecommendationRow } from './components/RecommendationRow.jsx';
import { fetchRecommendations } from './services/api.js';

const starterMovies = ['Toy Story', 'Heat', 'The Matrix', 'Inception', 'Interstellar'];

export default function App() {
  const [query, setQuery] = useState('Toy Story');
  const [matchedMovie, setMatchedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const movie = query.trim();

    if (!movie) {
      setError('Enter a movie title to start discovering similar films.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchRecommendations(movie);
      setMatchedMovie(data.matchedMovie);
      setRecommendations(data.recommendations);
    } catch (requestError) {
      setRecommendations([]);
      setMatchedMovie(null);
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-coal text-white">
      <section className="relative isolate min-h-screen px-5 py-6 sm:px-10 lg:px-16">
        <div className="hero-glow" />
        <nav className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded bg-netflix shadow-lg shadow-red-950/40">
              <Film size={25} strokeWidth={2.5} />
            </div>
            <span className="font-display text-4xl tracking-wide text-netflix">CineMatch</span>
          </div>
          <span className="hidden rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-smoke sm:block">
            Genre AI
          </span>
        </nav>

        <div className="relative z-10 mx-auto mt-20 max-w-5xl text-center sm:mt-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.45em] text-netflix">
            MovieLens x TF-IDF
          </p>
          <h1 className="font-display text-6xl leading-none tracking-wide sm:text-8xl lg:text-9xl">
            Find Your Next Obsession
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Search a movie and get five genre-similar recommendations, enriched with cinematic poster cards.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-black/55 p-3 shadow-2xl shadow-black/50 backdrop-blur sm:flex-row"
          >
            <label className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={21} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for a movie..."
                className="h-14 w-full rounded-xl border border-white/10 bg-zinc-950/80 pl-12 pr-4 text-base text-white outline-none transition focus:border-netflix focus:ring-4 focus:ring-red-950/50"
              />
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-netflix px-8 font-bold uppercase tracking-wide text-white transition hover:scale-[1.02] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : null}
              Recommend
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {starterMovies.map((movie) => (
              <button
                key={movie}
                onClick={() => setQuery(movie)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:border-netflix hover:text-white"
              >
                {movie}
              </button>
            ))}
          </div>
        </div>

        <section className="relative z-10 mt-16">
          {error ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/30 bg-red-950/30 p-5 text-center text-red-100">
              {error}
            </div>
          ) : null}

          {matchedMovie ? (
            <div className="mb-7 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-smoke">Because you searched</p>
              <h2 className="mt-2 font-display text-5xl tracking-wide">{matchedMovie.title}</h2>
            </div>
          ) : null}

          <RecommendationRow movies={recommendations} isLoading={isLoading} />
        </section>
      </section>
    </main>
  );
}

