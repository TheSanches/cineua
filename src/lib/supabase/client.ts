/**
 * Supabase клієнт для браузера
 * Використовується в клієнтських компонентах ('use client')
 * Наприклад: кнопка входу, форми, інтерактивні елементи
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}