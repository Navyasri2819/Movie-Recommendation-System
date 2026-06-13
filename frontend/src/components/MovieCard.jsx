export function MovieCard({ movie }) {
  return (
    <article className="group relative min-w-[220px] max-w-[220px] snap-start overflow-hidden rounded-2xl bg-zinc-950 shadow-poster transition duration-300 hover:z-20 hover:-translate-y-3 hover:scale-105">
      <img
        src={movie.posterUrl}
        alt={`${movie.title} poster`}
        className="h-[330px] w-full object-cover transition duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-20">
        <h3 className="line-clamp-2 text-lg font-extrabold leading-tight">{movie.title}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-netflix">{movie.year || 'Classic'}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {movie.genres.slice(0, 3).map((genre) => (
            <span key={genre} className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-zinc-200">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

