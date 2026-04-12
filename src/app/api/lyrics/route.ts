import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get('artist')
  const title = req.nextUrl.searchParams.get('title')

  if (!artist || !title) {
    return NextResponse.json({ error: 'Missing artist or title' }, { status: 400 })
  }

  try {
    // Primary: lyrics.ovh (free, no key needed)
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
      { next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      if (data.lyrics) {
        return NextResponse.json({ lyrics: data.lyrics.trim() })
      }
    }

    return NextResponse.json({ lyrics: null, message: 'Lyrics not found' })
  } catch {
    return NextResponse.json({ lyrics: null, message: 'Lyrics service unavailable' })
  }
        }
  
