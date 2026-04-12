'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Library, Heart, TrendingUp, Plus, Music2, Clock, Pencil, Trash2 } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import clsx from 'clsx'

const NAV = [
  { href: '/',          icon: Home,       label: 'Home' },
  { href: '/search',    icon: Search,     label: 'Search' },
  { href: '/library',   icon: Library,    label: 'Library' },
  { href: '/favorites', icon: Heart,      label: 'Favorites' },
  { href: '/charts',    icon: TrendingUp, label: 'Charts' },
  { href: '/history',   icon: Clock,      label: 'History' },
]

const GRADIENT_CLASSES = ['gradient-1','gradient-2','gradient-3','gradient-4','gradient-5','gradient-6']

export function Sidebar() {
  const pathname = usePathname()
  const { playlists, createPlaylist, renamePlaylist, deletePlaylist } = usePlayerStore()

  function handleRename(id: string, currentName: string) {
    const name = prompt('Nama baru:', currentName)
    if (name?.trim() && name.trim() !== currentName) renamePlaylist(id, name.trim())
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Hapus playlist "${name}"?`)) deletePlaylist(id)
  }

  return (
    <aside className="w-[240px] bg-surface border-r border-white/[0.06] flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 bg-[#ededed] rounded-[6px] flex items-center justify-center">
          <Music2 size={14} className="text-black" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">SoundWave</span>
      </div>

      {/* Nav */}
      <div className="px-2 py-3 border-b border-white/[0.06] flex-shrink-0">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-white/30 uppercase px-3 pb-1.5">Menu</p>
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13.5px] font-[450] transition-all',
              pathname === href
                ? 'bg-white/[0.08] text-[#ededed]'
                : 'text-white/50 hover:bg-white/[0.05] hover:text-[#ededed]'
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      {/* Playlists */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="flex items-center justify-between px-3 pb-1.5">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-white/30 uppercase">Playlists</p>
          <button
            onClick={() => {
              const name = prompt('Nama playlist:')
              if (name?.trim()) createPlaylist(name.trim())
            }}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {playlists.map((pl, i) => (
          <div key={pl.id} className="group flex items-center gap-2.5 px-3 py-[6px] rounded-lg hover:bg-white/[0.05] transition-all">
            <Link href={`/playlist/${pl.id}`} className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className={clsx('w-8 h-8 rounded-[4px] flex-shrink-0', GRADIENT_CLASSES[i % GRADIENT_CLASSES.length])} />
              <div className="min-w-0">
                <p className="text-[13px] font-[450] text-white/50 group-hover:text-[#ededed] transition-colors truncate">{pl.name}</p>
                <p className="text-[11px] text-white/25 mt-0.5">{pl.tracks.length} songs</p>
              </div>
            </Link>
            {/* Inline actions on hover */}
            <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => handleRename(pl.id, pl.name)}
                className="p-1 text-white/30 hover:text-white transition-colors"
                title="Rename"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={() => handleDelete(pl.id, pl.name)}
                className="p-1 text-white/30 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
  
