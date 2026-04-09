import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function Mouse({ scale = 1.5, rotation, ...props }) {
  const { scene } = useGLTF('models/mouse.glb')
  return (
    <SceneObject id="mouse" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={scene.clone()} scale={scale} />
    </SceneObject>
  )
}

useGLTF.preload('models/mouse.glb')
