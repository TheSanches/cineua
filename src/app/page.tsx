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
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white">
          Cine<span className="text-[#e8b84b]">UA</span>
        </h1>
        <p className="text-[#8888a0] mt-2">Привіт, {user.email} 👋</p>
        <p className="text-[#55556a] text-sm mt-1">Головна сторінка — в розробці</p>
      </div>
    </div>
  )
}