'use client'
import { useEffect, useState } from 'react'
import { X, Mic2 } from 'lucide-react'
import { Track } from '@/types'

interface Props {
  track: Track
  onClose: () => void
}

export function LyricsModal({ track, onClose }: Props) {
  const [lyrics, setLyrics] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/lyrics?artist=${encodeURIComponent(track.artist)}&title=${encodeURIComponent(track.title)}`)
      .then(r => r.json())
      .then(d => { setLyrics(d.lyrics || null) })
      .catch(() => setLyrics(null))
      .finally(() => setLoading(false))
  }, [track.id])

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center anim-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative z-10 bg-surface border border-white/[0.08] rounded-t-2xl md:rounded-2xl
                   w-full md:w-[480px] max-h-[80vh] flex flex-col overflow-hidden"
        style={{ animation: 'slideUp 0.28s ease both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Mic2 size={16} className="text-green" />
            <div>
              <p className="text-[13.5px] font-semibold truncate">{track.title}</p>
              <p className="text-[11.5px] text-white/40">{track.artist}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="flex flex-col gap-2.5 animate-pulse">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-3 bg-white/[0.06] rounded" style={{ width: `${60 + Math.random() * 35}%` }} />
              ))}
            </div>
          ) : lyrics ? (
            <pre className="text-[14px] text-white/80 leading-7 whitespace-pre-wrap font-sans">
              {lyrics}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/30">
              <Mic2 size={32} />
              <p className="text-sm">Lyrics not found for this track</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
        }
            
