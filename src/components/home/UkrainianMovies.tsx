import { getUkrainianMovies } from '@/lib/tmdb'
import MovieSlider from '@/components/ui/MovieSlider'

export default async function UkrainianMovies() {
  const { results } = await getUkrainianMovies()
  if (!results?.length) return null

  return (
    <div className="bg-surface-1 border border-white/7 rounded-2xl ">
      <MovieSlider
        movies={results}
        title="Українське кіно"
        icon={<span className="text-accent-blue">🇺🇦</span>}
      />
    </div>
  )
}
