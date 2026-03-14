'use client'

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Не показуємо якщо вже встановлено
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // Не показуємо якщо юзер вже відхилив
    if (localStorage.getItem('pwa-dismissed')) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setPrompt(null)
  }

  function handleDismiss() {
    setVisible(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[390px]
      bg-[#18181f] border border-white/10 rounded-2xl p-4 z-50 shadow-2xl
      flex items-center gap-3 animate-slide-up"
    >
      {/* Іконка */}
      <div
        className="w-12 h-12 rounded-xl bg-accent-purple/20 border border-accent-purple/30
        flex items-center justify-center flex-shrink-0 text-xl"
      >
        🎬
      </div>

      {/* Текст */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">Встановити CineUA</p>
        <p className="text-xs text-white/40 mt-0.5">Додай на головний екран</p>
      </div>

      {/* Кнопки */}
      <button
        onClick={handleInstall}
        className="flex items-center gap-1.5 px-3 py-2 bg-accent-purple
          text-white text-xs font-bold rounded-xl flex-shrink-0 active:scale-95 transition-all"
      >
        <Download size={13} />
        Додати
      </button>
      <button
        onClick={handleDismiss}
        className="w-7 h-7 flex items-center justify-center text-white/30
          hover:text-white/60 transition-colors flex-shrink-0"
      >
        <X size={15} />
      </button>
    </div>
  )
}
