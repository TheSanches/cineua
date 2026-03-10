// відображає список учасників (акторів) фільму. Якщо даних про склад немає (cast порожній), компонент нічого не рендерит. Якщо ж дані є, він використовує бібліотеку Swiper для створення горизонтального слайдера, де кожен слайд представляє окремого актора. Кожен актор відображається з фотографією (якщо вона є), ім'ям та роллю, яку він виконує у фільмі. Якщо фотографії немає, замість неї показується іконка. Клік на актора веде на його сторінку з детальною інформацією.

'use client'

import { TMDBCast } from '@/lib/tmdb'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'
import { Users } from 'lucide-react'

interface Props {
  cast: TMDBCast[]
}

export default function MovieCast({ cast }: Props) {
  if (!cast.length) return null

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Users size={18} className="text-accent-blue" />
        <h2 className="text-base font-black text-accent-gold">Актори</h2>
      </div>
      <Swiper
        slidesPerView="auto"
        spaceBetween={12}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
      >
        {cast.map((actor) => (
          <SwiperSlide key={actor.id} style={{ width: '64px' }}>
            <Link href={`/person/${actor.id}`}>
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
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
