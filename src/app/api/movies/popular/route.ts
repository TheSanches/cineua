/**
 * API роут для отримання популярних фільмів
 * GET /api/movies/popular
 */

import { getPopularMovies } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  try {
    const movies = await getPopularMovies()
    return NextResponse.json(movies)
  } catch (error) {
    return NextResponse.json(
      { error: 'Не вдалось отримати фільми' },
      { status: 500 }
    )
  }
}