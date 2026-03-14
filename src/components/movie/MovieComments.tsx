// Компонент для відображення коментарів до фільму, а також форми для додавання нового коментаря або відповіді на існуючий
'use client'

import { useState, useEffect } from 'react'
import {
  MovieComment,
  addComment,
  deleteComment,
  toggleCommentLike,
  getMovieComments,
} from '@/lib/userMovies'
import { Heart, Trash2, Reply, Star } from 'lucide-react'
import Image from 'next/image'

interface Props {
  movieId: number
  initialComments: MovieComment[]
  currentUserId: string | null
}

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange?: (v: number) => void
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            size={16}
            className={
              star <= value
                ? 'text-accent-gold fill-accent-gold'
                : 'text-text-3'
            }
          />
        </button>
      ))}
    </div>
  )
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onLike,
  onReply,
  replies,
}: {
  comment: MovieComment
  currentUserId: string | null
  onDelete: (id: string) => void
  onLike: (id: string) => void
  onReply: (id: string, name: string) => void
  replies: MovieComment[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-surface-1 border border-white/7 rounded-2xl p-4">
        {/* Хедер */}
        <div className="flex items-center gap-2 mb-2">
          {comment.user_avatar ? (
            <Image
              src={comment.user_avatar}
              alt=""
              width={33}
              height={33}
              className="rounded-full border border-white/10"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-gold flex items-center justify-center text-xs font-bold">
              {comment.user_name?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-xs font-bold text-text-1 flex-1">
            {comment.user_name}
          </span>
          <span className="text-[10px] text-text-3">
            {new Date(comment.created_at).toLocaleDateString('uk-UA')}
          </span>
        </div>

        {/* Рейтинг */}
        {comment.rating && <StarRating value={comment.rating} />}

        {/* Текст */}
        {/* Текст */}
        {comment.text && (
          <p className="text-sm text-text-2 mt-2 leading-relaxed">
            {comment.text}
          </p>
        )}

        {/* Дії */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onLike(comment.id)}
            className="flex items-center gap-1 text-[11px] text-text-3 hover:text-danger transition-colors"
          >
            <Heart size={13} />
            {(comment.likes ?? 0) > 0 && <span>{comment.likes}</span>}
          </button>
          <button
            onClick={() => onReply(comment.id, comment.user_name)}
            className="flex items-center gap-1 text-[11px] text-text-3 hover:text-text-1 transition-colors"
          >
            <Reply size={13} />
            Відповісти
          </button>
          {currentUserId === comment.user_id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="flex items-center gap-1 text-[11px] text-text-3 hover:text-danger transition-colors ml-auto"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Відповіді */}
      {replies.length > 0 && (
        <div className="ml-4 flex flex-col gap-2">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-surface-2 border border-white/5 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                {reply.user_avatar ? (
                  <Image
                    src={reply.user_avatar}
                    alt=""
                    width={33}
                    height={33}
                    className="rounded-full border border-white/10"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-purple to-accent-gold flex items-center justify-center text-[10px] font-bold">
                    {reply.user_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-text-1 flex-1">
                  {reply.user_name}
                </span>
                {currentUserId === reply.user_id && (
                  <button onClick={() => onDelete(reply.id)}>
                    <Trash2
                      size={12}
                      className="text-text-3 hover:text-danger"
                    />
                  </button>
                )}
              </div>
              <p className="text-xs text-text-2 leading-relaxed">
                {reply.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MovieComments({
  movieId,
  initialComments,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState<MovieComment[]>(initialComments)
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(
    null
  )
  const [loading, setLoading] = useState(false)

  // Завантажуємо актуальні дані при монтуванні
  useEffect(() => {
    getMovieComments(movieId).then((data) => {
      setComments(data)
    })
  }, [movieId])

  const topComments = comments.filter((c) => !c.parent_id)
  const replies = comments.filter((c) => !!c.parent_id)

  async function handleSubmit() {
    if (!currentUserId) {
      window.location.href = '/login'
      return
    }
    if (!text.trim() && !rating) return
    setLoading(true)
    try {
      await addComment(movieId, text, rating || null, replyTo?.id ?? null)

      if (rating && !replyTo) {
        // Перевіряємо чи вже є коментар з рейтингом в стейті
        const existingIndex = comments.findIndex(
          (c) =>
            c.user_id === currentUserId && c.rating !== null && !c.parent_id
        )

        if (existingIndex !== -1) {
          // Оновлюємо існуючий
          setComments((prev) =>
            prev.map((c) =>
              c.user_id === currentUserId && c.rating !== null && !c.parent_id
                ? { ...c, rating, text: text || null }
                : c
            )
          )
        } else {
          // Додаємо новий
          const newComment: MovieComment = {
            id: crypto.randomUUID(),
            movie_id: movieId,
            user_id: currentUserId ?? '',
            user_name: 'Ви',
            user_avatar: null,
            text: text || null,
            rating: rating || null,
            likes: 0,
            parent_id: null,
            created_at: new Date().toISOString(),
          }
          setComments((prev) => [newComment, ...prev])
        }
      } else {
        // Звичайний коментар або відповідь
        const newComment: MovieComment = {
          id: crypto.randomUUID(),
          movie_id: movieId,
          user_id: currentUserId ?? '',
          user_name: 'Ви',
          user_avatar: null,
          text: text || null,
          rating: null,
          likes: 0,
          parent_id: replyTo?.id ?? null,
          created_at: new Date().toISOString(),
        }
        setComments((prev) => [newComment, ...prev])
      }

      setText('')
      setRating(0)
      setReplyTo(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    await deleteComment(id)
    setComments((prev) => prev.filter((c) => c.id !== id && c.parent_id !== id))
  }

  async function handleLike(id: string) {
    if (!currentUserId) {
      window.location.href = '/login'
      return
    }
    const liked = await toggleCommentLike(id)
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: liked
                ? (c.likes ?? 0) + 1
                : Math.max(0, (c.likes ?? 0) - 1),
            }
          : c
      )
    )
  }

  return (
    <div className="mt-6">
      <h2 className="text-base font-black text-text-1 mb-4">
        💬 Коментарі{' '}
        {comments.length > 0 && (
          <span className="text-text-3 font-normal text-sm">
            ({topComments.length})
          </span>
        )}
      </h2>

      {/* Форма */}
      {currentUserId ? (
        <div className="bg-surface-1 border border-white/7 rounded-2xl p-4 mb-5">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-xs text-text-3">
              <Reply size={12} />
              Відповідь для{' '}
              <span className="text-accent-purple">{replyTo.name}</span>
              <button
                onClick={() => setReplyTo(null)}
                className="ml-auto text-text-3 hover:text-text-1"
              >
                ✕
              </button>
            </div>
          )}

          {!replyTo && (
            <div className="mb-3">
              <p className="text-xs text-text-3 mb-1">Ваша оцінка:</p>
              <StarRating value={rating} onChange={setRating} />
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyTo ? 'Ваша відповідь...' : 'Напишіть відгук...'}
            rows={3}
            className="w-full bg-surface-2 border border-white/7 rounded-xl p-3 text-sm text-text-1 placeholder:text-text-3 outline-none resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || (!text.trim() && !rating)}
            className="mt-2 px-5 py-2 bg-accent-purple text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Відправка...' : 'Відправити'}
          </button>
        </div>
      ) : (
        <div
          onClick={() => (window.location.href = '/login')}
          className="bg-surface-1 border border-white/7 rounded-2xl p-4 mb-5 text-center cursor-pointer active:scale-95 transition-all"
        >
          <p className="text-sm text-text-3">
            💬 Увійдіть щоб залишити коментар
          </p>
          <p className="text-xs text-accent-purple mt-1 font-bold">Увійти →</p>
        </div>
      )}

      {/* Список коментарів */}
      {topComments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-2">💬</p>
          <p className="text-text-3 text-sm">Будь першим хто прокоментує</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {topComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onLike={handleLike}
              onReply={(id, name) => setReplyTo({ id, name })}
              replies={replies.filter((r) => r.parent_id === comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
