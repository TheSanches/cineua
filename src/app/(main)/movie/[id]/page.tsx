/**
 * Картка фільму
 * Динамічна сторінка — /movie/123
 * Показує деталі, рейтинг, акторів, схожі фільми
 */

import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getMovieVideos,
  getMovieImages,
} from '@/lib/tmdb'
import BackButton from '@/components/ui/BackButton'
import MovieCast from '@/components/movie/MovieCast'
import SimilarMovies from '@/components/movie/SimilarMovies'
import MovieActions from '@/components/movie/MovieActions'
import Link from 'next/link'
import UaVoteButton from '@/components/movie/UaVoteButton'
import MovieComments from '@/components/movie/MovieComments'
import {
  getUaVotesCount,
  getUaVote,
  getMovieComments,
  getMovieUserRating,
  getMovieUserRatingCount,
} from '@/lib/userMovies'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import MovieTrailer from '@/components/movie/MovieTrailer'
import MovieImages from '@/components/movie/MovieImages'
import RecommendButton from '@/components/movie/RecommendButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [
    movie,
    credits,
    similar,
    votesCount,
    userVoted,
    comments,
    userRating,
    userRatingCount,
    videos,
    images,
  ] = await Promise.all([
    getMovieDetails(Number(id)), // деталі фільму
    getMovieCredits(Number(id)), // актори та команда
    getSimilarMovies(Number(id)), // схожі фільми
    getUaVotesCount(Number(id)), // кількість голосів за українське озвучення
    getUaVote(Number(id)), // чи голосував поточний користувач
    getMovieComments(Number(id)), // коментарі до фільму
    getMovieUserRating(Number(id)), // рейтинг користувача для цього фільму
    getMovieUserRatingCount(Number(id)), // кількість рейтингів користувачів для цього фільму
    getMovieVideos(Number(id)), // відео (трейлери)
    getMovieImages(Number(id)), // зображення (постери, бекдропи)
  ])

  const trailer = videos[0] // перший трейлер

  const cast = credits.cast.slice(0, 10) // перші 10 акторів
  const similarMovies = similar.results.slice(0, 10) // перші 10 схожих фільмів
  const director = credits.crew.find((c) => c.job === 'Director') // режисер
  const writer = credits.crew.find(
    // сценарист
    (c) => c.job === 'Screenplay' || c.job === 'Writer'
  )
  const producer = credits.crew.find((c) => c.job === 'Producer')
  console.log('images:', images.length, images[0])
  return (
    <div className="min-h-screen">
      {/* Кнопка назад */}
      <BackButton />

      {/* Backdrop */}
      <div className="relative h-72">
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-bg" />
      </div>

      {/* Постер + інфо */}
      <div className="px-5 -mt-16 relative">
        <div className="flex gap-4">
          <div className="relative w-24 h-36 rounded-xl overflow-hidden shadow-xl flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
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
        <div className="flex gap-3 mt-5">
          <div className="flex-1 bg-surface-1 border border-white/7 rounded-xl p-2 text-center">
            <div className="text-xl font-black text-accent-gold">
              {movie.vote_average.toFixed(1)}
            </div>
            <div className="text-[10px] text-text-3 mt-0.5">
              TMDB{' '}
              <span className="text-[10px] text-accent-blue mt-0.5">
                {movie.vote_count.toLocaleString()}
              </span>{' '}
              Голосів
            </div>
          </div>

          {userRating && (
            <div className="flex-1 bg-surface-1 border border-accent-purple/30 rounded-xl p-2 text-center">
              <div className="text-xl font-black text-accent-purple">
                ⭐ {userRating.toFixed(1)}
              </div>
              <div className="text-[10px] text-text-3 mt-0.5">
                CineUA{' '}
                <span className="text-[10px] text-accent-blue mt-0.5">
                  {userRatingCount}
                </span>{' '}
                відгуків
              </div>
            </div>
          )}
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
        {/* Трейлер */}
        {trailer && <MovieTrailer trailer={trailer} />}

        {/* Кадри */}
        <MovieImages images={images} />
        {/* Схожі фільми */}
        <SimilarMovies movies={similarMovies} />
        {/* УКР краудсорсинг */}
        <UaVoteButton
          movieId={movie.id}
          initialVoted={userVoted}
          initialCount={votesCount}
          userId={user?.id ?? null}
        />
        {/* Дії */}
        <MovieActions
          movieId={movie.id}
          movieTitle={movie.title}
          posterPath={movie.poster_path}
          voteAverage={movie.vote_average}
          releaseDate={movie.release_date}
          genreIds={movie.genres.map((g) => g.id)}
          userId={user?.id ?? null}
        />
        {/* Рекомендувати */}
        <RecommendButton
          movieId={movie.id}
          movieTitle={movie.title}
          posterPath={movie.poster_path}
          user={user}
        />
        <MovieComments
          movieId={movie.id}
          initialComments={comments}
          currentUserId={user?.id ?? null}
        />
      </div>
    </div>
  )
}
