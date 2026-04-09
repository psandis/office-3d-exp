import { useEffect, useMemo, useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AnimationMixer } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import SceneObject from './SceneObject'

const MODEL_SCALE_CORRECTION = 0.003
const MODEL_GROUND_OFFSET = 37.92994343435728
const DOG_SOUND = import.meta.env.BASE_URL + 'sounds/freesound_community-small-dog-81977.mp3'

export default function Puppy({ scale = 1, rotation, introDelay = 0, ...props }) {
  const { scene, animations } = useGLTF(import.meta.env.BASE_URL + 'models/puppy-idle.glb')
  const cloned = useMemo(() => clone(scene), [scene])
  const mixerRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!animations.length) return
    const mixer = new AnimationMixer(cloned)
    const action = mixer.clipAction(animations[0])
    action.play()
    mixerRef.current = mixer
    return () => mixer.stopAllAction()
  }, [cloned, animations])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
  })

  const playSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(DOG_SOUND)
      audioRef.current.volume = 0.5
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }, [])

  return (
    <SceneObject id="puppy" idleAnimation="none" introDelay={introDelay} rotation={rotation} {...props}>
      {/* Invisible click area */}
      <mesh visible={false} position={[0, 0.2, 0]} onClick={(e) => { e.stopPropagation(); playSound() }}>
        <boxGeometry args={[0.4, 0.5, 0.5]} />
      </mesh>
      <primitive
        object={cloned}
        scale={scale * MODEL_SCALE_CORRECTION}
        position={[0, MODEL_GROUND_OFFSET * scale * MODEL_SCALE_CORRECTION, 0]}
      />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/puppy-idle.glb')
