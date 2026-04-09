import { useGLTF, MeshWobbleMaterial } from '@react-three/drei'
import SceneObject from './SceneObject'

const MODEL_PATH = import.meta.env.BASE_URL + 'level-react-draco.glb'

export default function Cactus() {
  const { nodes, materials } = useGLTF(MODEL_PATH)
  return (
    <SceneObject id="cactus" idleAnimation="none">
      <mesh
        geometry={nodes.Cactus.geometry}
        position={[-0.42, 0.51, -0.62]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <MeshWobbleMaterial factor={0.4} map={materials.Cactus.map} />
      </mesh>
    </SceneObject>
  )
}
