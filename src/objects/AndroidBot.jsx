import { useGLTF } from '@react-three/drei'
import SceneObject from './SceneObject'

export default function AndroidBot({ scale = 0.07, rotation, ...props }) {
  const { scene } = useGLTF('/models/android-bot.glb')
  return (
    <SceneObject id="android-bot" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={scene.clone()} scale={scale} />
    </SceneObject>
  )
}

useGLTF.preload('/models/android-bot.glb')
