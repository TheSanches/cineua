/**
 * Головна сторінка
 * Показує віджети: продовжити перегляд, AI рекомендації,
 * нові з УКР озвученням, статистика
 */

import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen">
      {/* Хедер */}
      <header className="flex items-center justify-between px-5 pt-14 pb-3">
        <div className="text-2xl font-black tracking-tight text-text-1">
          Cine<span className="text-accent-gold">UA</span>
        </div>
        <div className="flex gap-2 items-center">
          {/* Сповіщення */}
          <button className="w-10 h-10 bg-surface-1 border border-white/7 rounded-full flex items-center justify-center">
            🔔
          </button>
          {/* Аватар */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-gold flex items-center justify-center font-bold text-sm">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
        </div>
      </header>

      {/* Привітання */}
      <div className="px-5 pb-5">
        <h1 className="text-xl font-black text-text-1">
          Привіт 👋
        </h1>
        <p className="text-sm text-text-2 mt-1">Що дивимось сьогодні?</p>
      </div>

      {/* Пошук */}
      <div className="mx-5 mb-5 bg-surface-1 border border-white/7 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-text-2">🔍</span>
        <span className="text-text-3 text-sm">Пошук фільмів...</span>
        <div className="ml-auto bg-gradient-to-r from-accent-purple to-purple-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          AI
        </div>
      </div>

      {/* Placeholder для віджетів */}
      <div className="px-5 space-y-4">
        <div className="bg-surface-1 border border-white/7 rounded-2xl p-4 h-48 flex items-center justify-center">
          <p className="text-text-3 text-sm">🎬 Продовжити перегляд</p>
        </div>
        <div className="bg-surface-1 border border-white/7 rounded-2xl p-4 h-40 flex items-center justify-center">
          <p className="text-text-3 text-sm">🤖 AI Рекомендації</p>
        </div>
        <div className="bg-surface-1 border border-white/7 rounded-2xl p-4 h-40 flex items-center justify-center">
          <p className="text-text-3 text-sm">🇺🇦 Нові з озвученням</p>
        </div>
      </div>
    </div>
  )
}