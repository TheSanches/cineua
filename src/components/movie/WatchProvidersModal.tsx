'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ExternalLink, Copy, Check } from 'lucide-react'
import { getWatchProviders } from '@/lib/tmdb'

interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface ProvidersData {
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}

interface Props {
  movieId: number
  movieTitle: string
  onClose: () => void
}

const LOGO_BASE = 'https://image.tmdb.org/t/p/w92'

const PLATFORM_LINKS: Record<string, string> = {
  Netflix: 'https://www.netflix.com',
  Megogo: 'https://megogo.net/ua',
  'Sweet.tv': 'https://sweet.tv',
  'Apple TV': 'https://tv.apple.com',
  'Apple TV+': 'https://tv.apple.com',
  'Apple TV Store': 'https://tv.apple.com',
  'Google Play Movies': 'https://play.google.com/store/movies',
  'Amazon Prime Video': 'https://www.primevideo.com',
  'Disney Plus': 'https://www.disneyplus.com',
  Max: 'https://play.max.com',
  'HBO Max': 'https://play.max.com',
  'Rakuten TV': 'https://www.rakuten.tv',
  'Paramount Plus': 'https://www.paramountplus.com',
}

const UA_FALLBACKS = [
  {
    name: 'Megogo',
    url: (title: string) =>
      `https://megogo.net/ua/search-extended?q=${encodeURIComponent(title)}`,
  },
  {
    name: 'Sweet.tv',
    url: (title: string) =>
      `https://sweet.tv/search?q=${encodeURIComponent(title)}`,
  },
  {
    name: 'Kyivstar TV',
    url: (title: string) =>
      `https://tv.kyivstar.ua/ua/search?query=${encodeURIComponent(title)}`,
  },
  {
    name: 'Takflix',
    url: (title: string) =>
      `https://takflix.com/uk/search?query=${encodeURIComponent(title)}`,
  },
]

export default function WatchProvidersModal({
  movieId,
  movieTitle,
  onClose,
}: Props) {
  const [providers, setProviders] = useState<ProvidersData | null>(null)
  const [justWatchLink, setJustWatchLink] = useState<string | null>(null)
  const [isUa, setIsUa] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    getWatchProviders(movieId).then(({ ua, isUa, justWatchLink }) => {
      setProviders(ua)
      setIsUa(isUa)
      setJustWatchLink(justWatchLink)
      setLoading(false)
    })
  }, [movieId])

  const hasProviders = !!(
    providers?.flatrate?.length ||
    providers?.rent?.length ||
    providers?.buy?.length
  )

  function handleCopy() {
    navigator.clipboard.writeText(movieTitle)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function renderSection(type: 'flatrate' | 'rent' | 'buy', label: string) {
    const list = providers?.[type]
    if (!list?.length) return null
    return (
      <div key={type} className="mb-4">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 px-1">
          {label}
        </p>
        <div className="flex flex-col gap-2">
          {list.map((provider) => (
            <a
              key={provider.provider_id}
              href={
                PLATFORM_LINKS[provider.provider_name] ?? justWatchLink ?? '#'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl p-3 active:scale-95 transition-all group"
            >
              <Image
                src={`${LOGO_BASE}${provider.logo_path}`}
                alt={provider.provider_name}
                width={40}
                height={40}
                className="rounded-xl shadow-md"
              />
              <span className="text-sm font-bold text-white flex-1 group-hover:text-amber-400 transition-colors">
                {provider.provider_name}
              </span>
              <ExternalLink size={14} className="text-white/20" />
            </a>
          ))}
        </div>
      </div>
    )
  }

  if (!mounted) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-40px)] max-w-[400px] bg-[#0A0A0F] border border-white/10 rounded-[32px] z-[70] p-6 max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Де дивитись
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-white/40 line-clamp-1">{movieTitle}</p>
              <button
                onClick={handleCopy}
                className="text-white/20 hover:text-white transition-colors"
              >
                {copied ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-white/60" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {hasProviders && (
              <div className="space-y-4">
                {!isUa && (
                  <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-3 mb-4">
                    <p className="text-[11px] text-amber-400/80 text-center leading-relaxed">
                      Українські стрімінги не надали дані. Показуємо доступність
                      в інших регіонах.
                    </p>
                  </div>
                )}
                {renderSection('flatrate', '📺 Підписка')}
                {renderSection('rent', '💳 Оренда')}
                {renderSection('buy', '🛒 Покупка')}
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-1">
                🇺🇦 Українські сервіси
              </p>
              <div className="grid grid-cols-1 gap-2">
                {UA_FALLBACKS.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url(movieTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/40 rounded-2xl p-4 transition-all group"
                  >
                    <span className="text-sm font-bold text-white/90 group-hover:text-blue-400">
                      Знайти на {platform.name}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-blue-500/40 group-hover:text-blue-400"
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              {justWatchLink && (
                <a
                  href={justWatchLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-black text-sm rounded-2xl active:scale-95 transition-all"
                >
                  Повна інфо на JustWatch
                  <ExternalLink size={16} />
                </a>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/10 text-white/60 text-sm font-bold rounded-2xl active:scale-95 transition-all"
              >
                <Copy size={16} />
                {copied ? 'Назву скопійовано!' : 'Копіювати назву для пошуку'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  )
}
