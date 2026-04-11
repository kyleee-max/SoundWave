'use client'
import { use } from 'react'
import { notFound } from 'next/navigation'
import { Play, Music2, Trash2 } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { TrackTable } from '@/components/TrackTable'
import { SongCard } from '@/components/SongCard'
import { usePlayerStore } from '@/store/playerStore'

const GRADIENTS = ['gradient-1','gradient-2','gradient-3','gradient-4','gradient-5','gradient-6']

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { playlists, setTrack, setQueue } = usePlayerStore()

  const playlist = playlists.find(p => p.id === id)
  const plIndex = playlists.findIndex(p => p.id === id)

  if (!playlist) return notFound()

  function playAll() {
    if (!playlist || !playlist.tracks.length) return
    setQueue(playlist.tracks)
    setTrack(playlist.tracks[0])
  }

  return (
    <div className="min-h-full">
      <Topbar title={playlist.name} />

      <div className="px-4 md:px-6 py-5 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex-shrink-0 ${GRADIENTS[plIndex % GRADIENTS.length]}`} />
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-[0.08em] font-semibold mb-1">Playlist</p>
            <h1 className="text-2xl font-bold tracking-tight">{playlist.name}</h1>
            <p className="text-[13px] text-white/40 mt-1">{playlist.tracks.length} songs</p>
          </div>
        </div>

        {/* Play */}
        {playlist.tracks.length > 0 && (
          <button
            onClick={playAll}
            className="inline-flex items-center gap-2 bg-green text-black rounded-full px-6 py-2.5 text-[13px] font-semibold hover:bg-green/90 transition-colors"
          >
            <Play size={13} fill="black" />
            Play All
          </button>
        )}

        {/* Tracks */}
        {playlist.tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/25">
            <Music2 size={40} />
            <p className="text-[14px]">No songs in this playlist yet</p>
            <p className="text-[12px]">Search for songs and add them here</p>
          </div>
        ) : (
          <>
            <div className="md:hidden grid grid-cols-2 gap-3">
              {playlist.tracks.map((t, i) => (
                <SongCard key={t.id} track={t} index={i} queue={playlist.tracks} />
              ))}
            </div>
            <div className="hidden md:block">
              <TrackTable tracks={playlist.tracks} />
            </div>
          </>
        )}
      </div>
    </div>
  )
    }
  
