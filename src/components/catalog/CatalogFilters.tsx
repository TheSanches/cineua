'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { TMDBGenre } from '@/lib/tmdb'

interface Props {
  genres: TMDBGenre[]
}

const SORT_OPTIONS = [
  { value: '', label: 'Популярні' },
  { value: 'rating', label: 'Рейтинг' },
  { value: 'date', label: 'Новинки' },
]

export default function CatalogFilters({ genres }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showAllGenres, setShowAllGenres] = useState(false)

  const currentGenre = searchParams.get('genre') ?? ''
  const currentSort = searchParams.get('sort') ?? ''
  const currentQuery = searchParams.get('query') ?? ''

  const [searchValue, setSearchValue] = useState(currentQuery)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParam('query', searchValue)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3 pb-3">
      {/* Пошук */}
      <div className="mx-5 bg-surface-1 border border-white/7 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Search size={18} className="text-text-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Пошук фільмів..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="bg-transparent text-text-1 text-sm placeholder:text-text-3 outline-none w-full"
        />
      </div>

      {/* Жанри */}
      <div className="flex flex-col gap-2 px-5">
        <div
          className={`flex gap-2 flex-wrap overflow-hidden transition-all duration-300 ${
            showAllGenres ? 'max-h-96' : 'max-h-8'
          }`}
        >
          <button
            onClick={() => updateParam('genre', '')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              !currentGenre
                ? 'bg-accent-purple text-white'
                : 'bg-surface-1 text-text-3 border border-white/7'
            }`}
          >
            Всі
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() =>
                updateParam(
                  'genre',
                  currentGenre === String(genre.id) ? '' : String(genre.id)
                )
              }
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                currentGenre === String(genre.id)
                  ? 'bg-accent-purple text-white'
                  : 'bg-surface-1 text-text-3 border border-white/7'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAllGenres((prev) => !prev)}
          className="flex items-center gap-1 text-xs text-accent-purple font-semibold cursor-pointer self-start py-2"
        >
          {showAllGenres ? (
            <>
              <ChevronUp size={14} /> Згорнути
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Всі жанри
            </>
          )}
        </button>
      </div>

      {/* Сортування */}
      <div className="flex gap-2 px-5">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => updateParam('sort', option.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              currentSort === option.value
                ? 'bg-accent-gold text-black'
                : 'bg-surface-1 text-text-3 border border-white/7'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
