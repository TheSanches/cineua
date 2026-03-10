'use client'

import { useState } from 'react'
import { TMDBMovie } from '@/lib/tmdb'
import { Clapperboard } from 'lucide-react'
import MovieSlider from '@/components/ui/MovieSlider'

type Filter = 'all' | 'ua'

interface Props {
  movies: TMDBMovie[] | undefined
}

export default function PopularMovies({ movies }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  if (!movies?.length) return null

  return (
    <div className="bg-surface-1 border border-white/7 rounded-2xl overflow-hidden">
      {/* Заголовок з фільтром */}
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clapperboard size={16} className="text-accent-blue" />
          <h2 className="text-base font-black text-accent-gold">Популярні</h2>
        </div>
        <div className="flex gap-2">
          <div
            onClick={() => setFilter('all')}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-accent-gold text-text-5'
                : 'text-text-3 hover:text-text-2'
            }`}
          >
            Всі
          </div>
          <div
            onClick={() => setFilter('ua')}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
              filter === 'ua'
                ? 'bg-ua text-text-5'
                : 'text-text-3 hover:text-text-2'
            }`}
          >
            🇺🇦 УКР
          </div>
        </div>
      </div>

      {/* Слайдер */}
      <MovieSlider movies={movies} title="" />
    </div>
  )
}
