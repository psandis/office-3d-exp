import { useMemo, useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

const MODEL_SCALE_CORRECTION = 0.15
const BOWL_SOUND = import.meta.env.BASE_URL + 'sounds/freesound_community-bowl-sound-46227.mp3'

export default function DogBowl({ scale = 1, rotation, introDelay = 0, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/dog-bowl.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const playSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(BOWL_SOUND)
      audioRef.current.volume = 0.5
    }
    clearTimeout(timerRef.current)
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
    timerRef.current = setTimeout(() => {
      audioRef.current.pause()
    }, 2000)
  }, [])

  return (
    <SceneObject id="dog-bowl" idleAnimation="none" introDelay={introDelay} rotation={rotation} {...props}>
      <primitive
        object={cloned}
        scale={scale * MODEL_SCALE_CORRECTION}
        position={[0, 0.222 * scale * MODEL_SCALE_CORRECTION, 0]}
        onClick={(e) => {
          e.stopPropagation()
          playSound()
        }}
      />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/dog-bowl.glb')
