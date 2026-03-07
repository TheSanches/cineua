/**
 * Сторінка каталогу фільмів
 * Показує сітку фільмів з фільтрами та пошуком
 */

import { getPopularMovies, getGenres } from '@/lib/tmdb'
import CatalogFilters from '@/components/catalog/CatalogFilters'
import CatalogGrid from '@/components/catalog/CatalogGrid'

export default async function CatalogPage() {
  const [{ results: movies }, genres] = await Promise.all([
    getPopularMovies(),
    getGenres(),
  ])

  return (
    <div className="min-h-screen">
      {/* Хедер */}
      <header className="px-5 pt-14 pb-3">
        <h1 className="text-2xl font-black text-text-1">Каталог</h1>
      </header>

      {/* Фільтри */}
      <CatalogFilters />

      {/* Сітка фільмів */}
      <CatalogGrid movies={movies} genres={genres} />
    </div>
  )
}
