'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Track } from '@/types'

export type RepeatMode = 'off' | 'all' | 'one'

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  originalQueue: Track[]        // queue sebelum di-shuffle
  isPlaying: boolean
  volume: number
  progress: number
  isShuffle: boolean
  repeatMode: RepeatMode
  crossfadeDuration: number     // detik, 0 = off
  favorites: Track[]
  playlists: { id: string; name: string; tracks: Track[] }[]
  isSidebarOpen: boolean
  playHistory: Track[]          // histori lagu yang diputar
  searchHistory: string[]       // histori query search

  setTrack: (track: Track) => void
  setQueue: (tracks: Track[]) => void
  playNext: () => void
  playPrev: () => void
  togglePlay: () => void
  setVolume: (v: number) => void
  setProgress: (p: number) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  setCrossfade: (seconds: number) => void
  toggleFavorite: (track: Track) => void
  isFavorite: (id: string) => boolean
  addToPlaylist: (playlistId: string, track: Track) => void
  removeFromPlaylist: (playlistId: string, trackId: string) => void
  createPlaylist: (name: string) => void
  renamePlaylist: (playlistId: string, name: string) => void
  deletePlaylist: (playlistId: string) => void
  setSidebarOpen: (open: boolean) => void
  addPlayHistory: (track: Track) => void
  addSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  clearPlayHistory: () => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      originalQueue: [],
      isPlaying: false,
      volume: 0.8,
      progress: 0,
      isShuffle: false,
      repeatMode: 'off',
      crossfadeDuration: 0,
      favorites: [],
      playlists: [
        { id: 'pl-1', name: 'Chill Vibes', tracks: [] },
        { id: 'pl-2', name: 'Late Night Drive', tracks: [] },
        { id: 'pl-3', name: 'Workout Mix', tracks: [] },
      ],
      isSidebarOpen: false,
      playHistory: [],
      searchHistory: [],

      setTrack: (track) => {
        get().addPlayHistory(track)
        set({ currentTrack: track, isPlaying: true })
      },

      setQueue: (tracks) => {
        const { isShuffle } = get()
        if (isShuffle) {
          const shuffled = [...tracks].sort(() => Math.random() - 0.5)
          set({ queue: shuffled, originalQueue: tracks })
        } else {
          set({ queue: tracks, originalQueue: tracks })
        }
      },

      playNext: () => {
        const { queue, currentTrack, repeatMode } = get()
        if (!currentTrack || queue.length === 0) return
        if (repeatMode === 'one') {
          // repeat one: reload same track (signal via re-set)
          set({ currentTrack: { ...currentTrack }, isPlaying: true })
          return
        }
        const idx = queue.findIndex((t) => t.id === currentTrack.id)
        const isLast = idx === queue.length - 1
        if (isLast && repeatMode === 'off') {
          set({ isPlaying: false })
          return
        }
        const next = queue[(idx + 1) % queue.length]
        get().addPlayHistory(next)
        set({ currentTrack: next, isPlaying: true })
      },

      playPrev: () => {
        const { queue, currentTrack } = get()
        if (!currentTrack || queue.length === 0) return
        const idx = queue.findIndex((t) => t.id === currentTrack.id)
        const prev = queue[idx - 1] || queue[queue.length - 1]
        get().addPlayHistory(prev)
        set({ currentTrack: prev, isPlaying: true })
      },

      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

      setVolume: (volume) => set({ volume }),

      setProgress: (progress) => set({ progress }),

      toggleShuffle: () => {
        const { isShuffle, queue, originalQueue } = get()
        if (!isShuffle) {
          // enable shuffle
          const shuffled = [...queue].sort(() => Math.random() - 0.5)
          set({ isShuffle: true, queue: shuffled, originalQueue: queue })
        } else {
          // disable shuffle — restore original order
          set({ isShuffle: false, queue: originalQueue.length ? originalQueue : queue })
        }
      },

      cycleRepeat: () => {
        const { repeatMode } = get()
        const next: RepeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
        set({ repeatMode: next })
      },

      setCrossfade: (crossfadeDuration) => set({ crossfadeDuration }),

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

      renamePlaylist: (playlistId, name) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId ? { ...p, name } : p
          ),
        })),

      deletePlaylist: (playlistId) =>
        set((s) => ({
          playlists: s.playlists.filter((p) => p.id !== playlistId),
        })),

      addToPlaylist: (playlistId, track) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: [...p.tracks.filter((t) => t.id !== track.id), track] }
              : p
          ),
        })),

      removeFromPlaylist: (playlistId, trackId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
              : p
          ),
        })),

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      addPlayHistory: (track) =>
        set((s) => ({
          playHistory: [
            track,
            ...s.playHistory.filter((t) => t.id !== track.id),
          ].slice(0, 50),
        })),

      addSearchHistory: (query) => {
        const clean = query.trim()
        if (!clean) return
        set((s) => ({
          searchHistory: [
            clean,
            ...s.searchHistory.filter((q) => q !== clean),
          ].slice(0, 20),
        }))
      },

      clearSearchHistory: () => set({ searchHistory: [] }),

      clearPlayHistory: () => set({ playHistory: [] }),
    }),
    {
      name: 'soundwave-storage',
      partialize: (s) => ({
        favorites: s.favorites,
        playlists: s.playlists,
        volume: s.volume,
        isShuffle: s.isShuffle,
        repeatMode: s.repeatMode,
        crossfadeDuration: s.crossfadeDuration,
        playHistory: s.playHistory,
        searchHistory: s.searchHistory,
      }),
    }
  )
)
