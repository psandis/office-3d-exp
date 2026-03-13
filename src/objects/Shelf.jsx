import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

const MODEL_SCALE = 0.0000033

export default function Shelf({ scale = 1, rotation, ...props }) {
  const { scene } = useGLTF('/models/shelf.glb')
  return (
    <SceneObject id="shelf" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={scene.clone()} scale={scale * MODEL_SCALE} position={[0.42, -1.30, -2.25]} />
    </SceneObject>
  )
}

useGLTF.preload('/models/shelf.glb')
