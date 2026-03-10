'use client'

import { TMDBMovie, getPosterUrl } from '@/lib/tmdb'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'
import { Navigation } from 'swiper/modules'
import 'swiper/css/navigation'
import SliderNav from '@/components/ui/SliderNav'

interface Props {
  movies: TMDBMovie[] | undefined
}

export default function SimilarMovies({ movies }: Props) {
  if (!movies?.length) return null

  return (
    <div className="mt-6">
      <h2 className="text-base font-black text-text-1 mb-3 px-5">
        🎭 Схожі фільми
      </h2>
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={12}
          slidesOffsetBefore={20}
          slidesOffsetAfter={20}
          navigation={{
            nextEl: '.similar-next',
            prevEl: '.similar-prev',
          }}
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} style={{ width: '112px' }}>
              <Link
                href={`/movie/${movie.id}`}
                className="cursor-pointer select-none"
              >
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
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <SliderNav prevClass="similar-prev" nextClass="similar-next" />
      </div>
    </div>
  )
}
