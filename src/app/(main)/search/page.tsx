/**
 * Сторінка пошуку
 * Поле вводу з результатами, популярні жанри, історія пошуку
 */

import { Suspense } from 'react'
import SearchContent from '@/components/search/SearchContent'
import { getGenres } from '@/lib/tmdb'

export default async function SearchPage() {
  const genres = await getGenres()

  return (
    <div className="min-h-screen">
      <header className="px-5 pt-14 pb-3">
        <h1 className="text-2xl font-black text-text-1">Пошук</h1>
      </header>
      <Suspense fallback={null}>
        <SearchContent genres={genres} />
      </Suspense>
    </div>
  )
}
