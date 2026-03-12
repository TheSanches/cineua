/**
 * Сторінка профілю користувача
 * Показує статистику, жанри, налаштування
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, Bell, Globe } from 'lucide-react'
import Image from 'next/image'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Статистика з user_movies
  const { data: movies } = await supabase.from('user_movies').select('status')

  const watched = movies?.filter((m) => m.status === 'watched').length ?? 0
  const watchlist = movies?.filter((m) => m.status === 'watchlist').length ?? 0
  const favorite = movies?.filter((m) => m.status === 'favorite').length ?? 0

  const name = user.user_metadata?.full_name ?? user.email
  const avatar = user.user_metadata?.avatar_url
  const firstLetter = name?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen pb-10">
      {/* Хедер */}
      <header className="px-5 pt-14 pb-3">
        <h1 className="text-2xl font-black text-text-1">Профіль</h1>
      </header>

      {/* Аватар і ім'я */}
      <div className="flex flex-col items-center px-5 pb-6">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={80}
            height={80}
            className="rounded-full border-2 border-white/10 mb-3"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-purple to-accent-gold flex items-center justify-center text-2xl font-black mb-3">
            {firstLetter}
          </div>
        )}
        <h2 className="text-xl font-black text-text-1">{name}</h2>
        <p className="text-sm text-text-3 mt-1">{user.email}</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-1 mx-5 mb-6 bg-surface-1 border border-white/7 rounded-2xl overflow-hidden">
        <div className="bg-surface-1 p-4 text-center">
          <p className="text-2xl font-black text-accent-gold">{watched}</p>
          <p className="text-[10px] text-text-3 mt-1">Переглянуто</p>
        </div>
        <div className="bg-surface-1 p-4 text-center border-x border-white/7">
          <p className="text-2xl font-black text-accent-purple">{watchlist}</p>
          <p className="text-[10px] text-text-3 mt-1">В списку</p>
        </div>
        <div className="bg-surface-1 p-4 text-center">
          <p className="text-2xl font-black text-danger">{favorite}</p>
          <p className="text-[10px] text-text-3 mt-1">Улюблені</p>
        </div>
      </div>

      {/* Налаштування */}
      <div className="px-5">
        <h3 className="text-sm font-bold text-text-3 mb-3 uppercase tracking-wider">
          Налаштування
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-1 border border-white/7 rounded-2xl">
            <Bell size={18} className="text-text-2" />
            <span className="text-sm font-semibold text-text-1 flex-1">
              Сповіщення
            </span>
            <span className="text-text-3 text-xs">Скоро</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-1 border border-white/7 rounded-2xl">
            <Globe size={18} className="text-text-2" />
            <span className="text-sm font-semibold text-text-1 flex-1">
              Мова
            </span>
            <span className="text-text-3 text-xs">Українська</span>
          </div>
        </div>
      </div>

      {/* Вийти */}
      <div className="px-5 mt-4">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 bg-surface-1 border border-white/7 rounded-2xl"
          >
            <LogOut size={18} className="text-danger" />
            <span className="text-sm font-semibold text-danger">Вийти</span>
          </button>
        </form>
      </div>
    </div>
  )
}
