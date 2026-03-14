// компонент кнопки голосування за українське озвучення

'use client'

import { useState, useEffect } from 'react'
import { addUaVote, removeUaVote } from '@/lib/userMovies'
import { getUaVotesCount, getUaVote } from '@/lib/userMovies'

interface Props {
  movieId: number
  initialVoted: boolean
  initialCount: number
  userId: string | null
}

export default function UaVoteButton({
  movieId,
  initialVoted,
  initialCount,
  userId,
}: Props) {
  const [voted, setVoted] = useState(initialVoted)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  // Перевіряємо актуальний стан при монтуванні
  useEffect(() => {
    Promise.all([getUaVote(movieId), getUaVotesCount(movieId)]).then(
      ([userVoted, votesCount]) => {
        setVoted(userVoted)
        setCount(votesCount)
      }
    )
  }, [movieId])

  async function handleClick() {
    if (!userId) {
      window.location.href = '/login'
      return
    }
    setLoading(true)
    try {
      if (voted) {
        await removeUaVote(movieId)
        setVoted(false)
        setCount((c) => c - 1)
      } else {
        await addUaVote(movieId)
        setVoted(true)
        setCount((c) => c + 1)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-5 bg-ua/6 border border-ua/20 rounded-2xl p-4 flex items-center gap-3">
      <span className="text-2xl">🇺🇦</span>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-ua">Є українське озвучення?</h4>
        <p className="text-[11px] text-text-3 mt-0.5">
          {count > 0 ? `${count} підтверджень` : 'Будь першим хто підтвердить'}
        </p>
      </div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-4 py-2 text-xs font-black rounded-xl transition-colors ${
          voted ? 'bg-ua/20 text-ua border border-ua/40' : 'bg-ua text-black'
        }`}
      >
        {loading ? '...' : voted ? '✓ Так' : 'Так'}
      </button>
    </div>
  )
}
