'use client'
import { usePlayerStore } from '@/store/playerStore'
import { Sidebar } from './index'
import { X } from 'lucide-react'

export function MobileSidebarOverlay() {
  const { isSidebarOpen, setSidebarOpen } = usePlayerStore()

  if (!isSidebarOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="sidebar-overlay anim-fade-in"
        onClick={() => setSidebarOpen(false)}
      />
      {/* Drawer */}
      <div
        className="relative z-50 flex flex-col bg-surface border-r border-white/[0.06] w-[260px] h-full"
        style={{ animation: 'slideInLeft 0.25s ease both' }}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
        <Sidebar />
      </div>
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
      }
        
