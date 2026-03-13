'use client'

import { TMDBVideo } from '@/lib/tmdb'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { Clapperboard } from 'lucide-react'

interface Props {
  trailer: TMDBVideo
}

export default function MovieTrailer({ trailer }: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Clapperboard size={16} className="text-accent-blue" />
        <h2 className="text-base font-black text-accent-gold">Трейлер</h2>
      </div>

      <div
        className="relative w-full rounded-2xl overflow-hidden bg-surface-1"
        style={{ height: 'clamp(220px, 25vh, 720px)' }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="w-full h-full flex flex-col items-center justify-center gap-3 bg-surface-2 hover:bg-surface-3 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-accent-gold flex items-center justify-center shadow-lg">
              <Play size={28} fill="#000" className="text-black ml-1" />
            </div>
            <span className="text-sm text-text-2 font-semibold">
              {trailer.name}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
