const positions = [[-1, -0.8], [1, -0.8], [-1, 0.4], [1, 0.4]]

export default function CeilingLights({ ceilingHeight = 2.7 }) {
  return (
    <group>
      {positions.map(([x, z], i) => (
        <group key={i} position={[x, ceilingHeight - 0.01, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.02, 12]} />
            <meshStandardMaterial emissive="#fff5e6" emissiveIntensity={3} side={2} />
          </mesh>
          <pointLight
            position={[0, -0.05, 0]}
            intensity={0.4}
            color="#fff5e6"
            distance={3}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}
