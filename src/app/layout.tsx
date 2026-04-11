import type { Metadata } from 'next'
  import { Inter } from 'next/font/google'
  import './globals.css'
  import { Providers } from './providers'
  import { Sidebar } from '@/components/Sidebar'
  import { BottomNav } from '@/components/BottomNav'
  import { Player } from '@/components/Player'
  import { MobileSidebarOverlay } from '@/components/Sidebar/MobileSidebarOverlay'

  const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

  export const metadata: Metadata = {
    title: 'SoundWave',
    description: 'Discover & stream music powered by YouTube',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    manifest: '/manifest.json',
    themeColor: '#7c3aed',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'SoundWave',
    },
    icons: {
      apple: '/icon-192x192.png',
    },
  }

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en" className={`${inter.variable}`}>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#7c3aed" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="SoundWave" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </head>
        <body className="bg-base text-[#ededed] font-sans overflow-hidden h-screen">
          <Providers>
            <div className="flex h-screen w-screen overflow-hidden">
              <div className="hidden md:flex md:flex-shrink-0">
                <Sidebar />
              </div>
              <MobileSidebarOverlay />
              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <main
                  className="flex-1 overflow-y-auto"
                  style={{
                    paddingBottom: 'calc(var(--player-height) + var(--bottomnav-height) + env(safe-area-inset-bottom))'
                  }}
                >
                  {children}
                </main>
                <Player />
              </div>
            </div>
            <BottomNav />
          </Providers>
        </body>
      </html>
    )
  }
  
