/**
 * Сторінка списків користувача
 * Watchlist, Переглянуто, Улюблені
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WatchlistTabs from '@/components/watchlist/WatchlistTabs'
import { getGenres } from '@/lib/tmdb'

export default async function WatchlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: movies }, genres] = await Promise.all([
    supabase
      .from('user_movies')
      .select('*')
      .order('created_at', { ascending: false }),
    getGenres(),
  ])

  return (
    <div className="min-h-screen">
      <header className="px-5 pt-14 pb-3">
        <h1 className="text-2xl font-black text-text-1">Мої фільми</h1>
      </header>
      <WatchlistTabs movies={movies ?? []} genres={genres} />
    </div>
  )
}
