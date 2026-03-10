// Компонент з табами для різних статусів фільмів (хочу, бачив, люблю)

'use client'

import { useState } from 'react'
import { UserMovie } from '@/lib/userMovies'
import MovieCard from '@/components/ui/MovieCard'
import { Bookmark, Eye, Heart } from 'lucide-react'
import { TMDBGenre } from '@/lib/tmdb'

interface Props {
  movies: UserMovie[]
  genres: TMDBGenre[]
}

const TABS = [
  { status: 'watchlist' as const, label: 'Хочу', icon: <Bookmark size={14} /> },
  { status: 'watched' as const, label: 'Бачив', icon: <Eye size={14} /> },
  { status: 'favorite' as const, label: 'Люблю', icon: <Heart size={14} /> },
]

export default function WatchlistTabs({ movies, genres }: Props) {
  const [activeTab, setActiveTab] = useState<
    'watchlist' | 'watched' | 'favorite'
  >('watchlist')

  const filtered = movies.filter((m) => m.status === activeTab)

  return (
    <div>
      {/* Таби */}
      <div className="flex gap-2 px-5 mb-5">
        {TABS.map((tab) => {
          const count = movies.filter((m) => m.status === tab.status).length
          return (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab.status
                  ? 'bg-accent-purple text-white'
                  : 'bg-surface-1 text-text-3 border border-white/7'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.status ? 'bg-white/20' : 'bg-surface-2'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Картки */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-5">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-text-2 font-semibold">Список порожній</p>
          <p className="text-text-3 text-sm mt-1">Додавай фільми з каталогу</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-5">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.movie_id}
              title={movie.movie_title}
              poster_path={movie.poster_path}
              vote_average={movie.vote_average ?? undefined}
              release_date={movie.release_date ?? undefined}
              genre={genres.find((g) => movie.genre_ids?.includes(g.id))?.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}
