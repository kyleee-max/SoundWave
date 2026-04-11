'use client'
import Image from 'next/image'
import { Play, Heart } from 'lucide-react'
import { Track } from '@/types'
import { usePlayerStore } from '@/store/playerStore'
import clsx from 'clsx'

interface Props {
  tracks: Track[]
  showAlbum?: boolean
}

export function TrackTable({ tracks, showAlbum = false }: Props) {
  const { setTrack, setQueue, currentTrack, isPlaying, toggleFavorite, isFavorite } = usePlayerStore()

  function play(track: Track) {
    setQueue(tracks)
    setTrack(track)
  }

  return (
    <div className="w-full">
      {/* Header — hidden on mobile */}
      <div className="hidden md:grid grid-cols-[32px_1fr_auto_auto] gap-3 px-3 py-2 border-b border-white/[0.05] mb-1">
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/25">#</span>
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/25">Title</span>
        {showAlbum && <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/25 w-32 hidden lg:block">Album</span>}
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/25 text-right">Time</span>
      </div>

      {tracks.map((track, i) => {
        const isActive = currentTrack?.id === track.id
        const fav = isFavorite(track.id)

        return (
          <div
            key={track.id}
            onClick={() => play(track)}
            className={clsx(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
              isActive ? 'bg-green/[0.07]' : 'hover:bg-white/[0.04]'
            )}
          >
            {/* Number / eq */}
            <div className="w-8 flex-shrink-0 flex items-center justify-center">
              {isActive && isPlaying ? (
                <div className="eq-bar"><span /><span /><span /></div>
              ) : (
                <>
                  <span className={clsx('text-[12px] font-mono group-hover:hidden', isActive ? 'text-green' : 'text-white/30')}>
                    {i + 1}
                  </span>
                  <Play size={13} className="hidden group-hover:block text-white/70" fill="currentColor" />
                </>
              )}
            </div>

            {/* Thumb + info */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-elevated">
                {track.thumbnail && (
                  <Image src={track.thumbnail} alt={track.title} width={36} height={36} className="object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className={clsx('text-[13px] font-[450] truncate', isActive ? 'text-green' : 'text-[#ededed]')}>
                  {track.title}
                </p>
                <p className="text-[11.5px] text-white/40 truncate">{track.artist}</p>
              </div>
            </div>

            {/* Album - desktop only */}
            {showAlbum && (
              <p className="hidden lg:block text-[12px] text-white/35 w-32 truncate flex-shrink-0">
                {track.album || '—'}
              </p>
            )}

            {/* Fav + duration */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(track) }}
                className={clsx(
                  'transition-colors',
                  fav ? 'text-green' : 'text-white/0 group-hover:text-white/30 hover:!text-white/70'
                )}
              >
                <Heart size={13} fill={fav ? 'currentColor' : 'none'} />
              </button>
              {track.duration && (
                <span className="text-[11.5px] text-white/30 font-mono w-9 text-right">{track.duration}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
          }
                                                                                                               
