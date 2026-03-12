/**
 * Функції для роботи з списками фільмів користувача
 * watchlist — хочу подивитись
 * watched — переглянуто
 * favorite — улюблене
 */

import { createClient } from '@/lib/supabase/client'

export type MovieStatus = 'watchlist' | 'watched' | 'favorite'

export interface UserMovie {
  id: string
  user_id: string
  movie_id: number
  movie_title: string
  poster_path: string | null
  status: MovieStatus
  created_at: string
  vote_average: number | null
  release_date: string | null
  genre_ids: number[] | null
}

// Додати фільм до списку
export async function addMovie(
  movieId: number,
  movieTitle: string,
  posterPath: string | null,
  status: MovieStatus,
  voteAverage?: number,
  releaseDate?: string,
  genreIds?: number[]
): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Не авторизований')

  const { error } = await supabase.from('user_movies').upsert({
    user_id: user.id,
    movie_id: movieId,
    movie_title: movieTitle,
    poster_path: posterPath,
    status,
    vote_average: voteAverage,
    release_date: releaseDate,
    genre_ids: genreIds,
  })
  if (error) throw error
}

// Видалити фільм зі списку
export async function removeMovie(
  movieId: number,
  status: MovieStatus
): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Не авторизований')

  const { error } = await supabase
    .from('user_movies')
    .delete()
    .eq('movie_id', movieId)
    .eq('status', status)
    .eq('user_id', user.id)
  if (error) throw error
}

// Отримати статуси фільму для поточного користувача
export async function getMovieStatuses(
  movieId: number
): Promise<MovieStatus[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_movies')
    .select('status')
    .eq('movie_id', movieId)

  if (error) throw error
  return (data ?? []).map((r) => r.status as MovieStatus)
}

// Отримати всі фільми користувача по статусу
export async function getMoviesByStatus(
  status: MovieStatus
): Promise<UserMovie[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_movies')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as UserMovie[]
}

// UA озвучення — голосування
export async function getUaVotesCount(movieId: number): Promise<number> {
  const supabase = createClient()
  const { count } = await supabase
    .from('movie_ua_votes')
    .select('*', { count: 'exact', head: true })
    .eq('movie_id', movieId)
  return count ?? 0
}

export async function getUaVote(movieId: number): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase
    .from('movie_ua_votes')
    .select('id')
    .eq('movie_id', movieId)
    .eq('user_id', user.id)
    .maybeSingle()
  return !!data
}

export async function addUaVote(movieId: number): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('movie_ua_votes')
    .insert({ movie_id: movieId, user_id: user.id })
}

export async function removeUaVote(movieId: number): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('movie_ua_votes')
    .delete()
    .eq('movie_id', movieId)
    .eq('user_id', user.id)
}
