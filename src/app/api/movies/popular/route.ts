import { getPopularMovies } from '@/lib/tmdb'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const genreId = searchParams.get('genreId')
      ? Number(searchParams.get('genreId'))
      : undefined

    const movies = await getPopularMovies(page, genreId)
    return NextResponse.json(movies)
  } catch (error) {
    return NextResponse.json(
      { error: 'Не вдалось отримати фільми' },
      { status: 500 }
    )
  }
}
