import { useEffect, useRef, useState } from 'react'

interface Props {
  cryUrl?: string | null
}

export function PokemonCry({ cryUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fallbackTimeoutRef = useRef<number | null>(null)

  const clearFallbackTimeout = () => {
    if (fallbackTimeoutRef.current !== null) {
      window.clearTimeout(fallbackTimeoutRef.current)
      fallbackTimeoutRef.current = null
    }
  }

  const stopAudio = () => {
    clearFallbackTimeout()

    const audio = audioRef.current
    if (!audio) return

    audio.onended = null
    audio.onerror = null
    audio.onpause = null
    audio.onstalled = null
    audio.onabort = null
    audio.pause()

    try {
      audio.currentTime = 0
    } catch {
      // Some browsers can reject seeking while media metadata is unavailable.
    }

    audioRef.current = null
  }

  useEffect(() => {
    stopAudio()
    setIsPlaying(false)
    setHasError(false)

    return () => {
      stopAudio()
    }
  }, [cryUrl])

  const playCry = async () => {
    if (!cryUrl || isPlaying) return

    stopAudio()

    const audio = new Audio(cryUrl)
    audioRef.current = audio
    audio.volume = 0.45

    const finishPlayback = () => {
      clearFallbackTimeout()
      setIsPlaying(false)
    }

    const failPlayback = () => {
      clearFallbackTimeout()
      setIsPlaying(false)
      setHasError(true)
    }

    audio.onended = finishPlayback
    audio.onpause = finishPlayback
    audio.onerror = failPlayback
    audio.onstalled = failPlayback
    audio.onabort = failPlayback

    try {
      setHasError(false)
      setIsPlaying(true)
      await audio.play()

      const durationMs = Number.isFinite(audio.duration)
        ? Math.max(audio.duration * 1000 + 1000, 3000)
        : 10000
      fallbackTimeoutRef.current = window.setTimeout(finishPlayback, durationMs)
    } catch {
      audioRef.current = null
      setIsPlaying(false)
      setHasError(true)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={playCry}
        disabled={!cryUrl || isPlaying}
        className="inline-flex items-center justify-center rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      >
        {isPlaying ? 'Lecture...' : 'Ecouter le cri'}
      </button>
      {hasError && (
        <span className="text-xs font-medium text-red-500">
          Cri indisponible
        </span>
      )}
    </div>
  )
}
