'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  Heart, SkipBack, SkipForward, Play, Pause,
  Volume2, VolumeX, List, Mic2, Shuffle, Repeat, Repeat1,
  ChevronDown, Music2, Share2, Loader2
} from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { LyricsModal } from '@/components/LyricsModal'
import { QueueModal } from '@/components/QueueModal'
import { ShareModal } from '@/components/ShareModal'
import clsx from 'clsx'

export function Player() {
  const {
    currentTrack, isPlaying, volume, progress,
    isShuffle, repeatMode,
    togglePlay, playNext, playPrev, setVolume, setProgress,
    toggleFavorite, isFavorite, toggleShuffle, cycleRepeat,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch stream URL dari Piped lalu load ke audio element
  useEffect(() => {
    if (!currentTrack?.videoId) return

    setLoading(true)
    setError(null)
    setCurrentTime(0)
    setDuration(0)

    fetch(`/api/piped/stream?videoId=${currentTrack.videoId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.url) throw new Error('No stream URL')
        if (audioRef.current) {
          audioRef.current.src = data.url
          audioRef.current.load()
        }
      })
      .catch(() => setError('Gagal load audio 😢'))
      .finally(() => setLoading(false))

    // Update Media Session metadata
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: [{ src: currentTrack.thumbnail, sizes: '480x360', type: 'image/jpeg' }],
      })
    }
  }, [currentTrack?.videoId])

  // Play / pause
  useEffect(() => {
    if (!audioRef.current || loading) return
    if (isPlaying) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()

    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
    }
  }, [isPlaying, loading])

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Media Session action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.setActionHandler('play', () => togglePlay())
    navigator.mediaSession.setActionHandler('pause', () => togglePlay())
    navigator.mediaSession.setActionHandler('nexttrack', () => playNext())
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrev())
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null && audioRef.current) {
        audioRef.current.currentTime = details.seekTime
        setCurrentTime(details.seekTime)
      }
    })
    return () => {
      ;['play', 'pause', 'nexttrack', 'previoustrack', 'seekto'].forEach((a) => {
        try { navigator.mediaSession.setActionHandler(a as any, null) } catch {}
      })
    }
  }, [togglePlay, playNext, playPrev])

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = val
    setCurrentTime(val)
  }, [])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat
  const repeatActive = repeatMode !== 'off'

  return (
    <>
      {/* HTML5 Audio element — ini yang bikin background play jalan! */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const t = (e.target as HTMLAudioElement).currentTime
          setCurrentTime(t)
          if ('mediaSession' in navigator && duration > 0) {
            try {
              navigator.mediaSession.setPositionState({ duration, playbackRate: 1, position: t })
            } catch {}
          }
        }}
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        onEnded={playNext}
        onCanPlay={() => {
          if (isPlaying) audioRef.current?.play().catch(() => {})
        }}
      />

      {/* Modals */}
      {showLyrics && currentTrack && (
        <LyricsModal track={currentTrack} onClose={() => setShowLyrics(false)} />
      )}
      {showQueue && <QueueModal onClose={() => setShowQueue(false)} />}
      {showShare && currentTrack && (
        <ShareModal track={currentTrack} onClose={() => setShowShare(false)} />
      )}

      {/* ─── EXPANDED FULL CARD ─── */}
      <div
        className={clsx(
          'fixed inset-0 z-30 flex flex-col transition-transform duration-500 ease-in-out',
          expanded ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        )}
        style={{ background: 'linear-gradient(180deg, #141414 0%, #0a0a0a 100%)' }}
      >
        {currentTrack && (
          <div
            className="absolute inset-0 opacity-25 scale-110"
            style={{
              backgroundImage: `url(${currentTrack.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(50px)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
          <button
            onClick={() => setExpanded(false)}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <ChevronDown size={26} />
          </button>
          <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-white/40">Now Playing</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowShare(true); setExpanded(false) }}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => { setShowLyrics(true); setExpanded(false) }}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <Mic2 size={20} />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-7 pb-4">
          {/* Album art */}
          <div className="relative flex items-center justify-center">
            {isPlaying && (
              <>
                <div className="absolute w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] rounded-2xl bg-white/5 animate-pulse-ring" />
                <div className="absolute w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] rounded-2xl bg-white/[0.03] animate-pulse-ring2" />
              </>
            )}
            <div
              className={clsx(
                'w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500',
                isPlaying ? 'scale-100 shadow-black/60' : 'scale-90 shadow-black/30'
              )}
            >
              {currentTrack ? (
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  width={320} height={320}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Music2 size={48} className="text-white/20" />
                </div>
              )}
            </div>
          </div>

          {/* Track info + favorite */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[19px] font-bold truncate leading-tight">
                {currentTrack?.title || 'No track playing'}
              </p>
              <p className="text-[14px] text-white/50 truncate mt-1">
                {currentTrack?.artist || '—'}
              </p>
              {error && <p className="text-[12px] text-red-400 mt-1">{error}</p>}
            </div>
            {currentTrack && (
              <button
                onClick={() => toggleFavorite(currentTrack)}
                className={clsx(
                  'flex-shrink-0 transition-all duration-200',
                  isFavorite(currentTrack.id) ? 'text-green scale-110' : 'text-white/30 hover:text-white/60'
                )}
              >
                <Heart size={22} fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          {/* Progress */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="relative w-full h-1 bg-white/10 rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-white rounded-full"
                style={{ width: `${progressPct}%`, transition: 'width 0.5s linear' }}
              />
              <input
                type="range"
                min={0} max={duration || 100}
                value={currentTime}
                onChange={seek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-white/30 font-mono">{fmt(currentTime)}</span>
              <span className="text-[11px] text-white/30 font-mono">{fmt(duration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="w-full flex items-center justify-between px-2">
            <button
              onClick={toggleShuffle}
              className={clsx('transition-colors p-2', isShuffle ? 'text-green' : 'text-white/30 hover:text-white/70')}
            >
              <Shuffle size={20} />
            </button>
            <button onClick={playPrev} className="text-white/80 hover:text-white transition-colors p-2">
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-black/40"
            >
              {loading
                ? <Loader2 size={26} className="text-black animate-spin" />
                : isPlaying
                  ? <Pause size={26} className="text-black" fill="black" />
                  : <Play size={26} className="text-black ml-1" fill="black" />}
            </button>
            <button onClick={playNext} className="text-white/80 hover:text-white transition-colors p-2">
              <SkipForward size={32} fill="currentColor" />
            </button>
            <button
              onClick={cycleRepeat}
              className={clsx('transition-colors p-2', repeatActive ? 'text-green' : 'text-white/30 hover:text-white/70')}
            >
              <RepeatIcon size={20} />
            </button>
          </div>

          {/* Volume */}
          <div className="w-full flex items-center gap-3 px-2">
            <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-white/30">
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range" min={0} max={1} step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-[3px]"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.6) ${volume * 100}%, rgba(255,255,255,0.1) 0%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── MINI PLAYER BAR ─── */}
      <div
        className={clsx(
          'fixed left-0 right-0 z-20 bg-surface border-t border-white/[0.06]',
          'md:bottom-0 bottom-[var(--bottomnav-height)]',
          expanded && 'opacity-0 pointer-events-none'
        )}
        style={{ height: 'var(--player-height)', transition: 'opacity 0.2s' }}
      >
        <div
          className="absolute inset-0 md:hidden cursor-pointer"
          onClick={() => currentTrack && setExpanded(true)}
        />

        <div className="flex items-center px-3 md:px-5 gap-3 md:gap-4 h-full">
          {/* Track info */}
          <div className="flex items-center gap-2.5 w-[160px] md:w-[220px] min-w-0 flex-shrink-0">
            {currentTrack ? (
              <>
                <div className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0">
                  {isPlaying && <div className="absolute inset-0 rounded-lg bg-white/10 animate-pulse-ring" />}
                  <div className="relative w-full h-full rounded-lg overflow-hidden bg-elevated">
                    <Image
                      src={currentTrack.thumbnail}
                      alt={currentTrack.title}
                      width={44} height={44}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[12.5px] md:text-[13px] font-[500] truncate">{currentTrack.title}</p>
                  <p className="text-[11px] text-white/40 truncate mt-0.5">{currentTrack.artist}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(currentTrack) }}
                  className={clsx('ml-1 flex-shrink-0 transition-colors relative z-10', isFavorite(currentTrack.id) ? 'text-green' : 'text-white/30 hover:text-white/60')}
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
              <button
                onClick={(e) => { e.stopPropagation(); toggleShuffle() }}
                className={clsx('hidden sm:flex transition-colors p-1.5', isShuffle ? 'text-green' : 'text-white/30 hover:text-white/70')}
              >
                <Shuffle size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); playPrev() }} className="text-white/60 hover:text-white transition-colors p-1.5 relative z-10">
                <SkipBack size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay() }}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#ededed] flex items-center justify-center hover:bg-white transition-colors flex-shrink-0 relative z-10"
              >
                {loading
                  ? <Loader2 size={14} className="text-black animate-spin" />
                  : isPlaying
                    ? <Pause size={14} className="text-black" fill="black" />
                    : <Play size={14} className="text-black ml-0.5" fill="black" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); playNext() }} className="text-white/60 hover:text-white transition-colors p-1.5 relative z-10">
                <SkipForward size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); cycleRepeat() }}
                className={clsx('hidden sm:flex transition-colors p-1.5', repeatActive ? 'text-green' : 'text-white/30 hover:text-white/70')}
              >
                <RepeatIcon size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-[360px] md:max-w-[480px]">
              <span className="text-[10px] text-white/30 font-mono w-[28px] text-right flex-shrink-0">{fmt(currentTime)}</span>
              <input
                type="range" min={0} max={duration || 100} value={currentTime}
                onChange={(e) => { e.stopPropagation(); seek(e) }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-[3px] relative z-10"
                style={{
                  background: duration
                    ? `linear-gradient(to right, #ededed ${progressPct}%, rgba(255,255,255,0.15) 0%)`
                    : 'rgba(255,255,255,0.15)',
                }}
              />
              <span className="text-[10px] text-white/30 font-mono w-[28px] flex-shrink-0">{fmt(duration)}</span>
            </div>
          </div>

          {/* Desktop right controls */}
          <div className="hidden md:flex items-center gap-1.5 w-[180px] justify-end">
            <button onClick={() => setShowLyrics(true)} className="text-white/30 hover:text-white/70 transition-colors p-1.5">
              <Mic2 size={15} />
            </button>
            <button onClick={() => setShowQueue(true)} className="text-white/30 hover:text-white/70 transition-colors p-1.5">
              <List size={15} />
            </button>
            <button onClick={() => currentTrack && setShowShare(true)} className="text-white/30 hover:text-white/70 transition-colors p-1.5">
              <Share2 size={15} />
            </button>
            <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-white/30 hover:text-white/70 transition-colors p-1.5">
              {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-[3px]"
              style={{ background: `linear-gradient(to right, rgba(255,255,255,0.5) ${volume * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
          </div>

          {/* Mobile action buttons */}
          <div className="flex md:hidden items-center gap-1 relative z-10">
            <button onClick={(e) => { e.stopPropagation(); setShowQueue(true) }} className="text-white/40 hover:text-white/70 transition-colors p-2">
              <List size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setShowLyrics(true) }} className="text-white/40 hover:text-white/70 transition-colors p-2">
              <Mic2 size={16} />
            </button>
          </div>
        </div>

        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <div
              className="h-full bg-white/25"
              style={{ width: `${progressPct}%`, transition: 'width 0.5s linear' }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.35; }
          100% { transform: scale(1.12); opacity: 0; }
        }
        @keyframes pulse-ring2 {
          0% { transform: scale(1); opacity: 0.15; }
          100% { transform: scale(1.22); opacity: 0; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 1.8s cubic-bezier(0,0,0.2,1) infinite;
        }
        .animate-pulse-ring2 {
          animation: pulse-ring2 1.8s cubic-bezier(0,0,0.2,1) infinite 0.5s;
        }
      `}</style>
    </>
  )
}
