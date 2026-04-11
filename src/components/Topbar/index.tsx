'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, Music2 } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'

interface Props {
  title?: string
  showSearch?: boolean
}

export function Topbar({ title, showSearch = true }: Props) {
  const { setSidebarOpen } = usePlayerStore()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-10 bg-base/90 backdrop-blur-md border-b border-white/[0.06] flex items-center px-4 h-14 gap-3">
      {/* Mobile menu */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-white/50 hover:text-white transition-colors flex-shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* Logo (mobile) */}
      <Link href="/" className="md:hidden flex items-center gap-1.5 flex-shrink-0">
        <div className="w-6 h-6 bg-[#ededed] rounded-md flex items-center justify-center">
          <Music2 size={11} className="text-black" />
        </div>
        <span className="text-[14px] font-semibold tracking-tight">{title || 'SoundWave'}</span>
      </Link>

      {/* Desktop title */}
      {title && (
        <h1 className="hidden md:block text-[15px] font-semibold tracking-tight">{title}</h1>
      )}

      <div className="flex-1" />

      {/* Search shortcut */}
      {showSearch && (
        <button
          onClick={() => router.push('/search')}
          className="w-8 h-8 rounded-lg bg-elevated border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <Search size={14} />
        </button>
      )}
    </header>
  )
      }
          
