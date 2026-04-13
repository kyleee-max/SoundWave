import { NextRequest, NextResponse } from 'next/server'

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://piped-api.garudalinux.org',
  'https://api.piped.projectsegfau.lt',
]

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get('videoId')
  if (!videoId) return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })

  for (const instance of PIPED_INSTANCES) {
    try {
      const res = await fetch(`${instance}/streams/${videoId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) continue

      const data = await res.json()

      // Ambil audio stream terbaik (bitrate tertinggi)
      const audioStreams: any[] = data.audioStreams || []
      if (!audioStreams.length) continue

      const best = audioStreams.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0]

      return NextResponse.json({
        url: best.url,
        mimeType: best.mimeType || 'audio/webm',
        bitrate: best.bitrate,
      })
    } catch {
      continue
    }
  }

  return NextResponse.json({ error: 'Semua Piped instance gagal' }, { status: 502 })
    }
        
