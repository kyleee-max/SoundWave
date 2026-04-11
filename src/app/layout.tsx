import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Sidebar } from '@/components/Sidebar'
import { BottomNav } from '@/components/BottomNav'
import { Player } from '@/components/Player'
import { MobileSidebarOverlay } from '@/components/Sidebar/MobileSidebarOverlay'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'SoundWave',
  description: 'Discover & stream music powered by YouTube',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-base text-[#ededed] font-sans overflow-hidden h-screen">
        <Providers>
          <div className="flex h-screen w-screen overflow-hidden">

            {/* Desktop Sidebar — hidden on mobile */}
            <div className="hidden md:flex md:flex-shrink-0">
              <Sidebar />
            </div>

            {/* Mobile Sidebar overlay */}
            <MobileSidebarOverlay />

            {/* Main area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              {/* Page content */}
              <main
                className="flex-1 overflow-y-auto"
                style={{
                  paddingBottom: 'calc(var(--player-height) + var(--bottomnav-height) + env(safe-area-inset-bottom))'
                }}
              >
                {children}
              </main>

              {/* Player — always visible */}
              <Player />
            </div>
          </div>

          {/* Mobile Bottom Nav */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
