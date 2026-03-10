import { TMDBMovie } from '@/lib/tmdb'
import { Clapperboard } from 'lucide-react'
import MovieSlider from '@/components/ui/MovieSlider'

interface Props {
  movies: TMDBMovie[] | undefined
}

export default function SimilarMovies({ movies }: Props) {
  return (
    <MovieSlider
      movies={movies}
      title="Схожі фільми"
      icon={<Clapperboard size={16} className="text-accent-blue" />}
    />
  )
}
