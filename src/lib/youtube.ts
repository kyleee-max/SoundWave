import { Track } from '@/types'

const API_KEY = process.env.YT_V3_KEY
const BASE = 'https://www.googleapis.com/youtube/v3'

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  const mm = h > 0 ? `${h}:${String(m).padStart(2, '0')}` : `${m}`
  return `${mm}:${String(s).padStart(2, '0')}`
}

function itemToTrack(item: any): Track {
  const vid = item.id?.videoId || item.id
  const snip = item.snippet
  return {
    id: vid,
    videoId: vid,
    title: snip.title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
    artist: snip.channelTitle,
    thumbnail:
      snip.thumbnails?.high?.url ||
      snip.thumbnails?.medium?.url ||
      snip.thumbnails?.default?.url ||
      '',
    channelId: snip.channelId,
  }
}

export async function searchYoutube(query: string, pageToken?: string): Promise<{ tracks: Track[]; nextPageToken?: string }> {
  if (!API_KEY) throw new Error('YT_V3_KEY not set')

  const params = new URLSearchParams({
    part: 'snippet',
    q: `${query} official audio`,
    type: 'video',
    videoCategoryId: '10',
    maxResults: '20',
    key: API_KEY,
    ...(pageToken ? { pageToken } : {}),
  })

  const res = await fetch(`${BASE}/search?${params}`, { next: { revalidate: 300 } })
  const data = await res.json()

  if (!res.ok) throw new Error(data.error?.message || 'YouTube search failed')

  const videoIds = data.items.map((i: any) => i.id.videoId).join(',')
  const detailsParams = new URLSearchParams({ part: 'contentDetails', id: videoIds, key: API_KEY })
  const detailsRes = await fetch(`${BASE}/videos?${detailsParams}`, { next: { revalidate: 300 } })
  const details = await detailsRes.json()

  const durationMap: Record<string, string> = {}
  details.items?.forEach((v: any) => {
    durationMap[v.id] = parseDuration(v.contentDetails.duration)
  })

  const tracks: Track[] = data.items.map((item: any) => ({
    ...itemToTrack(item),
    duration: durationMap[item.id.videoId] || '',
  }))

  return { tracks, nextPageToken: data.nextPageToken }
}

export async function getTrending(): Promise<Track[]> {
  if (!API_KEY) throw new Error('YT_V3_KEY not set')

  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    chart: 'mostPopular',
    videoCategoryId: '10',
    regionCode: 'ID',
    maxResults: '20',
    key: API_KEY,
  })

  const res = await fetch(`${BASE}/videos?${params}`, { next: { revalidate: 600 } })
  const data = await res.json()

  if (!res.ok) throw new Error(data.error?.message || 'YouTube trending failed')

  return data.items.map((item: any) => ({
    id: item.id,
    videoId: item.id,
    title: item.snippet.title.replace(/&amp;/g, '&').replace(/&#39;/g, "'"),
    artist: item.snippet.channelTitle,
    thumbnail:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url || '',
    duration: parseDuration(item.contentDetails.duration),
    channelId: item.snippet.channelId,
  }))
}

export async function getGenreTracks(genre: string): Promise<Track[]> {
  const genreMap: Record<string, string> = {
    Pop: 'pop hits 2024',
    'Hip-Hop': 'hip hop hits 2024',
    'R&B': 'rnb soul hits 2024',
    Electronic: 'electronic dance music 2024',
    Rock: 'rock hits 2024',
    Jazz: 'jazz music 2024',
    'K-Pop': 'kpop hits 2024',
    Indie: 'indie music 2024',
    Classical: 'classical music',
    'Lo-Fi': 'lofi hip hop music',
  }
  const q = genreMap[genre] || `${genre} music`
  const result = await searchYoutube(q)
  return result.tracks
}

export async function getMoodTracks(mood: string): Promise<Track[]> {
  const moodMap: Record<string, string> = {
    'Late Night': 'late night vibes playlist',
    'Feel Good': 'feel good happy songs',
    Workout: 'workout gym music hype',
    Focus: 'focus study music concentration',
    Heartbreak: 'heartbreak sad songs',
    Party: 'party hits dance music',
    Chill: 'chill relaxing music',
    Hype: 'hype trap music 2024',
  }
  const q = moodMap[mood] || `${mood} music`
  const result = await searchYoutube(q)
  return result.tracks
}
