'use client'
import { Heart, Music2 } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { TrackTable } from '@/components/TrackTable'
import { SongCard } from '@/components/SongCard'
import { usePlayerStore } from '@/store/playerStore'
import { Play } from 'lucide-react'

export default function FavoritesPage() {
  const { favorites, setTrack, setQueue } = usePlayerStore()

  function playAll() {
    if (!favorites.length) return
    setQueue(favorites)
    setTrack(favorites[0])
  }

  return (
    <div className="min-h-full">
      <Topbar title="Favorites" />

      <div className="px-4 md:px-6 py-5 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-green/[0.12] border border-green/20 flex items-center justify-center flex-shrink-0">
            <Heart size={28} className="text-green" fill="currentColor" />
          </div>
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-[0.08em] font-semibold mb-1">Playlist</p>
            <h1 className="text-2xl font-bold tracking-tight">Liked Songs</h1>
            <p className="text-[13px] text-white/40 mt-1">{favorites.length} songs</p>
          </div>
        </div>

        {/* Play button */}
        {favorites.length > 0 && (
          <button
            onClick={playAll}
            className="inline-flex items-center gap-2 bg-green text-black rounded-full px-6 py-2.5 text-[13px] font-semibold hover:bg-green/90 transition-colors"
          >
            <Play size={13} fill="black" />
            Play All
          </button>
        )}

        {/* Tracks */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/25">
            <Heart size={48} />
            <div className="text-center">
              <p className="text-[15px] font-medium mb-1">No liked songs yet</p>
              <p className="text-[13px]">Tap the heart on any song to save it here</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              {favorites.map((t, i) => (
                <SongCard key={t.id} track={t} index={i} queue={favorites} />
              ))}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block">
              <TrackTable tracks={favorites} />
            </div>
          </>
        )}
      </div>
    </div>
  )
        }
    
