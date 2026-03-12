import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function Desk({ scale = 1.5, rotation, ...props }) {
  const { scene } = useGLTF('/models/sitting-desk.glb')
  return (
    <SceneObject id="desk" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={scene.clone()} scale={scale} />
    </SceneObject>
  )
}

useGLTF.preload('/models/sitting-desk.glb')
