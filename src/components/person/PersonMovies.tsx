// відображає фільмографію актора або режисера. Компонент приймає два пропси: масив фільмів (movies) та масив жанрів (genres). Він спочатку відображає заголовок "Фільмографія" з іконкою, а потім показує сітку з фільмами. Кожен фільм представлений у вигляді картки (MovieCard), яка містить інформацію про фільм та його жанр. Якщо кількість фільмів перевищує початкову кількість (INITIAL_COUNT), відображається кнопка "Завантажити ще", яка при натисканні завантажує наступну порцію фільмів.

'use client'

import { TMDBMovie, TMDBGenre } from '@/lib/tmdb'
import { useState } from 'react'
import MovieCard from '@/components/ui/MovieCard'
import { Film } from 'lucide-react'

interface Props {
  movies: TMDBMovie[]
  genres: TMDBGenre[]
}

const INITIAL_COUNT = 10

export default function PersonMovies({ movies, genres }: Props) {
  const [count, setCount] = useState(INITIAL_COUNT)

  const visible = movies.slice(0, count)
  const hasMore = count < movies.length

  return (
    <div className="px-5">
      <div className="flex items-center gap-2 mb-3">
        <Film size={18} className="text-accent-blue" />
        <h2 className="text-base font-black text-accent-gold">Фільмографія</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {visible.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            vote_average={movie.vote_average}
            release_date={movie.release_date}
            genre={genres.find((g) => g.id === movie.genre_ids[0])?.name}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => setCount((prev) => prev + INITIAL_COUNT)}
            className="px-6 py-3 bg-surface-2 border border-white/10 text-text-2 text-sm font-semibold rounded-full hover:bg-surface-3 transition-colors"
          >
            Завантажити ще ({movies.length - count} фільмів)
          </button>
        </div>
      )}
    </div>
  )
}
