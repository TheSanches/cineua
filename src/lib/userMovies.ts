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

// Коментарі
export interface MovieComment {
  id: string
  movie_id: number
  user_id: string
  user_name: string
  user_avatar: string | null
  text: string | null
  rating: number | null
  likes?: number // тепер розраховується окремо
  parent_id: string | null
  created_at: string
}

export async function getMovieComments(
  movieId: number
): Promise<MovieComment[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('movie_comments')
    .select('*, comment_likes(count)')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false })
  if (error) throw error

  return (data ?? []).map((c) => ({
    ...c,
    likes: c.comment_likes?.[0]?.count ?? 0,
  })) as MovieComment[]
}

export async function addComment(
  movieId: number,
  text: string,
  rating: number | null,
  parentId: string | null = null
): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Не авторизований')

  // Якщо є рейтинг і це не відповідь — перевіряємо чи вже є коментар з рейтингом
  if (rating && !parentId) {
    const { data: existing } = await supabase
      .from('movie_comments')
      .select('id')
      .eq('movie_id', movieId)
      .eq('user_id', user.id)
      .not('rating', 'is', null)
      .is('parent_id', null)
      .maybeSingle()

    if (existing) {
      // Оновлюємо рейтинг існуючого коментаря
      await supabase
        .from('movie_comments')
        .update({ rating, text: text || null })
        .eq('id', existing.id)
      return
    }
  }

  await supabase.from('movie_comments').insert({
    movie_id: movieId,
    user_id: user.id,
    user_name: user.user_metadata?.full_name ?? user.email,
    user_avatar: user.user_metadata?.avatar_url ?? null,
    text: text || null,
    rating,
    parent_id: parentId,
  })
}
export async function deleteComment(commentId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('movie_comments').delete().eq('id', commentId)
}

export async function toggleCommentLike(commentId: string): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (data) {
    await supabase.from('comment_likes').delete().eq('id', data.id)
    return false
  } else {
    await supabase
      .from('comment_likes')
      .insert({ comment_id: commentId, user_id: user.id })
    return true
  }
}

export async function getCommentLikes(
  commentId: string
): Promise<{ count: number; userLiked: boolean }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { count } = await supabase
    .from('comment_likes')
    .select('*', { count: 'exact', head: true })
    .eq('comment_id', commentId)

  if (!user) return { count: count ?? 0, userLiked: false }

  const { data } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .maybeSingle()

  return { count: count ?? 0, userLiked: !!data }
}

export async function getMovieUserRating(
  movieId: number
): Promise<number | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('movie_comments')
    .select('rating')
    .eq('movie_id', movieId)
    .not('rating', 'is', null)

  if (!data?.length) return null

  const avg = data.reduce((sum, c) => sum + (c.rating ?? 0), 0) / data.length
  const outOf10 = avg * 2 // переводимо з 5 в 10
  return Math.round(outOf10 * 10) / 10
}

export async function getMovieUserRatingCount(
  movieId: number
): Promise<number> {
  const supabase = createClient()
  const { count } = await supabase
    .from('movie_comments')
    .select('*', { count: 'exact', head: true })
    .eq('movie_id', movieId)
    .not('rating', 'is', null)
  return count ?? 0
}

// ===== RECOMMENDATIONS =====

export async function getMovieRecommendation(movieId: number) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('movie_recommendations')
    .select('*')
    .eq('user_id', user.id)
    .eq('movie_id', movieId)
    .maybeSingle() // ← було .single()

  return data
}

export async function addRecommendation(
  movieId: number,
  movieTitle: string,
  posterPath: string | null,
  comment: string
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const userName =
    user.user_metadata?.full_name || user.user_metadata?.name || 'Користувач'
  const userAvatar = user.user_metadata?.avatar_url || null

  const { data, error } = await supabase
    .from('movie_recommendations')
    .upsert(
      {
        user_id: user.id,
        movie_id: movieId,
        movie_title: movieTitle,
        poster_path: posterPath,
        comment: comment.trim() || '',
        user_name: userName,
        user_avatar: userAvatar,
      },
      { onConflict: 'user_id,movie_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeRecommendation(movieId: number) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('movie_recommendations')
    .delete()
    .eq('user_id', user.id)
    .eq('movie_id', movieId)
}

export async function getCommunityRecommendations() {
  const supabase = createClient()

  const { data } = await supabase
    .from('movie_recommendations')
    .select(
      'id, movie_id, movie_title, poster_path, comment, user_name, user_avatar, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(30)

  return data || []
}
