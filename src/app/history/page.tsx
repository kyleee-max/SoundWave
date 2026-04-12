'use client'
import { useState } from 'react'
import { Clock, Search, Trash2, Music2 } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { TrackTable } from '@/components/TrackTable'
import { usePlayerStore } from '@/store/playerStore'
import clsx from 'clsx'

type Tab = 'play' | 'search'

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>('play')
  const {
    playHistory, searchHistory,
    clearPlayHistory, clearSearchHistory,
    setTrack, setQueue, addSearchHistory,
  } = usePlayerStore()

  function playFromHistory(index: number) {
    setQueue(playHistory)
    setTrack(playHistory[index])
  }

  function searchFromHistory(q: string) {
    addSearchHistory(q)
    window.location.href = `/search?q=${encodeURIComponent(q)}`
  }

  return (
    <div className="min-h-full">
      <Topbar title="History" />

      <div className="px-4 md:px-6 py-5 max-w-4xl mx-auto space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-elevated border border-white/[0.06] rounded-xl p-1 w-fit">
          {(['play', 'search'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors',
                tab === t
                  ? 'bg-white/[0.09] text-[#ededed]'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              {t === 'play' ? <Clock size={14} /> : <Search size={14} />}
              {t === 'play' ? 'Recently Played' : 'Search History'}
            </button>
          ))}
        </div>

        {/* Play history */}
        {tab === 'play' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] text-white/40">{playHistory.length} tracks</p>
              {playHistory.length > 0 && (
                <button
                  onClick={clearPlayHistory}
                  className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors"
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              )}
            </div>

            {playHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/25">
                <Music2 size={40} />
                <p className="text-[14px]">Belum ada riwayat</p>
                <p className="text-[12px]">Putar lagu dulu yuk</p>
              </div>
            ) : (
              <TrackTable tracks={playHistory} />
            )}
          </section>
        )}

        {/* Search history */}
        {tab === 'search' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] text-white/40">{searchHistory.length} pencarian</p>
              {searchHistory.length > 0 && (
                <button
                  onClick={clearSearchHistory}
                  className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors"
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/25">
                <Search size={40} />
                <p className="text-[14px]">Belum ada histori pencarian</p>
              </div>
            ) : (
              <div className="space-y-1">
                {searchHistory.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => searchFromHistory(q)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors text-left group"
                  >
                    <Clock size={14} className="text-white/25 flex-shrink-0" />
                    <span className="text-[13.5px] text-white/70 group-hover:text-[#ededed] transition-colors truncate flex-1">
                      {q}
                    </span>
                    <Search size={13} className="text-white/0 group-hover:text-white/30 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  )
}
