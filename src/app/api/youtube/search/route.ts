import { NextRequest, NextResponse } from 'next/server'
import { searchYoutube } from '@/lib/youtube'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  const pageToken = req.nextUrl.searchParams.get('pageToken') || undefined

  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  try {
    const data = await searchYoutube(q, pageToken)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
