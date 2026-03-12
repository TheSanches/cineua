'use client'

import { useState } from 'react'
import { addUaVote, removeUaVote } from '@/lib/userMovies'

interface Props {
  movieId: number
  initialVoted: boolean
  initialCount: number
}

export default function UaVoteButton({
  movieId,
  initialVoted,
  initialCount,
}: Props) {
  const [voted, setVoted] = useState(initialVoted)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
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
