/**
 * Картка фільму
 * Динамічна сторінка — /movie/123
 * Показує деталі, рейтинг, акторів, схожі фільми
 */

import { getMovieDetails, getMovieCredits, getSimilarMovies } from '@/lib/tmdb'
import BackButton from '@/components/ui/BackButton'
import MovieCast from '@/components/movie/MovieCast'
import SimilarMovies from '@/components/movie/SimilarMovies'
import MovieActions from '@/components/movie/MovieActions'
import Link from 'next/link'

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
  const director = credits.crew.find((c) => c.job === 'Director') // режисер
  const writer = credits.crew.find(
    // сценарист
    (c) => c.job === 'Screenplay' || c.job === 'Writer'
  )
  const producer = credits.crew.find((c) => c.job === 'Producer')

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

        {/* Режисер / Сценарист / Продюсер */}
        {(director || writer || producer) && (
          <div className="flex flex-col gap-2 mt-4">
            {director && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-3 w-24 flex-shrink-0">
                  Режисер
                </span>
                <Link
                  href={`/person/${director.id}`}
                  className="text-[13px] font-semibold text-accent-purple"
                >
                  {director.name}
                </Link>
              </div>
            )}
            {writer && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-3 w-24 flex-shrink-0">
                  Сценарист
                </span>
                <Link
                  href={`/person/${writer.id}`}
                  className="text-[13px] font-semibold text-accent-purple"
                >
                  {writer.name}
                </Link>
              </div>
            )}
            {producer && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-3 w-24 flex-shrink-0">
                  Продюсер
                </span>
                <Link
                  href={`/person/${producer.id}`}
                  className="text-[13px] font-semibold text-accent-purple"
                >
                  {producer.name}
                </Link>
              </div>
            )}
          </div>
        )}

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
        <MovieActions
          movieId={movie.id}
          movieTitle={movie.title}
          posterPath={movie.poster_path}
          voteAverage={movie.vote_average}
          releaseDate={movie.release_date}
          genreIds={movie.genres.map((g) => g.id)}
        />
      </div>
    </div>
  )
}
