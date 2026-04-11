'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Topbar } from '@/components/Topbar'
import { FilterChips } from '@/components/FilterChips'
import { SongCard } from '@/components/SongCard'
import { TrackTable } from '@/components/TrackTable'
import { Play, TrendingUp } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { Track, Genre, Mood } from '@/types'

const GENRES: { label: Genre; dot: string }[] = [
  { label: 'All',        dot: '#ededed' },
  { label: 'Pop',        dot: '#1db954' },
  { label: 'Hip-Hop',    dot: '#6366f1' },
  { label: 'R&B',        dot: '#ec4899' },
  { label: 'Electronic', dot: '#f59e0b' },
  { label: 'Rock',       dot: '#ef4444' },
  { label: 'Jazz',       dot: '#06b6d4' },
  { label: 'K-Pop',      dot: '#a78bfa' },
  { label: 'Indie',      dot: '#34d399' },
  { label: 'Lo-Fi',      dot: '#fb923c' },
]

const MOODS: { label: Mood; emoji: string }[] = [
  { label: 'Chill',       emoji: '😌' },
  { label: 'Feel Good',   emoji: '☀️' },
  { label: 'Workout',     emoji: '💪' },
  { label: 'Focus',       emoji: '📚' },
  { label: 'Late Night',  emoji: '🌙' },
  { label: 'Party',       emoji: '🎉' },
  { label: 'Heartbreak',  emoji: '💔' },
  { label: 'Hype',        emoji: '🔥' },
]

async function fetchTracks(genre?: string, mood?: string): Promise<Track[]> {
  const params = new URLSearchParams()
  if (genre && genre !== 'All') params.set('genre', genre)
  if (mood) params.set('mood', mood)
  const res = await fetch(`/api/youtube/trending?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.tracks
}

export default function HomePage() {
  const [genre, setGenre] = useState<Genre>('All')
  const [mood, setMood] = useState<Mood | ''>('')
  const { setTrack, setQueue } = usePlayerStore()

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['trending', genre, mood],
    queryFn: () => fetchTracks(genre !== 'All' ? genre : undefined, mood || undefined),
  })

  function playAll() {
    if (!tracks.length) return
    setQueue(tracks)
    setTrack(tracks[0])
  }

  function handleGenre(g: Genre) {
    setGenre(g)
    setMood('')
  }

  function handleMood(m: Mood) {
    setMood(prev => prev === m ? '' : m)
    setGenre('All')
  }

  const cardTracks = tracks.slice(0, 12)
  const tableTracks = tracks.slice(0, 10)

  return (
    <div className="min-h-full">
      <Topbar />

      <div className="px-4 md:px-6 py-5 space-y-7 max-w-6xl mx-auto">

        {/* Hero */}
        <div
          className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, #0d1f0d 0%, #111 60%)',
            border: '1px solid rgba(29,185,84,0.15)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, #1db954, transparent 70%)' }}
          />
          <div className="relative z-10 max-w-md">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-green mb-2">🔥 Trending Now</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-2">
              Discover Your Next<br />Favorite Track
            </h1>
            <p className="text-[13.5px] text-white/50 mb-5">
              Powered by YouTube Music — millions of songs, zero limits.
            </p>
            <button
              onClick={playAll}
              className="inline-flex items-center gap-2 bg-[#ededed] text-black rounded-lg px-5 py-2.5 text-[13px] font-semibold hover:bg-white transition-colors"
            >
              <Play size={13} fill="black" />
              Play All
            </button>
          </div>
        </div>

        {/* Genre filter */}
        <section className="anim-fade-up" style={{ animationDelay: '0.05s' }}>
          <h2 className="text-[13px] font-semibold text-white/60 uppercase tracking-[0.08em] mb-3">Genre</h2>
          <FilterChips items={GENRES} value={genre} onChange={handleGenre} />
        </section>

        {/* Mood filter */}
        <section className="anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-[13px] font-semibold text-white/60 uppercase tracking-[0.08em] mb-3">Mood & Vibe</h2>
          <FilterChips
            items={MOODS}
            value={mood as Mood}
            onChange={handleMood}
          />
        </section>

        {/* Cards grid */}
        <section className="anim-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold tracking-tight">
              {mood ? `${MOODS.find(m => m.label === mood)?.emoji} ${mood}` : genre === 'All' ? 'Trending Right Now' : genre}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-card border border-white/[0.05] rounded-xl p-3 animate-pulse">
                  <div className="aspect-square rounded-lg bg-white/[0.06] mb-3" />
                  <div className="h-3 bg-white/[0.06] rounded mb-2 w-3/4" />
                  <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {cardTracks.map((track, i) => (
                <SongCard key={track.id} track={track} index={i} queue={tracks} />
              ))}
            </div>
          )}
        </section>

        {/* Top tracks table */}
        <section className="anim-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-green" />
            <h2 className="text-[15px] font-semibold tracking-tight">Top Tracks</h2>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-white/[0.03] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <TrackTable tracks={tableTracks} />
          )}
        </section>

      </div>
    </div>
  )
}
