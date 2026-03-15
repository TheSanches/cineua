'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import {
  isFavoriteActor,
  addFavoriteActor,
  removeFavoriteActor,
} from '@/lib/userMovies'
import { createClient } from '@/lib/supabase/client'

interface Props {
  actorId: number
  actorName: string
  profilePath: string | null
}

export default function FavoriteActorButton({
  actorId,
  actorName,
  profilePath,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setIsGuest(true)
        setIsLoading(false)
        return
      }
      const result = await isFavoriteActor(actorId)
      setIsFavorite(result)
      setIsLoading(false)
    }
    init()
  }, [actorId])

  const toggle = async () => {
    if (isGuest) {
      window.location.href = '/login'
      return
    }
    setIsLoading(true)
    if (isFavorite) {
      await removeFavoriteActor(actorId)
      setIsFavorite(false)
    } else {
      await addFavoriteActor({
        actor_id: actorId,
        actor_name: actorName,
        profile_path: profilePath,
      })
      setIsFavorite(true)
    }
    setIsLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all
        ${
          isFavorite
            ? 'bg-red-500/20 border-red-500/50 text-red-400'
            : 'bg-surface-1 border-white/10 text-text-2 hover:border-white/20'
        }
        ${isLoading ? 'opacity-50' : ''}
      `}
    >
      <Heart
        size={16}
        className={isFavorite ? 'fill-red-400 text-red-400' : ''}
      />
      {isFavorite ? 'В улюблених' : 'До улюблених'}
    </button>
  )
}
