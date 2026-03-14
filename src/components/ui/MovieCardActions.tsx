'use client'

import { useState } from 'react'
import { Bookmark, Eye, Heart } from 'lucide-react'
import { addMovie, removeMovie, MovieStatus } from '@/lib/userMovies'

interface Props {
  movieId: number
  movieTitle: string
  posterPath: string | null
  voteAverage?: number
  releaseDate?: string
  genreIds?: number[]
  userId: string | null
  initialStatuses?: MovieStatus[]
}

const ACTIONS = [
  { status: 'favorite' as MovieStatus, icon: Heart, label: 'Люблю' },
  { status: 'watched' as MovieStatus, icon: Eye, label: 'Бачив' },
  { status: 'watchlist' as MovieStatus, icon: Bookmark, label: 'Хочу' },
]

export default function MovieCardActions({
  movieId,
  movieTitle,
  posterPath,
  voteAverage,
  releaseDate,
  genreIds,
  userId,
  initialStatuses = [],
}: Props) {
  const [activeStatuses, setActiveStatuses] =
    useState<MovieStatus[]>(initialStatuses)
  const [loading, setLoading] = useState<MovieStatus | null>(null)

  async function toggle(e: React.MouseEvent, status: MovieStatus) {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      window.location.href = '/login'
      return
    }

    setLoading(status)
    try {
      if (activeStatuses.includes(status)) {
        await removeMovie(movieId, status)
        setActiveStatuses((prev) => prev.filter((s) => s !== status))
      } else {
        await addMovie(
          movieId,
          movieTitle,
          posterPath,
          status,
          voteAverage,
          releaseDate,
          genreIds
        )
        setActiveStatuses((prev) => [...prev, status])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-1 mt-2 justify-center">
      {ACTIONS.map(({ status, icon: Icon, label }) => {
        const isActive = activeStatuses.includes(status)
        const isLoading = loading === status

        const activeColor =
          status === 'favorite'
            ? 'text-red-400 border-red-400/40 bg-red-400/10'
            : status === 'watched'
              ? 'text-amber-400 border-amber-400/40 bg-amber-400/10'
              : 'text-violet-400 border-violet-400/40 bg-violet-400/10'

        return (
          <button
            key={status}
            onClick={(e) => toggle(e, status)}
            disabled={!!isLoading}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-xl border transition-all
              ${isActive ? activeColor : 'text-text-3 border-white/7 bg-white/5'}`}
          >
            <Icon size={14} className={isActive ? 'fill-current' : ''} />
            <span className="text-[9px] font-bold">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
