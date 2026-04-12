'use client'
import { useEffect, useState } from 'react'
import { X, Mic2, Music2 } from 'lucide-react'
import { Track } from '@/types'

interface Props {
  track: Track
  onClose: () => void
}

export function LyricsModal({ track, onClose }: Props) {
  const [lyrics, setLyrics] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setLyrics(null)
    fetch(`/api/lyrics?artist=${encodeURIComponent(track.artist)}&title=${encodeURIComponent(track.title)}`)
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then(d => {
        setLyrics(d.lyrics || null)
      })
      .catch(() => {
        setError(true)
        setLyrics(null)
      })
      .finally(() => setLoading(false))
  }, [track.id])

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative z-10 bg-[#141414] border border-white/[0.08] rounded-t-2xl md:rounded-2xl
                   w-full md:w-[500px] max-h-[85vh] flex flex-col overflow-hidden"
        style={{ animation: 'slideUp 0.28s ease both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
              {track.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music2 size={16} className="text-white/20" />
                </div>
              )}
            </div>
            <div>
              <p className="text-[13.5px] font-semibold truncate max-w-[260px]">{track.title}</p>
              <p className="text-[11.5px] text-white/40">{track.artist}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors ml-2">
            <X size={18} />
          </button>
        </div>

        {/* Lyrics label */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-1">
          <Mic2 size={13} className="text-green flex-shrink-0" />
          <span className="text-[11px] tracking-widest uppercase text-white/30 font-semibold">Lirik</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {loading ? (
            <div className="flex flex-col gap-3 animate-pulse pt-3">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 bg-white/[0.06] rounded"
                  style={{ width: `${50 + (i % 5) * 10}%` }}
                />
              ))}
            </div>
          ) : lyrics ? (
            <pre className="text-[14.5px] text-white/80 leading-[1.9] whitespace-pre-wrap font-sans pt-2">
              {lyrics}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/25">
              <Mic2 size={36} />
              <p className="text-[13px] text-center">
                {error ? 'Gagal mengambil lirik.\nCoba lagi nanti.' : 'Lirik tidak ditemukan untuk lagu ini.'}
              </p>
              <p className="text-[11px] text-white/15 text-center max-w-[200px]">
                Cari &quot;{track.title} lyrics&quot; di browser untuk lirik lengkap
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
