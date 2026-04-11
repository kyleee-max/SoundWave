export interface Track {
  id: string
  videoId: string
  title: string
  artist: string
  album?: string
  thumbnail: string
  duration?: string
  channelId?: string
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
  coverGradient?: string
}

export interface SearchResult {
  tracks: Track[]
  nextPageToken?: string
}

export type Genre =
  | 'All' | 'Pop' | 'Hip-Hop' | 'R&B' | 'Electronic'
  | 'Rock' | 'Jazz' | 'K-Pop' | 'Indie' | 'Classical' | 'Lo-Fi'

export type Mood =
  | 'Late Night' | 'Feel Good' | 'Workout' | 'Focus'
  | 'Heartbreak' | 'Party' | 'Chill' | 'Hype'
