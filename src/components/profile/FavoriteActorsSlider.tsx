'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Image from 'next/image'
import Link from 'next/link'

interface Actor {
  actor_id: number
  actor_name: string
  profile_path: string | null
}

export default function FavoriteActorsSlider({ actors }: { actors: Actor[] }) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={16}
      style={{ paddingLeft: '0px', paddingRight: '0px' }}
    >
      {actors.map((actor) => (
        <SwiperSlide key={actor.actor_id} style={{ width: 'auto' }}>
          <Link
            href={`/person/${actor.actor_id}`}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-2 border border-white/10 relative">
              {actor.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.actor_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>
            <span className="text-[11px] text-text-2 font-semibold text-center w-16 line-clamp-2 leading-tight">
              {actor.actor_name}
            </span>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
