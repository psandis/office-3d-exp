import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, a } from '@react-spring/three'
import { Color, Plane, Vector3, Raycaster, Vector2 } from 'three'
import useStore from '../store'
import { theme } from '../theme'
import { cameraControlsRef } from '../systems/CameraRig'

const HOVER_COLOR = new Color(theme.colors.glow)
const dragPlane = new Plane()
const intersectPoint = new Vector3()
const mouse = new Vector2()

export default function SceneObject({
  id,
  children,
  interactive = true,
  noGlow = false,
  draggable = false,
  dragPlaneY = 0,
  dragBounds = null, // { minX, maxX, minZ, maxZ }
  idleAnimation = 'float',
  idleSpeed = 1,
  idleIntensity = 0.02,
  introDelay = 0,
  onDragStart,
  ...props
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [introReady, setIntroReady] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragOffsetRef = useRef(new Vector3())
  const dragYRef = useRef(0)
  const meshesRef = useRef([])
  const originalEmissiveRef = useRef(new Map())
  const baseY = useRef(props.position?.[1] ?? 0)

  const setHoveredObject = useStore((s) => s.setHoveredObject)
  const clearHoveredObject = useStore((s) => s.clearHoveredObject)
  const introComplete = useStore((s) => s.introComplete)

  const { camera, gl } = useThree()
  const raycaster = useRef(new Raycaster())

  // Trigger intro after overlay dismissed + delay
  useEffect(() => {
    if (!introComplete) return
    const timer = setTimeout(() => setIntroReady(true), introDelay)
    return () => clearTimeout(timer)
  }, [introComplete, introDelay])

  // Spring: intro pop (bouncy), hover (snappy), drag (stiff)
  const { scale } = useSpring({
    scale: introReady ? (hovered ? 1.03 : 1) : 0,
    config: !introReady
      ? { mass: 1.2, tension: 180, friction: 12 }
      : hovered
        ? { mass: 0.5, tension: 400, friction: 20 }
        : { mass: 1, tension: 280, friction: 22 },
  })

  // Clone materials so each object owns its own, then store originals
  useEffect(() => {
    if (!groupRef.current || !interactive || noGlow) return
    const meshes = []
    const originals = new Map()
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        meshes.push(child)
        const mat = child.material
        if (mat.emissive) {
          originals.set(child.uuid, {
            emissive: mat.emissive.clone(),
            emissiveIntensity: mat.emissiveIntensity,
          })
        }
      }
    })
    meshesRef.current = meshes
    originalEmissiveRef.current = originals
  }, [interactive])

  // Emissive glow on hover
  useFrame(() => {
    if (!interactive || noGlow) return
    meshesRef.current.forEach((mesh) => {
      const mat = mesh.material
      if (!mat.emissive) return
      const orig = originalEmissiveRef.current.get(mesh.uuid)
      if (!orig) return

      if (hovered) {
        mat.emissive.lerp(HOVER_COLOR, 0.1)
        mat.emissiveIntensity += (0.3 - mat.emissiveIntensity) * 0.1
      } else {
        mat.emissive.lerp(orig.emissive, 0.15)
        mat.emissiveIntensity += (orig.emissiveIntensity - mat.emissiveIntensity) * 0.15
        const dr = mat.emissive.r - orig.emissive.r
        const dg = mat.emissive.g - orig.emissive.g
        const db = mat.emissive.b - orig.emissive.b
        if (dr * dr + dg * dg + db * db < 0.0001) {
          mat.emissive.copy(orig.emissive)
          mat.emissiveIntensity = orig.emissiveIntensity
        }
      }
    })
  })

  const onPointerOver = useCallback((e) => {
    if (!interactive) return
    e.stopPropagation()
    setHovered(true)
    setHoveredObject(id)
    document.body.style.cursor = draggable ? 'grab' : 'pointer'
  }, [id, interactive, draggable, setHoveredObject])

  const onPointerOut = useCallback(() => {
    if (!interactive || dragging) return
    setHovered(false)
    clearHoveredObject()
    document.body.style.cursor = 'auto'
  }, [interactive, dragging, clearHoveredObject])

  // Drag handlers
  const getFloorPoint = useCallback((e) => {
    const rect = gl.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    dragPlane.set(new Vector3(0, 1, 0), -dragPlaneY)
    raycaster.current.setFromCamera(mouse, camera)
    raycaster.current.ray.intersectPlane(dragPlane, intersectPoint)
    return intersectPoint
  }, [camera, gl, dragPlaneY])

  const onPointerDown = useCallback((e) => {
    if (!interactive || !draggable) return
    e.stopPropagation()
    setDragging(true)
    document.body.style.cursor = 'grabbing'
    if (cameraControlsRef.current) cameraControlsRef.current.enabled = false
    onDragStart?.()

    // Store offset between object position and floor intersection
    const group = groupRef.current
    if (group) {
      dragYRef.current = group.position.y
      const floorPt = getFloorPoint(e.nativeEvent)
      dragOffsetRef.current.set(
        group.position.x - floorPt.x,
        0,
        group.position.z - floorPt.z
      )
    }

    // Capture pointer for smooth dragging
    e.target.setPointerCapture(e.pointerId)
  }, [interactive, draggable, getFloorPoint])

  const onPointerMove = useCallback((e) => {
    if (!dragging || !groupRef.current) return
    e.stopPropagation()
    const floorPt = getFloorPoint(e.nativeEvent)
    let nx = floorPt.x + dragOffsetRef.current.x
    let nz = floorPt.z + dragOffsetRef.current.z
    if (dragBounds) {
      nx = Math.max(dragBounds.minX, Math.min(dragBounds.maxX, nx))
      nz = Math.max(dragBounds.minZ, Math.min(dragBounds.maxZ, nz))
    }
    groupRef.current.position.x = nx
    groupRef.current.position.z = nz
  }, [dragging, getFloorPoint, dragBounds])

  const onPointerUp = useCallback((e) => {
    if (!dragging) return
    setDragging(false)
    document.body.style.cursor = hovered ? 'grab' : 'auto'
    if (cameraControlsRef.current) cameraControlsRef.current.enabled = true
  }, [dragging, hovered])

  // Idle animation
  useFrame((state) => {
    if (!groupRef.current || idleAnimation === 'none' || dragging) return
    const t = state.clock.elapsedTime * idleSpeed

    if (idleAnimation === 'float') {
      groupRef.current.position.y = baseY.current + Math.sin(t) * idleIntensity
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
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      {...props}
    >
      {children}
    </a.group>
  )
}
