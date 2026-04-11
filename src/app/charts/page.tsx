'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { TrackTable } from '@/components/TrackTable'
import { FilterChips } from '@/components/FilterChips'
import { Track } from '@/types'

const REGIONS = [
  { label: 'Global' },
  { label: 'Indonesia' },
  { label: 'USA' },
  { label: 'Korea' },
  { label: 'UK' },
  { label: 'Japan' },
]

const regionQuery: Record<string, string> = {
  Global:    'top hits 2024 global',
  Indonesia: 'lagu indonesia terpopuler 2024',
  USA:       'us top hits 2024',
  Korea:     'kpop chart 2024',
  UK:        'uk top hits 2024',
  Japan:     'j-pop chart 2024',
}

async function fetchCharts(region: string): Promise<Track[]> {
  const q = regionQuery[region] || 'top hits'
  const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.tracks
}

export default function ChartsPage() {
  const [region, setRegion] = useState('Global')

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['charts', region],
    queryFn: () => fetchCharts(region),
  })

  return (
    <div className="min-h-full">
      <Topbar title="Charts" />

      <div className="px-4 md:px-6 py-5 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-elevated border border-white/[0.08] flex items-center justify-center">
            <TrendingUp size={20} className="text-green" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Top Charts</h1>
            <p className="text-[12.5px] text-white/40">Updated daily from YouTube</p>
          </div>
        </div>

        {/* Region filter */}
        <FilterChips
          items={REGIONS as any}
          value={region as any}
          onChange={(v: any) => setRegion(v)}
        />

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-14 bg-white/[0.03] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            <p className="text-[12px] text-white/30 mb-3">{tracks.length} tracks • {region}</p>
            <TrackTable tracks={tracks} />
          </div>
        )}
      </div>
    </div>
  )
  }
    
