import { NextRequest, NextResponse } from 'next/server'
import { getTrending, getGenreTracks, getMoodTracks } from '@/lib/youtube'

export async function GET(req: NextRequest) {
  const genre = req.nextUrl.searchParams.get('genre')
  const mood = req.nextUrl.searchParams.get('mood')

  try {
    let tracks
    if (genre && genre !== 'All') {
      tracks = await getGenreTracks(genre)
    } else if (mood) {
      tracks = await getMoodTracks(mood)
    } else {
      tracks = await getTrending()
    }
    return NextResponse.json({ tracks })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
  }
                                                    
