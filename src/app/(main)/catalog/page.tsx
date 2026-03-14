/**
 * Сторінка каталогу фільмів
 * Показує сітку фільмів з фільтрами та пошуком
 */

import { Suspense } from 'react'
import { getPopularMovies, getGenres, searchMovies } from '@/lib/tmdb'
import CatalogGrid from '@/components/catalog/CatalogGrid'
import CatalogFilters from '@/components/catalog/CatalogFilters'
import Spinner from '@/components/ui/Spinner'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  searchParams: Promise<{
    genre?: string
    sort?: string
    query?: string
  }>
}

async function CatalogContent({ searchParams }: PageProps) {
  const params = await searchParams
  const genres = await getGenres()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Якщо є пошуковий запит — шукаємо, інакше популярні
  const { results: movies } = params.query
    ? await searchMovies(params.query)
    : await getPopularMovies(1, params.genre ? Number(params.genre) : undefined)

  // Сортування на клієнті
  const sorted = [...movies].sort((a, b) => {
    if (params.sort === 'rating') return b.vote_average - a.vote_average
    if (params.sort === 'date')
      return b.release_date.localeCompare(a.release_date)
    return 0
  })

  // Фільтр по жанру
  const filtered = params.genre
    ? sorted.filter((m) => m.genre_ids.includes(Number(params.genre)))
    : sorted

  // Замість filtered передавай sorted:
  return (
    <CatalogGrid movies={sorted} genres={genres} userId={user?.id ?? null} />
  )
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const genres = await getGenres()
  return (
    <div className="min-h-screen">
      {/* Хедер */}
      <header className="px-5 pt-14 pb-3">
        <h1 className="text-2xl font-black text-text-1">Каталог</h1>
      </header>

      {/* Фільтри */}
      <Suspense fallback={<div className="h-20" />}>
        <CatalogFilters genres={genres} />
      </Suspense>

      {/* Suspense — показує Spinner поки CatalogContent завантажується */}
      <Suspense fallback={<Spinner />}>
        <CatalogContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
