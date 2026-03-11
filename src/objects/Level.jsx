import { useGLTF } from '@react-three/drei'

const MODEL_PATH = '/level-react-draco.glb'

export default function Level() {
  const { nodes } = useGLTF(MODEL_PATH)
  return (
    <mesh
      geometry={nodes.Level.geometry}
      material={nodes.Level.material}
      position={[-0.38, 0.69, 0.62]}
      rotation={[Math.PI / 2, -Math.PI / 9, 0]}
    />
  )
}

useGLTF.preload(MODEL_PATH)
