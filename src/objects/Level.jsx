const wallColor = '#e8e0d4'
const floorColor = '#c9b99a'
const accentColor = '#d4593a'

// 1 unit = 1 meter. Room: 4m wide, 3m deep, 2.7m tall
const W = 4
const D = 3
const H = 2.7

export default function Level() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right wall (accent) */}
      <mesh position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Baseboards */}
      <mesh position={[0, 0.05, -D / 2 + 0.01]}>
        <boxGeometry args={[W, 0.1, 0.02]} />
        <meshStandardMaterial color="#bdb5a8" />
      </mesh>
      <mesh position={[-W / 2 + 0.01, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, D]} />
        <meshStandardMaterial color="#bdb5a8" />
      </mesh>
      <mesh position={[W / 2 - 0.01, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, D]} />
        <meshStandardMaterial color="#bdb5a8" />
      </mesh>
    </group>
  )
}
