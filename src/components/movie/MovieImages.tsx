'use client'

import { TMDBImage } from '@/lib/tmdb'
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Zoom } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/zoom'
import { X, Camera } from 'lucide-react'

interface Props {
  images: TMDBImage[]
}

export default function MovieImages({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Закрытие по Escape
  useEffect(() => {
    if (selectedIndex === null) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null)
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [selectedIndex])

  if (!images.length) return null

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Camera size={16} className="text-accent-blue" />
        <h2 className="text-base font-black text-accent-gold">
          Кадри з фільму
        </h2>
      </div>

      {/* Миниатюры */}
      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
      >
        {images.map((img, index) => (
          <SwiperSlide key={img.file_path || index} style={{ width: '192px' }}>
            <button
              onClick={() => setSelectedIndex(index)}
              className="rounded-xl overflow-hidden block w-full"
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                alt="Кадр з фільму"
                className="w-48 h-28 object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Полноэкранный просмотр */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 z-10 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={36} />
          </button>

          <Swiper
            modules={[Navigation, Zoom]}
            initialSlide={selectedIndex}
            slidesPerView={1}
            navigation
            zoom
            className="h-screen w-screen"
            style={
              {
                '--swiper-navigation-color': '#fff',
                '--swiper-navigation-size': '44px',
              } as React.CSSProperties
            }
          >
            {images.map((img, index) => (
              <SwiperSlide
                key={img.file_path || index}
                className="flex items-center justify-center"
              >
                <div className="swiper-zoom-container flex h-full w-full items-center justify-center p-4">
                  <img
                    src={`https://image.tmdb.org/t/p/original${img.file_path}`}
                    alt="Кадр з фільму"
                    className="max-h-full max-w-full object-contain select-none"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}
