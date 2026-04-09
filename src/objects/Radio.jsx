import { useMemo, useRef } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import useStore from '../store'
import SceneObject from './SceneObject'

const NOTES = ['♪', '♫', '♩', '♬']
const NOTE_COUNT = 5

function FloatingNotes() {
  const notesRef = useRef([])
  const audioEnabled = useStore((s) => s.audioEnabled)
  const introComplete = useStore((s) => s.introComplete)

  const noteData = useMemo(() =>
    Array.from({ length: NOTE_COUNT }, (_, i) => ({
      symbol: NOTES[i % NOTES.length],
      offset: (i / NOTE_COUNT) * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.3,
    })),
  [])

  useFrame((state) => {
    if (!audioEnabled || !introComplete) return
    const t = state.clock.elapsedTime
    notesRef.current.forEach((mesh, i) => {
      if (!mesh) return
      const d = noteData[i]
      const cycle = ((t * d.speed + d.offset) % 3) / 3 // 0→1 over 3 seconds
      mesh.position.x = d.drift + Math.sin(t * 0.5 + d.offset) * 0.1
      mesh.position.y = cycle * 0.5
      mesh.position.z = 0.1
      mesh.material.opacity = cycle < 0.8 ? 1 - cycle * 0.5 : (1 - cycle) * 5
      mesh.visible = true
    })
  })

  if (!audioEnabled || !introComplete) return null

  return (
    <group position={[0, 0.25, 0]}>
      {noteData.map((d, i) => (
        <Text
          key={i}
          ref={(el) => { notesRef.current[i] = el }}
          fontSize={0.08}
          color="#4a9eff"
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

export default function Radio({ scale = 1.5, rotation, introDelay = 0, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/radio.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  const toggleAudio = useStore((s) => s.toggleAudio)

  return (
    <SceneObject id="radio" idleAnimation="none" introDelay={introDelay} rotation={rotation} {...props}>
      <primitive
        object={cloned}
        scale={scale}
        position={[0.16, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          toggleAudio()
        }}
      />
      <FloatingNotes />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/radio.glb')
