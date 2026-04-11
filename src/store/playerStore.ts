'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Track } from '@/types'

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  progress: number
  favorites: Track[]
  playlists: { id: string; name: string; tracks: Track[] }[]
  isSidebarOpen: boolean

  setTrack: (track: Track) => void
  setQueue: (tracks: Track[]) => void
  playNext: () => void
  playPrev: () => void
  togglePlay: () => void
  setVolume: (v: number) => void
  setProgress: (p: number) => void
  toggleFavorite: (track: Track) => void
  isFavorite: (id: string) => boolean
  addToPlaylist: (playlistId: string, track: Track) => void
  createPlaylist: (name: string) => void
  setSidebarOpen: (open: boolean) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      isPlaying: false,
      volume: 0.8,
      progress: 0,
      favorites: [],
      playlists: [
        { id: 'pl-1', name: 'Chill Vibes', tracks: [] },
        { id: 'pl-2', name: 'Late Night Drive', tracks: [] },
        { id: 'pl-3', name: 'Workout Mix', tracks: [] },
      ],
      isSidebarOpen: false,

      setTrack: (track) => set({ currentTrack: track, isPlaying: true }),

      setQueue: (tracks) => set({ queue: tracks }),

      playNext: () => {
        const { queue, currentTrack } = get()
        if (!currentTrack || queue.length === 0) return
        const idx = queue.findIndex((t) => t.id === currentTrack.id)
        const next = queue[idx + 1] || queue[0]
        set({ currentTrack: next, isPlaying: true })
      },

      playPrev: () => {
        const { queue, currentTrack } = get()
        if (!currentTrack || queue.length === 0) return
        const idx = queue.findIndex((t) => t.id === currentTrack.id)
        const prev = queue[idx - 1] || queue[queue.length - 1]
        set({ currentTrack: prev, isPlaying: true })
      },

      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

      setVolume: (volume) => set({ volume }),

      setProgress: (progress) => set({ progress }),

      toggleFavorite: (track) =>
        set((s) => {
          const exists = s.favorites.find((f) => f.id === track.id)
          return {
            favorites: exists
              ? s.favorites.filter((f) => f.id !== track.id)
              : [...s.favorites, track],
          }
        }),

      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      createPlaylist: (name) =>
        set((s) => ({
          playlists: [
            ...s.playlists,
            { id: `pl-${Date.now()}`, name, tracks: [] },
          ],
        })),

      addToPlaylist: (playlistId, track) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: [...p.tracks.filter((t) => t.id !== track.id), track] }
              : p
          ),
        })),

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: 'soundwave-storage',
      partialize: (s) => ({ favorites: s.favorites, playlists: s.playlists, volume: s.volume }),
    }
  )
)
