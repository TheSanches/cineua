import { createClient } from '@/lib/supabase/client'

export async function requireAuth(): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    window.location.href = '/login'
    return false
  }
  return true
}
