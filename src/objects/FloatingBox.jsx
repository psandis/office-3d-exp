import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import SceneObject from './SceneObject'

export default function FloatingBox({ scale = 1, ...props }) {
  const meshRef = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <SceneObject id="floating-box" idleAnimation="none" {...props}>
      <mesh
        ref={meshRef}
        scale={(clicked ? 1.5 : 1) * scale}
        onClick={(e) => { e.stopPropagation(); click(!clicked) }}
        onPointerOver={(e) => { e.stopPropagation(); hover(true) }}
        onPointerOut={() => hover(false)}
      >
        <boxGeometry />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    </SceneObject>
  )
}
