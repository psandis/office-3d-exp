import { useMemo } from 'react'
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

const wallColor = '#e8e0d4'
const accentColor = '#d4593a'

// 1 unit = 1 meter. Room: 4m wide, 3m deep, 2.7m tall
const W = 4
const D = 3
const H = 2.7

function createCarpetTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Base carpet color — warm dark grey
  ctx.fillStyle = '#4a4a52'
  ctx.fillRect(0, 0, size, size)

  // Add subtle fiber noise
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const r = Math.random()
      if (r > 0.5) {
        const shade = 68 + Math.floor(Math.random() * 20)
        ctx.fillStyle = `rgb(${shade},${shade},${shade + 6})`
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }

  // Subtle grid pattern (like carpet tiles)
  ctx.strokeStyle = 'rgba(60,60,68,0.4)'
  ctx.lineWidth = 1
  const tileSize = size / 4
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath()
    ctx.moveTo(i * tileSize, 0)
    ctx.lineTo(i * tileSize, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * tileSize)
    ctx.lineTo(size, i * tileSize)
    ctx.stroke()
  }

  const tex = new CanvasTexture(canvas)
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.repeat.set(4, 3)
  tex.colorSpace = SRGBColorSpace
  return tex
}

export default function Level() {
  const carpetTex = useMemo(() => createCarpetTexture(), [])

  return (
    <group>
      {/* Floor — carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={carpetTex} roughness={0.95} />
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

      {/* Window on back wall */}
      <group position={[-0.8, H * 0.55, -D / 2 + 0.01]}>
        {/* Window glass — emissive sky light */}
        <mesh>
          <planeGeometry args={[1.2, 1.4]} />
          <meshStandardMaterial
            color="#87ceeb"
            emissive="#87ceeb"
            emissiveIntensity={0.6}
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
        {/* Frame */}
        <mesh position={[0, 0.715, 0.005]}>
          <boxGeometry args={[1.28, 0.05, 0.03]} />
          <meshStandardMaterial color="#d4d0c8" />
        </mesh>
        <mesh position={[0, -0.715, 0.005]}>
          <boxGeometry args={[1.28, 0.05, 0.03]} />
          <meshStandardMaterial color="#d4d0c8" />
        </mesh>
        <mesh position={[-0.615, 0, 0.005]}>
          <boxGeometry args={[0.05, 1.48, 0.03]} />
          <meshStandardMaterial color="#d4d0c8" />
        </mesh>
        <mesh position={[0.615, 0, 0.005]}>
          <boxGeometry args={[0.05, 1.48, 0.03]} />
          <meshStandardMaterial color="#d4d0c8" />
        </mesh>
        {/* Sill */}
        <mesh position={[0, -0.74, 0.04]}>
          <boxGeometry args={[1.4, 0.04, 0.1]} />
          <meshStandardMaterial color="#d4d0c8" />
        </mesh>
      </group>

      {/* Window light casting into room */}
      <pointLight position={[-0.8, H * 0.55, -D / 2 + 0.3]} intensity={0.8} color="#b4d7e8" distance={4} />

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
