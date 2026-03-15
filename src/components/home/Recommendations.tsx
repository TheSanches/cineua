import { TMDBMovie } from '@/lib/tmdb'
import MovieSlider from '@/components/ui/MovieSlider'
import { Sparkles } from 'lucide-react'

interface Props {
  movies: TMDBMovie[]
}

export default function Recommendations({ movies }: Props) {
  if (!movies.length) return null

  return (
    <div className="bg-surface-1 border border-white/7 rounded-2xl py-4">
      <div className="flex items-center gap-2 px-4">
        <Sparkles size={16} className="text-accent-blue" />
        <h2 className="text-base font-black text-accent-gold">
          Рекомендації для вас
        </h2>
      </div>
      <MovieSlider movies={movies} title="" />
    </div>
  )
}
