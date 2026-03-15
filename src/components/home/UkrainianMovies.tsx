import { getUkrainianMovies } from '@/lib/tmdb'
import MovieSlider from '@/components/ui/MovieSlider'

export default async function UkrainianMovies() {
  const { results } = await getUkrainianMovies()
  if (!results?.length) return null

  return (
    <MovieSlider
      movies={results}
      title="Українське кіно"
      icon={<span>🇺🇦</span>}
    />
  )
}
