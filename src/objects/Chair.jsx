import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function Chair({ scale = 1.7, rotation, ...props }) {
  const { scene } = useGLTF('/models/desk-chair.glb')
  return (
    <SceneObject id="chair" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={scene.clone()} scale={scale} position={[0.17, 0, -0.16]} />
    </SceneObject>
  )
}

useGLTF.preload('/models/desk-chair.glb')
