'use client'

import { TMDBCast } from '@/lib/tmdb'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

interface Props {
  cast: TMDBCast[]
}

export default function MovieCast({ cast }: Props) {
  if (!cast.length) return null

  return (
    <div className="mt-6">
      <h2 className="text-base font-black text-text-1 mb-3 px-5">🎭 Актори</h2>
      <Swiper
        slidesPerView="auto"
        spaceBetween={12}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
      >
        {cast.map((actor) => (
          <SwiperSlide key={actor.id} style={{ width: '64px' }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-2 mb-2 mx-auto">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-text-1 line-clamp-2 leading-tight">
                {actor.name}
              </p>
              <p className="text-[10px] text-text-3 mt-0.5 line-clamp-1">
                {actor.character}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
