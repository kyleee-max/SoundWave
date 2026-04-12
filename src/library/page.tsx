'use client'
import Link from 'next/link'
import { Plus, Music2, Pencil, Trash2 } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { usePlayerStore } from '@/store/playerStore'

const GRADIENTS = ['gradient-1','gradient-2','gradient-3','gradient-4','gradient-5','gradient-6']

export default function LibraryPage() {
  const { playlists, createPlaylist, renamePlaylist, deletePlaylist } = usePlayerStore()

  function handleCreate() {
    const name = prompt('Nama playlist:')
    if (name?.trim()) createPlaylist(name.trim())
  }

  function handleRename(id: string, currentName: string) {
    const name = prompt('Nama baru:', currentName)
    if (name?.trim() && name.trim() !== currentName) renamePlaylist(id, name.trim())
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Hapus playlist "${name}"?`)) deletePlaylist(id)
  }

  return (
    <div className="min-h-full">
      <Topbar title="Library" />

      <div className="px-4 md:px-6 py-5 max-w-4xl mx-auto space-y-5">

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Your Library</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-elevated border border-white/[0.08] rounded-lg text-[12.5px] text-white/50 hover:text-[#ededed] hover:border-white/[0.18] transition-all"
          >
            <Plus size={14} />
            New Playlist
          </button>
        </div>

        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/25">
            <Music2 size={40} />
            <p className="text-[14px]">No playlists yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {playlists.map((pl, i) => (
              <div key={pl.id} className="group relative bg-card border border-white/[0.06] rounded-xl p-3 hover:border-white/[0.14] hover:bg-elevated transition-all">
                <Link href={`/playlist/${pl.id}`} className="block">
                  <div className={`aspect-square rounded-lg mb-3 ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                    <Music2 size={24} className="text-white/30" />
                  </div>
                  <p className="text-[13px] font-[500] truncate pr-6">{pl.name}</p>
                  <p className="text-[11.5px] text-white/35 mt-0.5">{pl.tracks.length} songs</p>
                </Link>

                {/* Action buttons — visible on hover */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.preventDefault(); handleRename(pl.id, pl.name) }}
                    className="w-7 h-7 bg-black/60 backdrop-blur-sm rounded-md flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    title="Rename"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDelete(pl.id, pl.name) }}
                    className="w-7 h-7 bg-black/60 backdrop-blur-sm rounded-md flex items-center justify-center text-white/50 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
    }
    
