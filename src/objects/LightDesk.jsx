import { useMemo, useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

const LAMP_SOUND = import.meta.env.BASE_URL + 'sounds/lamp-click.wav'

export default function LightDesk({ scale = 1, rotation, introDelay = 0, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/light-desk.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const playSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(LAMP_SOUND)
      audioRef.current.volume = 0.5
    }
    clearTimeout(timerRef.current)
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
    timerRef.current = setTimeout(() => {
      audioRef.current?.pause()
    }, 1000)
  }, [])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    playSound()
  }, [playSound])

  return (
    <SceneObject
      id="light-desk"
      idleAnimation="none"
      introDelay={introDelay}
      rotation={rotation}
      {...props}
    >
      <primitive object={cloned} scale={scale} onClick={handleClick} />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/light-desk.glb')
