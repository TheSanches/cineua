/**
 * Головна сторінка — тимчасова заглушка
 * Поки верстаємо повноцінний layout
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white">
          Cine<span className="text-accent-gold">UA</span>
        </h1>
        <p className="text-text-2 mt-2">Привіт, {user.email} 👋</p>
        <p className="text-text-3 text-sm mt-1">Головна сторінка — в розробці</p>
      </div>
    </div>
  )
}