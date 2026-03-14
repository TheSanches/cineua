// відповідь на рекомендацію фільму, з можливістю додати коментар або видалити рекомендацію

'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp } from 'lucide-react'
import {
  getMovieRecommendation,
  addRecommendation,
  removeRecommendation,
} from '@/lib/userMovies'

interface Props {
  movieId: number
  movieTitle: string
  posterPath: string | null
  user: { id: string } | null
}

export default function RecommendButton({
  movieId,
  movieTitle,
  posterPath,
  user,
}: Props) {
  const [recommended, setRecommended] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setInitialLoading(false)
      return
    }
    getMovieRecommendation(movieId).then((data) => {
      if (data) {
        setRecommended(true)
        setComment(data.comment || '')
      }
      setInitialLoading(false)
    })
  }, [movieId, user])

  if (initialLoading) return null

  async function handleSubmit() {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setLoading(true)
    try {
      await addRecommendation(movieId, movieTitle, posterPath, comment)
      setRecommended(true)
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove() {
    setLoading(true)
    try {
      await removeRecommendation(movieId)
      setRecommended(false)
      setComment('')
    } finally {
      setLoading(false)
    }
  }

  if (recommended) {
    return (
      <div className="flex gap-3 mt-5">
        <button
          onClick={handleRemove}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
           border bg-accent-purple text-white/90 text-text-5
          active:scale-95 transition-all"
        >
          <ThumbsUp size={15} fill="currentColor" />
          Рекомендую
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-3 mt-5">
      {!showForm ? (
        <button
          onClick={() =>
            user ? setShowForm(true) : (window.location.href = '/login')
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
      bg-white/5 text-white/60 border border-white/10
      active:scale-95 transition-all"
        >
          <ThumbsUp size={15} />
          Рекомендую іншим
        </button>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 200))}
            placeholder="Чому раджу цей фільм? (необов'язково)"
            rows={3}
            className="w-full bg-transparent text-sm text-white/80 placeholder-white/30
              resize-none outline-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">{comment.length}/200</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 text-xs font-bold text-white/40 text-accent-gold"
              >
                Скасувати
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-1.5 text-xs font-bold rounded-lg
                  bg-accent-purple text-white active:scale-95 transition-all"
              >
                {loading ? '...' : 'Рекомендувати'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
