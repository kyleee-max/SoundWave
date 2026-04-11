'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, TrendingUp, Menu } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import clsx from 'clsx'

const NAV = [
  { href: '/',          icon: Home,       label: 'Home' },
  { href: '/search',    icon: Search,     label: 'Search' },
  { href: '/favorites', icon: Heart,      label: 'Favs' },
  { href: '/charts',    icon: TrendingUp, label: 'Charts' },
]

export function BottomNav() {
  const pathname = usePathname()
  const { setSidebarOpen } = usePlayerStore()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-white/[0.06] flex items-center"
      style={{
        height: 'calc(var(--bottomnav-height) + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            'flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors',
            pathname === href ? 'text-[#ededed]' : 'text-white/35'
          )}
        >
          <Icon size={20} strokeWidth={pathname === href ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}

      {/* Library / Menu trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-white/35 hover:text-white/60 transition-colors"
      >
        <Menu size={20} strokeWidth={1.8} />
        <span className="text-[10px] font-medium">More</span>
      </button>
    </nav>
  )
        }
    
