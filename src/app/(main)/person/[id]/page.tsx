/**
 * Сторінка актора
 * /person/123
 */

import { getPersonDetails, getPersonCredits, getGenres } from '@/lib/tmdb'
import BackButton from '@/components/ui/BackButton'
import PersonMovies from '@/components/person/PersonMovies'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params

  const [person, credits, genres] = await Promise.all([
    getPersonDetails(Number(id)),
    getPersonCredits(Number(id)),
    getGenres(),
  ])

  const movies = credits.cast
    .filter((m) => m.poster_path)
    .sort((a, b) => b.popularity - a.popularity)

  return (
    <div className="min-h-screen pb-10">
      <BackButton />

      {/* Шапка */}
      <div className="flex flex-col items-center pt-8 px-5 pb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-surface-2 mb-4 border-2 border-white/10 relative">
          {person.profile_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
              alt={person.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              👤
            </div>
          )}
        </div>
        <h1 className="text-2xl font-black text-text-1">{person.name}</h1>
        {person.known_for_department && (
          <p className="text-sm text-text-3 mt-1">
            {person.known_for_department}
          </p>
        )}

        {/* Деталі */}
        <div className="flex gap-6 mt-4">
          {person.birthday && (
            <div className="text-center">
              <p className="text-sm font-bold text-text-1">
                {person.birthday.slice(0, 4)}
              </p>
              <p className="text-[10px] text-text-3">Рік народження</p>
            </div>
          )}
          {person.place_of_birth && (
            <div className="text-center">
              <p className="text-sm font-bold text-text-1 line-clamp-1">
                {person.place_of_birth.split(',').pop()?.trim()}
              </p>
              <p className="text-[10px] text-text-3">Країна</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-bold text-text-1">
              {credits.cast.length}
            </p>
            <p className="text-[10px] text-text-3">Фільмів</p>
          </div>
        </div>
      </div>

      {/* Біографія */}
      {person.biography && (
        <div className="px-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-accent-blue" />
            <h2 className="text-base font-black text-accent-gold">Біографія</h2>
          </div>
          <p className="text-sm text-text-2 leading-relaxed line-clamp-4">
            {person.biography}
          </p>
        </div>
      )}

      {/* Фільмографія */}
      <PersonMovies movies={movies} genres={genres} />
    </div>
  )
}
