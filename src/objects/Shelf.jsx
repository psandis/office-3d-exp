import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

const MODEL_SCALE = 0.0000033

export default function Shelf({ scale = 1, rotation, introDelay = 0, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/shelf.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  return (
    <SceneObject id="shelf" idleAnimation="none" introDelay={introDelay} rotation={rotation} {...props}>
      <primitive object={cloned} scale={scale * MODEL_SCALE} position={[0.42, -1.30, -2.25]} />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/shelf.glb')
