/**
 * TMDB API клієнт
 * Всі запити до themoviedb.org через цей файл
 * Документація: https://developer.themoviedb.org/docs
 */

const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Розміри постерів які надає TMDB
export const PosterSize = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
} as const

export async function getMovieCredits(movieId: number): Promise<TMDBCredits> {
  const params = new URLSearchParams({ language: 'uk-UA' })
  const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?${params}`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB credits error: ${res.status}`)
  return res.json() as Promise<TMDBCredits>
}

export interface TMDBCast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TMDBCredits {
  cast: TMDBCast[]
}

// Базові заголовки для кожного запиту
const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  'Content-Type': 'application/json',
}

// Типи даних які повертає TMDB
export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number | null
  genres: Array<{ id: number; name: string }>
  tagline: string
}

export interface TMDBReview {
  id: string
  author: string
  content: string
  created_at: string
  url: string
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Отримати постер фільму по шляху з TMDB
export function getPosterUrl(
  path: string | null,
  size: keyof typeof PosterSize = 'medium'
): string {
  if (!path) return '/placeholder-poster.png'
  return `${IMAGE_BASE_URL}/${PosterSize[size]}${path}`
}

// Пошук фільмів по назві
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse<TMDBMovie>> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    language: 'uk-UA',
  })
  const res = await fetch(`${BASE_URL}/search/movie?${params}`, {
    headers,
    cache: 'no-store', // завжди свіжий результат
  })
  if (!res.ok) throw new Error(`TMDB search error: ${res.status}`)
  return res.json() as Promise<TMDBResponse<TMDBMovie>>
}

// Отримати деталі фільму по ID
export async function getMovieDetails(
  movieId: number
): Promise<TMDBMovieDetails> {
  const params = new URLSearchParams({ language: 'uk-UA' })
  const res = await fetch(`${BASE_URL}/movie/${movieId}?${params}`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB movie error: ${res.status}`)
  return res.json() as Promise<TMDBMovieDetails>
}

// Отримати відгуки на фільм
export async function getMovieReviews(
  movieId: number,
  page: number = 1
): Promise<TMDBResponse<TMDBReview>> {
  const params = new URLSearchParams({ page: String(page) })

  const res = await fetch(`${BASE_URL}/movie/${movieId}/reviews?${params}`, {
    headers,
  })

  if (!res.ok) throw new Error(`TMDB reviews error: ${res.status}`)

  return res.json() as Promise<TMDBResponse<TMDBReview>>
}

// Отримати популярні фільми
export async function getPopularMovies(
  page = 1,
  genreId?: number
): Promise<TMDBResponse<TMDBMovie>> {
  const params = new URLSearchParams({ language: 'uk-UA', page: String(page) })
  if (genreId) params.set('with_genres', String(genreId))

  const res = await fetch(`${BASE_URL}/discover/movie?${params}`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json() as Promise<TMDBResponse<TMDBMovie>>
}

export interface TMDBGenre {
  id: number
  name: string
}

// Отримати всі жанри
export async function getGenres(): Promise<TMDBGenre[]> {
  const params = new URLSearchParams({ language: 'uk-UA' })
  const res = await fetch(`${BASE_URL}/genre/movie/list?${params}`, {
    headers,
    next: { revalidate: 86400 }, // кеш на 24 години — жанри майже не змінюються
  })
  if (!res.ok) throw new Error(`TMDB genres error: ${res.status}`)
  const data = (await res.json()) as { genres: TMDBGenre[] }
  return data.genres
}

// схожі фільми
export async function getSimilarMovies(
  movieId: number
): Promise<TMDBResponse<TMDBMovie>> {
  const params = new URLSearchParams({ language: 'uk-UA' })
  const res = await fetch(`${BASE_URL}/movie/${movieId}/similar?${params}`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB similar error: ${res.status}`)
  return res.json() as Promise<TMDBResponse<TMDBMovie>>
}

export interface TMDBPerson {
  id: number
  name: string
  profile_path: string | null
  biography: string
  birthday: string | null
  place_of_birth: string | null
  known_for_department: string
}

export interface TMDBPersonCredits {
  cast: TMDBMovie[]
}

// Деталі актора
export async function getPersonDetails(personId: number): Promise<TMDBPerson> {
  const params = new URLSearchParams({ language: 'uk-UA' })
  const res = await fetch(`${BASE_URL}/person/${personId}?${params}`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB person error: ${res.status}`)
  return res.json() as Promise<TMDBPerson>
}

// Фільми актора
export async function getPersonCredits(
  personId: number
): Promise<TMDBPersonCredits> {
  const params = new URLSearchParams({ language: 'uk-UA' })
  const res = await fetch(
    `${BASE_URL}/person/${personId}/movie_credits?${params}`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) throw new Error(`TMDB person credits error: ${res.status}`)
  return res.json() as Promise<TMDBPersonCredits>
}

export interface TMDBCrew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TMDBCredits {
  cast: TMDBCast[]
  crew: TMDBCrew[]
}

// Трейлери та відео
export interface TMDBVideo {
  id: string
  key: string // YouTube ключ
  name: string
  site: string // 'YouTube'
  type: string // 'Trailer', 'Teaser', etc.
  official: boolean
}

export interface TMDBImage {
  file_path: string
  width: number
  height: number
}

// Отримати трейлери фільму
export async function getMovieVideos(movieId: number): Promise<TMDBVideo[]> {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB videos error: ${res.status}`)
  const data = (await res.json()) as { results: TMDBVideo[] }
  return data.results.filter(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )
}

// Отримати скріншоти фільму
export async function getMovieImages(movieId: number): Promise<TMDBImage[]> {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/images`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB images error: ${res.status}`)
  const data = (await res.json()) as { backdrops: TMDBImage[] }
  return data.backdrops.slice(0, 10)
}
