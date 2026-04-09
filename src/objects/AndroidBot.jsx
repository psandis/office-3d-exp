import { useMemo, useRef, useState, useCallback } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import SceneObject from './SceneObject'

const SHELF_BOUNDS = { minX: -2.0, maxX: -1.4, minZ: -0.5, maxZ: 0.5 }
const ROBOT_SOUND = import.meta.env.BASE_URL + 'sounds/freesound_community-little-robot-sound-84657.mp3'
const TONES = ['●', '◉', '◎', '○']
const TONE_COUNT = 4

function RobotTones({ active }) {
  const tonesRef = useRef([])

  const toneData = useMemo(() =>
    Array.from({ length: TONE_COUNT }, (_, i) => ({
      symbol: TONES[i % TONES.length],
      offset: (i / TONE_COUNT) * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.15,
    })),
  [])

  useFrame((state) => {
    if (!active) return
    const t = state.clock.elapsedTime
    tonesRef.current.forEach((mesh, i) => {
      if (!mesh) return
      const d = toneData[i]
      const cycle = ((t * d.speed + d.offset) % 2.5) / 2.5
      mesh.position.x = d.drift + Math.sin(t * 0.8 + d.offset) * 0.06
      mesh.position.y = cycle * 0.3
      mesh.position.z = 0.05
      mesh.material.opacity = cycle < 0.7 ? 1 - cycle * 0.5 : (1 - cycle) * 3.3
      mesh.visible = true
    })
  })

  if (!active) return null

  return (
    <group position={[0, 0.08, 0]}>
      {toneData.map((d, i) => (
        <Text
          key={i}
          ref={(el) => { tonesRef.current[i] = el }}
          fontSize={0.04}
          color="#9ece6a"
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={0}
          material-depthWrite={false}
        >
          {d.symbol}
        </Text>
      ))}
    </group>
  )
}

export default function AndroidBot({ scale = 0.07, rotation, introDelay = 0, draggable = false, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/android-bot.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const playSound = useCallback(() => {
    if (playing) return
    if (!audioRef.current) {
      audioRef.current = new Audio(ROBOT_SOUND)
      audioRef.current.volume = 0.5
      audioRef.current.addEventListener('ended', () => setPlaying(false))
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
    setPlaying(true)
  }, [playing])

  return (
    <SceneObject
      id="android-bot"
      idleAnimation="none"
      introDelay={introDelay}
      draggable={draggable}
      dragPlaneY={1.80}
      dragBounds={SHELF_BOUNDS}
      rotation={rotation}
      onDragStart={playSound}
      {...props}
    >
      <primitive
        object={cloned}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation()
          playSound()
        }}
      />
      <RobotTones active={playing} />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/android-bot.glb')
