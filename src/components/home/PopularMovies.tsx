'use client'

import { useState } from 'react'
import { TMDBMovie, getPosterUrl } from '@/lib/tmdb'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Filter = 'all' | 'ua'

interface Props {
  movies: TMDBMovie[] | undefined
}

export default function PopularMovies({ movies }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  if (!movies?.length) return null

  return (
    <div className="bg-surface-1 border border-white/7 rounded-2xl overflow-hidden">
      {/* Заголовок */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-text-1">🎬 Популярні</h2>
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
      {/* Swiper */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.popular-next',
            prevEl: '.popular-prev',
          }}
          slidesPerView="auto"
          spaceBetween={12}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          className="pb-4"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} style={{ width: '112px' }}>
              <div className="cursor-pointer">
                <div className="relative w-28 h-40 rounded-xl overflow-hidden mb-2 select-none">
                  <img
                    draggable={false}
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-accent-gold text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <p className="text-xs font-semibold text-text-1 line-clamp-2 leading-tight">
                  {movie.title}
                </p>
                <p className="text-[11px] text-text-3 mt-1">
                  {movie.release_date?.slice(0, 4)}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Стрілка ліворуч */}
        <div className="popular-prev absolute -left-0 top-15 z-10 w-8 h-8 bg-accent-gold/50 rounded-full flex items-center justify-center shadow-md shadow-gold/50 hover:bg-accent-gold/80 transition-colors cursor-pointer">
          <ChevronLeft size={16} className="text-white" />
        </div>

        {/* Стрілка праворуч */}
        <div className="popular-next absolute -right-0 top-15 z-10 w-8 h-8 bg-accent-gold/50 rounded-full flex items-center justify-center shadow-md shadow-gold/50 hover:bg-accent-gold/80 transition-colors cursor-pointer">
          <ChevronRight size={16} className="text-white" />
        </div>
      </div>
    </div>
  )
}
