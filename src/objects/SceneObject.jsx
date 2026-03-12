import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, a } from '@react-spring/three'
import useStore from '../store'

/**
 * Base wrapper for any interactive 3D object in the scene.
 * Provides: hover glow, click bounce, idle float animation.
 * Wrap your mesh(es) inside this component.
 */
export default function SceneObject({
  id,
  children,
  idleAnimation = 'float', // 'float' | 'rotate' | 'wobble' | 'none'
  idleSpeed = 1,
  idleIntensity = 0.02,
  ...props
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const setHoveredObject = useStore((s) => s.setHoveredObject)
  const clearHoveredObject = useStore((s) => s.clearHoveredObject)
  const setFocusedObject = useStore((s) => s.setFocusedObject)

  // Spring for hover/click scale
  const { scale } = useSpring({
    scale: 1,
    config: { mass: 1, tension: 280, friction: 20 },
  })

  const onPointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(true)
    setHoveredObject(id)
    document.body.style.cursor = 'pointer'
  }, [id, setHoveredObject])

  const onPointerOut = useCallback(() => {
    setHovered(false)
    clearHoveredObject()
    document.body.style.cursor = 'auto'
  }, [clearHoveredObject])

  const onClick = useCallback((e) => {
    e.stopPropagation()
    setClicked(true)
    setFocusedObject(id)
    // Bounce back
    setTimeout(() => setClicked(false), 300)
  }, [id, setFocusedObject])

  // Idle animation
  useFrame((state) => {
    if (!groupRef.current || idleAnimation === 'none') return
    const t = state.clock.elapsedTime * idleSpeed

    if (idleAnimation === 'float') {
      groupRef.current.position.y = props.position?.[1] ?? 0 + Math.sin(t) * idleIntensity
    } else if (idleAnimation === 'rotate') {
      groupRef.current.rotation.y += 0.002 * idleSpeed
    }
  })

  return (
    <a.group
      ref={groupRef}
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
      {...props}
    >
      {children}
    </a.group>
  )
}
