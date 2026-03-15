'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getPosterUrl } from '@/lib/tmdb'
import { getCommunityRecommendations } from '@/lib/userMovies'
import { ThumbsUp } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'

interface Recommendation {
  id: string
  movie_id: number
  movie_title: string
  poster_path: string | null
  comment: string
  created_at: string
  user_name: string | null
  user_avatar: string | null
}

export default function CommunityRecommendations() {
  const [items, setItems] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getCommunityRecommendations().then((data) => {
      setItems(data as Recommendation[])
      setLoading(false)
    })
  }, [])

  if (loading)
    return (
      <div className="mx-5 mb-4 h-24 rounded-2xl bg-white/5 animate-pulse" />
    )

  if (items.length === 0) return null

  return (
    <div className="bg-surface-1 border border-white/7 rounded-2xl py-4">
      <div className="flex items-center gap-2 mb-2 px-4">
        <ThumbsUp size={16} className="text-accent-blue" />
        <h2 className="text-base font-black text-accent-gold">
          Спільнота радить
        </h2>
      </div>

      <div className="overflow-hidden">
        <Swiper
          modules={[FreeMode]}
          freeMode
          slidesPerView="auto"
          spaceBetween={12}
          slidesOffsetBefore={20}
          slidesOffsetAfter={20}
          className="!overflow-visible"
        >
          {items.map((item) => {
            const userName = item.user_name || 'Користувач'
            const avatarUrl = item.user_avatar

            return (
              <SwiperSlide key={item.id} style={{ width: 224 }}>
                <div
                  onClick={() => router.push(`/movie/${item.movie_id}`)}
                  className="bg-white/5 border border-white/8 rounded-2xl p-3
                  cursor-pointer active:scale-95 transition-all"
                >
                  <div className="flex gap-3 mb-2">
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                      {item.poster_path ? (
                        <Image
                          src={getPosterUrl(item.poster_path, 'original')}
                          alt={item.movie_title}
                          width={48}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🎬
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white leading-tight line-clamp-2 mb-1">
                        {item.movie_title}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={userName}
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full bg-violet-500
                          flex items-center justify-center text-[9px] font-bold"
                          >
                            {userName[0]}
                          </div>
                        )}
                        <span className="text-xs text-white/40 truncate">
                          {userName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.comment && (
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                      "{item.comment}"
                    </p>
                  )}
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}
