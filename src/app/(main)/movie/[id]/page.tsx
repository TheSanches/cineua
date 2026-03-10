/**
 * Картка фільму
 * Динамічна сторінка — /movie/123
 * Показує деталі, рейтинг, акторів, схожі фільми
 */

import { getMovieDetails, getMovieCredits, getSimilarMovies } from '@/lib/tmdb'
import BackButton from '@/components/ui/BackButton'
import MovieCast from '@/components/movie/MovieCast'
import SimilarMovies from '@/components/movie/SimilarMovies'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params

  const [movie, credits, similar] = await Promise.all([
    getMovieDetails(Number(id)), // деталі фільму
    getMovieCredits(Number(id)), // акторський склад
    getSimilarMovies(Number(id)), // схожі фільми
  ])

  const cast = credits.cast.slice(0, 10) // перші 10 акторів
  const similarMovies = similar.results.slice(0, 10) // перші 10 схожих фільмів

  return (
    <div className="min-h-screen">
      {/* Кнопка назад */}
      <BackButton />

      {/* Backdrop */}
      <div className="relative h-72">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: movie.backdrop_path
              ? `url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`
              : undefined,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-bg" />
      </div>

      {/* Постер + інфо */}
      <div className="px-5 -mt-16 relative">
        <div className="flex gap-4">
          <img
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title}
            className="w-24 h-36 rounded-xl object-cover shadow-xl flex-shrink-0"
          />
          <div className="pt-10 flex flex-col gap-1">
            <h1 className="text-lg font-black text-text-1 leading-tight">
              {movie.title}
            </h1>
            <p className="text-xs text-text-3">{movie.original_title}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className="text-[10px] bg-surface-2 text-text-2 px-2 py-0.5 rounded-md">
                {movie.release_date?.slice(0, 4)}
              </span>
              {movie.runtime && (
                <span className="text-[10px] bg-surface-2 text-text-2 px-2 py-0.5 rounded-md">
                  {movie.runtime} хв
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Рейтинг */}
        <div className="flex gap-6 mt-5">
          <div>
            <div className="text-xl font-black text-accent-gold">
              {movie.vote_average.toFixed(1)}
            </div>
            <div className="text-[10px] text-text-3">TMDB</div>
          </div>
          <div>
            <div className="text-xl font-black text-text-1">
              {movie.vote_count.toLocaleString()}
            </div>
            <div className="text-[10px] text-text-3">Голосів</div>
          </div>
        </div>

        {/* Жанри */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="text-[11px] bg-accent-purple/15 text-accent-purple border border-accent-purple/30 px-2.5 py-1 rounded-lg font-semibold"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Опис */}
        <p className="text-sm text-text-2 leading-relaxed mt-4">
          {movie.overview || 'Опис відсутній'}
        </p>

        {/* Актори */}
        <MovieCast cast={cast} />

        {/* Схожі фільми */}
        <SimilarMovies movies={similarMovies} />

        {/* УКР краудсорсинг */}
        <div className="mt-5 bg-ua/6 border border-ua/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">🇺🇦</span>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-ua">
              Є українське озвучення?
            </h4>
            <p className="text-[11px] text-text-3 mt-0.5">
              Допоможи іншим глядачам
            </p>
          </div>
          <button className="px-4 py-2 bg-ua text-black text-xs font-black rounded-xl">
            Так
          </button>
        </div>

        {/* Дії */}
        <div className="flex gap-3 mt-5">
          <button className="flex-1 py-3 bg-accent-gold text-black font-black text-sm rounded-2xl">
            Де дивитись
          </button>
          <button className="w-12 h-12 bg-surface-2 border border-white/7 rounded-2xl flex items-center justify-center">
            <span className="text-lg">🔖</span>
          </button>
        </div>
      </div>
    </div>
  )
}
