// відображає картку фільму з його постером, назвою, рейтингом та жанром. Компонент приймає два пропси: об'єкт фільму (movie) та необов'язковий рядок жанру (genre). Картка є посиланням на сторінку з детальною інформацією про фільм. Якщо постер недоступний, він не відображається. Рейтинг фільму показується у верхньому правому куті постера, а назва та жанр розташовані під ним. Картка має ефект збільшення при наведенні курсора.

import { TMDBMovie, getPosterUrl } from '@/lib/tmdb'
import Link from 'next/link'

interface Props {
  movie: TMDBMovie
  genre?: string
}

export default function MovieCard({ movie, genre }: Props) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="bg-surface-2 rounded-lg overflow-hidden shadow-lg flex flex-col"
    >
      <div className="overflow-hidden h-64 relative">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          draggable={false}
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
          {genre && <p className="text-text-3 text-[10px]">{genre}</p>}
        </div>
      </div>
    </Link>
  )
}
