import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import SceneObject from './SceneObject'

const MODEL_PATH = import.meta.env.BASE_URL + 'level-react-draco.glb'

export default function CameraObj() {
  const { nodes, materials } = useGLTF(MODEL_PATH)

  const [spring, api] = useSpring(() => ({
    'rotation-z': 0,
    config: { friction: 40 },
  }), [])

  useEffect(() => {
    let timeout
    const wander = () => {
      api.start({ 'rotation-z': Math.random() })
      timeout = setTimeout(wander, (1 + Math.random() * 2) * 800)
    }
    wander()
    return () => clearTimeout(timeout)
  }, [api])

  return (
    <SceneObject id="camera-obj" idleAnimation="none">
      <a.group
        position={[-0.58, 0.83, -0.03]}
        rotation={[Math.PI / 2, 0, 0.47]}
        {...spring}
      >
        <mesh geometry={nodes.Camera.geometry} material={nodes.Camera.material} />
        <mesh geometry={nodes.Camera_1.geometry} material={materials.Lens} />
      </a.group>
    </SceneObject>
  )
}
