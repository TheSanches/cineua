'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { TMDBGenre, TMDBMovie, searchMovies } from '@/lib/tmdb'
import { Search, X, Clock } from 'lucide-react'
import Link from 'next/link'
import MovieCard from '@/components/ui/MovieCard'

interface Props {
  genres: TMDBGenre[]
}

const HISTORY_KEY = 'cineua_search_history'
const MAX_HISTORY = 8

export default function SearchContent({ genres }: Props) {
  const searchParams = useSearchParams()
  const genreId = searchParams.get('genre')
  const selectedGenre = genres.find((g) => String(g.id) === genreId) ?? null

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [genreMovies, setGenreMovies] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Завантажити історію з localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  // Завантажити фільми по жанру
  useEffect(() => {
    if (!genreId) {
      setGenreMovies([])
      return
    }
    setLoading(true)
    fetch(`/api/movies/popular?genreId=${genreId}`)
      .then((r) => r.json())
      .then((data) => {
        setGenreMovies(data.results)
        setLoading(false)
      })
  }, [genreId])

  // Debounced пошук
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      const { results } = await searchMovies(query)
      setResults(results)
      setLoading(false)
      saveToHistory(query.trim())
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  function saveToHistory(q: string) {
    const updated = [q, ...history.filter((h) => h !== q)].slice(0, MAX_HISTORY)
    setHistory(updated)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }

  function removeFromHistory(q: string) {
    const updated = history.filter((h) => h !== q)
    setHistory(updated)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const showEmpty = !query && !selectedGenre && results.length === 0

  return (
    <div className="px-5">
      {/* Поле пошуку */}
      <div className="flex items-center gap-3 bg-surface-1 border border-white/7 rounded-2xl px-4 py-3 mb-5">
        <Search size={18} className="text-text-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Назва фільму..."
          className="flex-1 bg-transparent text-text-1 text-sm outline-none placeholder:text-text-3"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')}>
            <X size={16} className="text-text-3" />
          </button>
        )}
      </div>

      {/* Спінер */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Результати пошуку */}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-xs text-text-3 mb-3">
            Знайдено:{' '}
            <span className="text-text-1 font-bold">{results.length}</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            {results.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                vote_average={movie.vote_average}
                release_date={movie.release_date}
                genre={genres.find((g) => movie.genre_ids?.[0] === g.id)?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Нічого не знайдено */}
      {!loading && query && results.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-text-2 font-semibold">Нічого не знайдено</p>
          <p className="text-text-3 text-sm mt-1">Спробуй іншу назву</p>
        </div>
      )}

      {/* Результати по жанру */}
      {!loading && !query && selectedGenre && (
        <div>
          <p className="text-xs text-text-3 mb-3">
            Жанр:{' '}
            <span className="text-text-1 font-bold">{selectedGenre.name}</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            {genreMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                vote_average={movie.vote_average}
                release_date={movie.release_date}
                genre={selectedGenre.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Популярні жанри */}
      {showEmpty && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-3">
            Популярні жанри
          </h2>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 12).map((genre) => (
              <Link
                key={genre.id}
                href={`/search?genre=${genre.id}`}
                className="px-4 py-2 bg-surface-1 border border-white/7 rounded-full text-xs font-semibold text-text-2 hover:text-text-1 hover:border-white/15 transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Історія пошуку */}
      {showEmpty && history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider">
              Історія
            </h2>
            <button
              onClick={clearHistory}
              className="text-xs text-text-3 hover:text-text-2"
            >
              Очистити
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {history.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3 bg-surface-1 border border-white/7 rounded-xl"
              >
                <Clock size={14} className="text-text-3 flex-shrink-0" />
                <span
                  className="flex-1 text-sm text-text-2 cursor-pointer"
                  onClick={() => setQuery(item)}
                >
                  {item}
                </span>
                <button onClick={() => removeFromHistory(item)}>
                  <X size={14} className="text-text-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
