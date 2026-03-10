'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-14 left-4 z-10 w-9 h-9 bg-black/50 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center cursor-pointer"
    >
      <ArrowLeft size={16} className="text-white" />
    </button>
  )
}
