import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function LightDesk({ scale = 1, rotation, ...props }) {
  const { scene } = useGLTF('/models/light-desk.glb')
  return (
    <SceneObject id="light-desk" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={scene.clone()} scale={scale} />
    </SceneObject>
  )
}

useGLTF.preload('/models/light-desk.glb')
