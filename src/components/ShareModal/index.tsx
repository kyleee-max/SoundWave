'use client'
import { useState } from 'react'
import { X, Copy, ExternalLink, Check, Download, Music2 } from 'lucide-react'
import { Track } from '@/types'
import Image from 'next/image'

interface Props {
  track: Track
  onClose: () => void
}

export function ShareModal({ track, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const ytUrl = `https://www.youtube.com/watch?v=${track.videoId}`

  function copyLink() {
    navigator.clipboard.writeText(ytUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function openYouTube() {
    window.open(ytUrl, '_blank', 'noopener')
  }

  function downloadInfo() {
    // Arahkan ke yt-dlp / cobalt.tools karena direct download YT tidak bisa dari browser
    window.open(`https://cobalt.tools/?u=${encodeURIComponent(ytUrl)}`, '_blank', 'noopener')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-[#141414] border border-white/[0.08] rounded-t-2xl md:rounded-2xl
                      w-full md:w-[380px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
          <p className="text-[15px] font-semibold">Share</p>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Track preview */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
            {track.thumbnail ? (
              <Image src={track.thumbnail} alt="" width={44} height={44} className="object-cover w-full h-full" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music2 size={16} className="text-white/20" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate max-w-[260px]">{track.title}</p>
            <p className="text-[12px] text-white/40 truncate">{track.artist}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          {/* Copy link */}
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-xl transition-colors"
          >
            {copied ? <Check size={17} className="text-green flex-shrink-0" /> : <Copy size={17} className="text-white/50 flex-shrink-0" />}
            <span className="text-[13.5px] text-left flex-1">{copied ? 'Link disalin!' : 'Salin link YouTube'}</span>
          </button>

          {/* Open YouTube */}
          <button
            onClick={openYouTube}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-xl transition-colors"
          >
            <ExternalLink size={17} className="text-white/50 flex-shrink-0" />
            <span className="text-[13.5px] text-left flex-1">Buka di YouTube</span>
          </button>

          {/* Download via cobalt.tools */}
          <button
            onClick={downloadInfo}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-xl transition-colors"
          >
            <Download size={17} className="text-white/50 flex-shrink-0" />
            <div className="text-left flex-1">
              <p className="text-[13.5px]">Download lagu</p>
              <p className="text-[11px] text-white/30 mt-0.5">via cobalt.tools (gratis)</p>
            </div>
          </button>
        </div>

        {/* Bottom safe area */}
        <div className="h-3" />
      </div>
    </div>
  )
         }
      
