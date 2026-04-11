'use client'
import Image from 'next/image'
import { Play, Heart, Plus } from 'lucide-react'
import { Track } from '@/types'
import { usePlayerStore } from '@/store/playerStore'
import clsx from 'clsx'

const GRADIENTS = ['gradient-1','gradient-2','gradient-3','gradient-4','gradient-5','gradient-6','gradient-7','gradient-8']

interface Props {
  track: Track
  index?: number
  queue?: Track[]
}

export function SongCard({ track, index = 0, queue = [] }: Props) {
  const { setTrack, setQueue, toggleFavorite, isFavorite, currentTrack, isPlaying } = usePlayerStore()
  const isActive = currentTrack?.id === track.id
  const fav = isFavorite(track.id)

  function play() {
    setQueue(queue.length ? queue : [track])
    setTrack(track)
  }

  return (
    <div
      className={clsx(
        'group bg-card border rounded-xl p-3 cursor-pointer transition-all duration-200',
        isActive ? 'border-green/30 bg-green/[0.04]' : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-elevated hover:-translate-y-0.5'
      )}
      onClick={play}
    >
      {/* Art */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
        {track.thumbnail ? (
          <Image
            src={track.thumbnail}
            alt={track.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div className={clsx('w-full h-full', GRADIENTS[index % GRADIENTS.length])} />
        )}

        {/* Play overlay */}
        <div className={clsx(
          'absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200',
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          {isActive && isPlaying ? (
            <div className="eq-bar">
              <span /><span /><span />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#ededed] flex items-center justify-center shadow-lg">
              <Play size={14} className="text-black ml-0.5" fill="black" />
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p className={clsx('text-[13px] font-[500] truncate', isActive && 'text-green')}>{track.title}</p>
          <p className="text-[11.5px] text-white/40 truncate mt-0.5">{track.artist}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track) }}
          className={clsx('flex-shrink-0 mt-0.5 transition-colors', fav ? 'text-green' : 'text-white/20 hover:text-white/50')}
        >
          <Heart size={13} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {track.duration && (
        <p className="text-[10.5px] text-white/25 mt-1 font-mono">{track.duration}</p>
      )}
    </div>
  )
          }
