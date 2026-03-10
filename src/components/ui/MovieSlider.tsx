// Компонент для горизонтального слайдера з фільмами (використовує Swiper)

'use client'

import { TMDBMovie, getPosterUrl } from '@/lib/tmdb'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'

interface Props {
  movies: TMDBMovie[] | undefined
  title: string
  icon?: React.ReactNode
  prevClass?: string
  nextClass?: string
}

export default function MovieSlider({
  movies,
  title,
  icon,
  prevClass,
  nextClass,
}: Props) {
  if (!movies?.length) return null

  return (
    <div className="mt-6 relative">
      {title && (
        <div className="flex items-center gap-2 mb-3 px-5">
          {icon}
          <h2 className="text-base font-black text-accent-gold">{title}</h2>
        </div>
      )}
      <Swiper
        modules={[Navigation]}
        navigation={{ nextEl: `.${nextClass}`, prevEl: `.${prevClass}` }}
        slidesPerView="auto"
        spaceBetween={12}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} style={{ width: '112px' }}>
            <Link href={`/movie/${movie.id}`} className="select-none">
              <div className="relative w-28 h-40 rounded-xl overflow-hidden mb-2">
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
              <p className="text-[10px] text-text-3 mt-1">
                {movie.release_date?.slice(0, 4)}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
