import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function Chair({ scale = 1.7, rotation, introDelay = 0, draggable = false, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/desk-chair.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  return (
    <SceneObject id="chair" interactive={false} idleAnimation="none" introDelay={introDelay} rotation={rotation} {...props}>
      <primitive object={cloned} scale={scale} position={[0.17, 0, -0.16]} />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/desk-chair.glb')
