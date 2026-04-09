import { useEffect, useRef } from 'react'
import useStore from './store'

export default function AudioManager() {
  const audioRef = useRef(null)
  const introComplete = useStore((s) => s.introComplete)
  const audioEnabled = useStore((s) => s.audioEnabled)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(import.meta.env.BASE_URL + 'sounds/office-lounge-music-1.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    if (introComplete && audioEnabled) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [introComplete, audioEnabled])

  return null
}
