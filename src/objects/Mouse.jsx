import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function Mouse({ scale = 1.5, rotation, introDelay = 0, draggable = false, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/mouse.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  return (
    <SceneObject id="mouse" idleAnimation="none" introDelay={introDelay} draggable={draggable} rotation={rotation} {...props}>
      <primitive object={cloned} scale={scale} />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/mouse.glb')
