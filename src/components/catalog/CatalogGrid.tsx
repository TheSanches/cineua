'use client'

import { TMDBMovie, TMDBGenre, getPosterUrl } from '@/lib/tmdb'
import { useState, useEffect } from 'react'

interface Props {
  movies: TMDBMovie[] | undefined
  genres: TMDBGenre[]
}

const CatalogGrid: React.FC<Props> = ({ movies, genres }) => {
  const [allMovies, setAllMovies] = useState<TMDBMovie[]>(movies ?? [])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAllMovies(movies ?? [])
    setPage(1)
  }, [movies])

  async function loadMore() {
    setLoading(true)
    const nextPage = page + 1
    const res = await fetch(`/api/movies/popular?page=${nextPage}`)
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
          <div
            key={movie.id}
            className="bg-surface-2 rounded-lg overflow-hidden shadow-lg flex flex-col"
          >
            <div className="overflow-hidden h-64 relative">
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-accent-gold text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
            </div>
            <div className="p-3 flex flex-col flex-1 justify-between min-h-[80px]">
              <h3 className="text-sm font-bold text-text-1 line-clamp-2 leading-tight text-center">
                {movie.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-text-3 text-[10px]">
                  {movie.release_date?.slice(0, 4)}
                </p>
                <p className="text-text-3 text-[10px]">
                  {genres.find((g) => g.id === movie.genre_ids[0])?.name}
                </p>
              </div>
            </div>
          </div>
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
