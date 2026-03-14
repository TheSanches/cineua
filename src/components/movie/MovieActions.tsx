// Компонент з кнопками для додавання фільму до різних списків (хочу, бачив, люблю)

'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Eye, Heart } from 'lucide-react'
import {
  addMovie,
  removeMovie,
  getMovieStatuses,
  MovieStatus,
} from '@/lib/userMovies'

interface Props {
  movieId: number
  movieTitle: string
  posterPath: string | null
  voteAverage?: number
  releaseDate?: string
  genreIds?: number[]
  userId?: string | null
}

interface ActionButton {
  status: MovieStatus
  icon: React.ReactNode
  label: string
  activeColor: string
}

const ACTIONS: ActionButton[] = [
  {
    status: 'watchlist',
    icon: <Bookmark size={18} />,
    label: 'Хочу',
    activeColor: 'text-accent-purple',
  },
  {
    status: 'watched',
    icon: <Eye size={18} />,
    label: 'Бачив',
    activeColor: 'text-accent-gold',
  },
  {
    status: 'favorite',
    icon: <Heart size={18} />,
    label: 'Люблю',
    activeColor: 'text-danger',
  },
]

export default function MovieActions({
  movieId,
  movieTitle,
  posterPath,
  voteAverage,
  releaseDate,
  genreIds,
  userId,
}: Props) {
  const [activeStatuses, setActiveStatuses] = useState<MovieStatus[]>([])
  const [loading, setLoading] = useState<MovieStatus | null>(null)

  useEffect(() => {
    getMovieStatuses(movieId)
      .then(setActiveStatuses)
      .catch(() => {})
  }, [movieId])

  async function toggle(status: MovieStatus) {
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
    <div className="flex gap-3 mt-5">
      {/* Де дивитись */}
      <button className="flex-1 py-3 bg-accent-gold text-black font-black text-sm rounded-2xl">
        Де дивитись
      </button>

      {/* Дії */}
      {ACTIONS.map((action) => {
        const isActive = activeStatuses.includes(action.status)
        const isLoading = loading === action.status

        return (
          <button
            key={action.status}
            onClick={() => toggle(action.status)}
            disabled={isLoading}
            className={`w-12 h-12 bg-surface-2 border rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all ${
              isActive
                ? `border-current ${action.activeColor}`
                : 'border-white/7 text-text-3'
            }`}
          >
            {action.icon}
            <span className="text-[8px] font-bold">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}
