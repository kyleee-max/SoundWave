'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X, Clock } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { SongCard } from '@/components/SongCard'
import { usePlayerStore } from '@/store/playerStore'
import { Track } from '@/types'

const QUICK_SEARCHES = [
  'Pop Hits 2024', 'Hip Hop Trending', 'Chill Lo-Fi', 'K-Pop Hits',
  'Indonesian Pop', 'EDM Bangers', 'R&B Soul', 'Rock Classics',
]

async function search(q: string): Promise<Track[]> {
  const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.tracks
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { searchHistory, addSearchHistory, clearSearchHistory } = usePlayerStore()

  // Handle ?q= param on load (dari history page)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      setQuery(q)
      setSubmitted(q)
    }
  }, [])

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['search', submitted],
    queryFn: () => search(submitted),
    enabled: submitted.length > 0,
  })

  const handleSubmit = useCallback((q: string) => {
    const clean = q.trim()
    if (!clean) return
    setQuery(clean)
    setSubmitted(clean)
    addSearchHistory(clean)
  }, [addSearchHistory])

  const clear = () => {
    setQuery('')
    setSubmitted('')
    inputRef.current?.focus()
  }

  const showHistory = !submitted && searchHistory.length > 0

  return (
    <div className="min-h-full">
      <Topbar title="Search" showSearch={false} />

      <div className="px-4 md:px-6 py-5 space-y-6 max-w-4xl mx-auto">

        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit(query)}
            placeholder="Search songs, artists..."
            className="w-full bg-elevated border border-white/[0.08] rounded-xl px-4 py-3 pl-10 pr-10
                       text-[14px] text-[#ededed] placeholder:text-white/25 outline-none
                       focus:border-white/[0.18] transition-colors"
            autoFocus
          />
          {query && (
            <button onClick={clear} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Search history */}
        {showHistory && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-white/30">Recent Searches</h2>
              <button
                onClick={clearSearchHistory}
                className="text-[11px] text-white/25 hover:text-white/50 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-0.5">
              {searchHistory.slice(0, 8).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(q)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left group"
                >
                  <Clock size={13} className="text-white/25 flex-shrink-0" />
                  <span className="text-[13.5px] text-white/60 group-hover:text-[#ededed] transition-colors truncate">
                    {q}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Quick searches */}
        {!submitted && !showHistory && (
          <section>
            <h2 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-white/30 mb-3">Quick Search</h2>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCHES.map(q => (
                <button
                  key={q}
                  onClick={() => handleSubmit(q)}
                  className="px-3.5 py-2 bg-card border border-white/[0.07] rounded-lg text-[13px] text-white/50
                             hover:border-white/[0.18] hover:text-[#ededed] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Quick searches below history */}
        {!submitted && showHistory && (
          <section>
            <h2 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-white/30 mb-3">Quick Search</h2>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCHES.map(q => (
                <button
                  key={q}
                  onClick={() => handleSubmit(q)}
                  className="px-3.5 py-2 bg-card border border-white/[0.07] rounded-lg text-[13px] text-white/50
                             hover:border-white/[0.18] hover:text-[#ededed] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {submitted && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold">
                {isLoading ? 'Searching...' : `Results for "${submitted}"`}
              </h2>
              {!isLoading && <span className="text-[12px] text-white/30">{tracks.length} tracks</span>}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card border border-white/[0.05] rounded-xl p-3 animate-pulse">
                    <div className="aspect-square rounded-lg bg-white/[0.06] mb-3" />
                    <div className="h-3 bg-white/[0.06] rounded mb-2 w-3/4" />
                    <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : tracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/25">
                <Search size={36} />
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {tracks.map((track, i) => (
                  <SongCard key={track.id} track={track} index={i} queue={tracks} />
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  )
}
