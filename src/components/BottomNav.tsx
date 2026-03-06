/**
 * Нижня навігація (Bottom Navigation Bar)
 * Фіксована внизу екрану на всіх головних сторінках
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid2x2, Search, Bookmark, User } from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
  isCenter?: boolean
}

const navItems: NavItem[] = [
  { href: '/', icon: <Home size={22} />, label: 'Головна' },
  { href: '/catalog', icon: <Grid2x2 size={22} />, label: 'Каталог' },
  { href: '/search', icon: <Search size={22} />, label: 'Пошук', isCenter: true },
  { href: '/watchlist', icon: <Bookmark size={22} />, label: 'Список' },
  { href: '/profile', icon: <User size={22} />, label: 'Профіль' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-20 bg-bg/95 backdrop-blur-xl border-t border-white/7 flex items-end pb-4 px-1 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href

        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-gold rounded-2xl flex items-center justify-center shadow-lg shadow-accent-purple/50">
                <Search size={22} className="text-white" />
              </div>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors ${
              isActive ? 'text-accent-gold' : 'text-text-3'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}