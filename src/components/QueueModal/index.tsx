'use client'
import Image from 'next/image'
import { X, Music2, Play } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import clsx from 'clsx'

interface Props {
  onClose: () => void
}

export function QueueModal({ onClose }: Props) {
  const { queue, currentTrack, setTrack, isPlaying } = usePlayerStore()

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-[#141414] border border-white/[0.08] rounded-t-2xl md:rounded-2xl
                      w-full md:w-[420px] max-h-[75vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06] flex-shrink-0">
          <div>
            <p className="text-[15px] font-semibold">Queue</p>
            <p className="text-[12px] text-white/35 mt-0.5">{queue.length} tracks</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Track list */}
        <div className="flex-1 overflow-y-auto py-2">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/25">
              <Music2 size={32} />
              <p className="text-[13px]">Queue is empty</p>
            </div>
          ) : (
            queue.map((track, i) => {
              const isActive = currentTrack?.id === track.id
              return (
                <div
                  key={`${track.id}-${i}`}
                  onClick={() => { setTrack(track); onClose() }}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                    isActive ? 'bg-green/[0.08]' : 'hover:bg-white/[0.04]'
                  )}
                >
                  <div className="relative w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-elevated">
                    {track.thumbnail ? (
                      <Image src={track.thumbnail} alt={track.title} width={36} height={36} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music2 size={14} className="text-white/20" />
                      </div>
                    )}
                    {isActive && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="eq-bar"><span /><span /><span /></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-[13px] font-[450] truncate', isActive ? 'text-green' : 'text-[#ededed]')}>
                      {track.title}
                    </p>
                    <p className="text-[11.5px] text-white/40 truncate">{track.artist}</p>
                  </div>
                  {isActive ? (
                    <Play size={12} className="text-green flex-shrink-0" fill="currentColor" />
                  ) : (
                    <span className="text-[11px] text-white/25 font-mono flex-shrink-0">{track.duration || ''}</span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
        }
      
