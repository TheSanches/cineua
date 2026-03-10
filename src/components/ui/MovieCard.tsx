// відображає картку фільму з його постером, назвою, рейтингом та жанром. Компонент приймає два пропси: об'єкт фільму (movie) та необов'язковий рядок жанру (genre). Картка є посиланням на сторінку з детальною інформацією про фільм. Якщо постер недоступний, він не відображається. Рейтинг фільму показується у верхньому правому куті постера, а назва та жанр розташовані під ним. Картка має ефект збільшення при наведенні курсора.

import Link from 'next/link'
import { getPosterUrl } from '@/lib/tmdb'

interface Props {
  id: number
  title: string
  poster_path: string | null
  vote_average?: number
  release_date?: string
  genre?: string
}

export default function MovieCard({
  id,
  title,
  poster_path,
  vote_average,
  release_date,
  genre,
}: Props) {
  return (
    <Link
      href={`/movie/${id}`}
      className="bg-surface-2 rounded-lg overflow-hidden shadow-lg flex flex-col"
    >
      <div className="overflow-hidden h-64 relative">
        <img
          src={getPosterUrl(poster_path)}
          alt={title}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {vote_average !== undefined && (
          <div className="absolute top-2 right-2 bg-black/70 text-accent-gold text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
            ⭐ {vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between min-h-[80px]">
        <h3 className="text-sm font-bold text-text-1 line-clamp-2 leading-tight text-center">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-text-3 text-[10px]">{release_date?.slice(0, 4)}</p>
          {genre && <p className="text-text-3 text-[10px]">{genre}</p>}
        </div>
      </div>
    </Link>
  )
}
