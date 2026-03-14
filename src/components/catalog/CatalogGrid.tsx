// Сітка фільмів у каталозі

'use client'

import { TMDBMovie, TMDBGenre } from '@/lib/tmdb'
import { useState, useEffect } from 'react'
import MovieCard from '@/components/ui/MovieCard'
import { useSearchParams } from 'next/navigation'
import { getAllUserStatuses, MovieStatus } from '@/lib/userMovies'

interface Props {
  movies: TMDBMovie[] | undefined
  genres: TMDBGenre[]
  userId: string | null
}

const CatalogGrid: React.FC<Props> = ({ movies, genres, userId }) => {
  const searchParams = useSearchParams()
  const [allMovies, setAllMovies] = useState<TMDBMovie[]>(movies ?? [])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [statusesLoaded, setStatusesLoaded] = useState(false)
  const [userStatuses, setUserStatuses] = useState<
    Record<number, MovieStatus[]>
  >({})

  useEffect(() => {
    if (!userId) return
    getAllUserStatuses().then((data) => {
      setUserStatuses(data)
      setStatusesLoaded(true)
    })
  }, [userId])

  useEffect(() => {
    setAllMovies(movies ?? [])
    setPage(1)
  }, [movies, searchParams])

  async function loadMore() {
    setLoading(true)
    const nextPage = page + 1
    const genre = searchParams.get('genre') ?? ''
    const sort = searchParams.get('sort') ?? ''

    const params = new URLSearchParams({ page: String(nextPage) })
    if (genre) params.set('genreId', genre)
    if (sort) params.set('sort', sort)

    const res = await fetch(`/api/movies/popular?${params.toString()}`)
    const data = await res.json()

    setAllMovies((prev) => {
      const existingIds = new Set(prev.map((m) => m.id))
      const newMovies = data.results.filter(
        (m: TMDBMovie) => !existingIds.has(m.id)
      )
      return [...prev, ...newMovies]
    })

    setPage(nextPage)
    setLoading(false)
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {allMovies.map((movie) => (
          <MovieCard
            key={`${movie.id}-${statusesLoaded}`}
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            vote_average={movie.vote_average}
            release_date={movie.release_date}
            genre={genres.find((g) => g.id === movie.genre_ids[0])?.name}
            genre_ids={movie.genre_ids}
            userId={userId}
            initialStatuses={userStatuses[movie.id] ?? []}
          />
        ))}
      </div>

      <div className="flex justify-center pb-6">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-6 py-3 bg-surface-2 border border-white/10 text-text-2 text-sm font-semibold rounded-full hover:bg-surface-3 transition-colors disabled:opacity-50"
        >
          {loading ? 'Завантаження...' : 'Завантажити ще'}
        </button>
      </div>
    </div>
  )
}

export default CatalogGrid
