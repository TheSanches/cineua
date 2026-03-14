/**
 * Головна сторінка
 * Показує віджети: продовжити перегляд, AI рекомендації,
 * нові з УКР озвученням, статистика
 */

import { createClient } from '@/lib/supabase/server'
import PopularMovies from '@/components/home/PopularMovies'
import {
  getPopularMovies,
  getMovieRecommendations,
  TMDBMovie,
} from '@/lib/tmdb'
import Link from 'next/link'
import Image from 'next/image'
import Recommendations from '@/components/home/Recommendations'
import CommunityRecommendations from '@/components/home/CommunityRecommendations'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { results: movies } = await getPopularMovies()

  const { data: favorites } = user
    ? await supabase
        .from('user_movies')
        .select('movie_id')
        .eq('status', 'favorite')
        .limit(5)
    : { data: null }

  const watchedIds = new Set(
    user
      ? ((await supabase.from('user_movies').select('movie_id')).data?.map(
          (m) => m.movie_id
        ) ?? [])
      : []
  )

  let recommendations: TMDBMovie[] = []

  if (favorites?.length) {
    const results = await Promise.all(
      favorites.map((f) => getMovieRecommendations(f.movie_id))
    )
    const seen = new Set<number>()
    recommendations = results
      .flat()
      .filter((m) => {
        if (seen.has(m.id) || watchedIds.has(m.id)) return false
        seen.add(m.id)
        return true
      })
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20)
  }

  return (
    <div className="min-h-screen">
      {/* Хедер */}
      <header className="flex items-center justify-between px-5 pt-14 pb-3">
        <div className="text-2xl font-black tracking-tight text-text-1">
          <span className="text-accent-blue">Cine</span>
          <span className="text-accent-gold">UA</span>
        </div>
        <div className="flex gap-2 items-center">
          {/* Сповіщення */}
          <button className="w-10 h-10 bg-surface-1 border border-white/7 rounded-full flex items-center justify-center">
            🔔
          </button>
          {/* Аватар → перехід в профіль */}
          {user ? (
            <Link href="/profile">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Профіль"
                  width={40}
                  height={40}
                  className="rounded-full border border-white/10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-gold flex items-center justify-center font-bold text-sm">
                  {user.email?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <Link href="/login">
              <div className="w-10 h-10 rounded-full bg-surface-1 border border-white/10 flex items-center justify-center text-sm font-bold text-text-3">
                Увійти
              </div>
            </Link>
          )}
        </div>
      </header>

      {/* Привітання */}
      <div className="px-5 pb-5">
        <h1 className="text-xl font-black text-text-1">
          <span className="text-accent-blue">Привіт, </span>
          <span className="text-accent-gold">
            {user?.user_metadata?.full_name?.split(' ')[0] ?? 'друже'}
          </span>{' '}
          👋
        </h1>
        <p className="text-sm text-text-2 mt-1">Що дивимось сьогодні?</p>
      </div>

      {/* Placeholder для віджетів */}
      <div className="px-5 space-y-4">
        <PopularMovies movies={movies} />
        <Recommendations movies={recommendations} />
        <CommunityRecommendations />
        <div className="bg-surface-1 border border-white/7 rounded-2xl p-4 h-40 flex items-center justify-center">
          <p className="text-text-3 text-sm">🇺🇦 Нові з озвученням</p>
        </div>
      </div>
    </div>
  )
}
