import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function Laptop({ scale = 1.3, rotation, ...props }) {
  const { scene } = useGLTF('/models/laptop.glb')
  return (
    <SceneObject id="laptop" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={scene.clone()} scale={scale} position={[0.17, 0, -0.16]} />
    </SceneObject>
  )
}

useGLTF.preload('/models/laptop.glb')
