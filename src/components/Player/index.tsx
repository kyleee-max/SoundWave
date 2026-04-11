'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Heart, SkipBack, SkipForward, Play, Pause, Volume2, VolumeX, List, Mic2, Shuffle, Repeat } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { LyricsModal } from '@/components/LyricsModal'
import clsx from 'clsx'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function Player() {
  const {
    currentTrack, isPlaying, volume, progress,
    togglePlay, playNext, playPrev, setVolume, setProgress,
    toggleFavorite, isFavorite,
  } = usePlayerStore()

  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const intervalRef = useRef<any>(null)

  // Load YT IFrame API
  useEffect(() => {
    if (window.YT) { initPlayer(); return }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = initPlayer
  }, [])

  function initPlayer() {
    if (!containerRef.current) return
    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '1', width: '1',
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, rel: 0 },
      events: {
        onReady: () => {
          setReady(true)
          playerRef.current.setVolume(volume * 100)
        },
        onStateChange: (e: any) => {
          if (e.data === window.YT.PlayerState.ENDED) playNext()
        },
      },
    })
  }

  // Load new track
  useEffect(() => {
    if (!ready || !currentTrack) return
    playerRef.current.loadVideoById(currentTrack.videoId)
    setCurrentTime(0)
  }, [currentTrack?.videoId, ready])

  // Play/pause
  useEffect(() => {
    if (!ready || !currentTrack) return
    if (isPlaying) playerRef.current.playVideo()
    else playerRef.current.pauseVideo()
  }, [isPlaying, ready])

  // Volume
  useEffect(() => {
    if (!ready) return
    playerRef.current.setVolume(volume * 100)
  }, [volume, ready])

  // Progress polling
  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!ready || !isPlaying) return
    intervalRef.current = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.() || 0
      const d = playerRef.current?.getDuration?.() || 0
      setCurrentTime(t)
      setDuration(d)
    }, 500)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, ready])

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    playerRef.current?.seekTo(val, true)
    setCurrentTime(val)
  }, [])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <>
      {/* Hidden YT container */}
      <div ref={containerRef} className="hidden" />

      {/* Lyrics modal */}
      {showLyrics && currentTrack && (
        <LyricsModal track={currentTrack} onClose={() => setShowLyrics(false)} />
      )}

      {/* Player bar */}
      <div
        className={clsx(
          'fixed left-0 right-0 z-20 bg-surface border-t border-white/[0.06]',
          'flex items-center px-3 md:px-5 gap-3 md:gap-4',
          // On mobile, sits above bottom nav
          'md:bottom-0 bottom-[var(--bottomnav-height)]'
        )}
        style={{ height: 'var(--player-height)' }}
      >
        {/* Track info */}
        <div className="flex items-center gap-2.5 w-[160px] md:w-[220px] min-w-0 flex-shrink-0">
          {currentTrack ? (
            <>
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden flex-shrink-0 bg-elevated">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  width={44} height={44}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] md:text-[13px] font-[500] truncate">{currentTrack.title}</p>
                <p className="text-[11px] text-white/40 truncate mt-0.5">{currentTrack.artist}</p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrack)}
                className={clsx('ml-1 flex-shrink-0 transition-colors', isFavorite(currentTrack.id) ? 'text-green' : 'text-white/30 hover:text-white/60')}
              >
                <Heart size={14} fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} />
              </button>
            </>
          ) : (
            <p className="text-[12px] text-white/25">No track playing</p>
          )}
        </div>

        {/* Center controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1 md:gap-2">
            {/* Shuffle — hidden on smallest screens */}
            <button className="hidden sm:flex text-white/30 hover:text-white/70 transition-colors p-1.5">
              <Shuffle size={14} />
            </button>
            <button onClick={playPrev} className="text-white/60 hover:text-white transition-colors p-1.5">
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#ededed] flex items-center justify-center hover:bg-white transition-colors flex-shrink-0"
            >
              {isPlaying
                ? <Pause size={14} className="text-black" fill="black" />
                : <Play size={14} className="text-black ml-0.5" fill="black" />}
            </button>
            <button onClick={playNext} className="text-white/60 hover:text-white transition-colors p-1.5">
              <SkipForward size={18} />
            </button>
            <button className="hidden sm:flex text-white/30 hover:text-white/70 transition-colors p-1.5">
              <Repeat size={14} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 w-full max-w-[360px] md:max-w-[480px]">
            <span className="text-[10px] text-white/30 font-mono w-[28px] text-right flex-shrink-0">
              {fmt(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={seek}
              className="flex-1 h-[3px]"
              style={{
                background: duration
                  ? `linear-gradient(to right, #ededed ${(currentTime / duration) * 100}%, rgba(255,255,255,0.15) 0%)`
                  : 'rgba(255,255,255,0.15)',
              }}
            />
            <span className="text-[10px] text-white/30 font-mono w-[28px] flex-shrink-0">
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Right controls — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1.5 w-[180px] justify-end">
          <button
            onClick={() => setShowLyrics(true)}
            className="text-white/30 hover:text-white/70 transition-colors p-1.5"
            title="Lyrics"
          >
            <Mic2 size={15} />
          </button>
          <button className="text-white/30 hover:text-white/70 transition-colors p-1.5" title="Queue">
            <List size={15} />
          </button>
          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="text-white/30 hover:text-white/70 transition-colors p-1.5"
          >
            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input
            type="range" min={0} max={1} step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-[3px]"
            style={{
              background: `linear-gradient(to right, rgba(255,255,255,0.5) ${volume * 100}%, rgba(255,255,255,0.1) 0%)`,
            }}
          />
        </div>

        {/* Mobile: lyrics button */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => setShowLyrics(true)}
            className="text-white/30 p-2"
          >
            <Mic2 size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
