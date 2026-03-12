export default function Window({ ...props }) {
  return (
    <group {...props}>
      {/* Glass — emissive sky light */}
      <mesh>
        <planeGeometry args={[1.2, 1.4]} />
        <meshStandardMaterial
          color="#87ceeb"
          emissive="#87ceeb"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Horizontal divider */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[1.2, 0.03, 0.02]} />
        <meshStandardMaterial color="#d4d0c8" />
      </mesh>
      {/* Vertical divider */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.03, 1.4, 0.02]} />
        <meshStandardMaterial color="#d4d0c8" />
      </mesh>
      {/* Frame — top */}
      <mesh position={[0, 0.715, 0.005]}>
        <boxGeometry args={[1.28, 0.05, 0.03]} />
        <meshStandardMaterial color="#d4d0c8" />
      </mesh>
      {/* Frame — bottom */}
      <mesh position={[0, -0.715, 0.005]}>
        <boxGeometry args={[1.28, 0.05, 0.03]} />
        <meshStandardMaterial color="#d4d0c8" />
      </mesh>
      {/* Frame — left */}
      <mesh position={[-0.615, 0, 0.005]}>
        <boxGeometry args={[0.05, 1.48, 0.03]} />
        <meshStandardMaterial color="#d4d0c8" />
      </mesh>
      {/* Frame — right */}
      <mesh position={[0.615, 0, 0.005]}>
        <boxGeometry args={[0.05, 1.48, 0.03]} />
        <meshStandardMaterial color="#d4d0c8" />
      </mesh>
      {/* Sill */}
      <mesh position={[0, -0.74, 0.04]}>
        <boxGeometry args={[1.4, 0.04, 0.1]} />
        <meshStandardMaterial color="#d4d0c8" />
      </mesh>
      {/* Light casting into room */}
      <pointLight
        position={[0, 0, 0.3]}
        intensity={0.3}
        color="#b4d7e8"
        distance={3}
        decay={2}
      />
    </group>
  )
}
