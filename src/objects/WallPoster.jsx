import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import SceneObject from './SceneObject'

function createPosterTexture() {
  const c = document.createElement('canvas')
  c.width = 660
  c.height = 460
  const ctx = c.getContext('2d')

  // Dark background
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, 660, 460)

  // Decorative top line
  ctx.fillStyle = '#d4593a'
  ctx.fillRect(30, 30, 600, 3)

  // Quote marks
  ctx.fillStyle = '#d4593a'
  ctx.font = '60px Georgia, serif'
  ctx.fillText('\u201C', 30, 110)

  // Quote text
  ctx.fillStyle = '#e0e0e0'
  ctx.font = 'italic 30px Georgia, serif'
  ctx.fillText('Talk is cheap.', 70, 140)
  ctx.fillText('Show me the code.', 70, 185)

  // Closing quote
  ctx.fillStyle = '#d4593a'
  ctx.font = '60px Georgia, serif'
  ctx.fillText('\u201D', 430, 195)

  // Attribution
  ctx.font = '18px Georgia, serif'
  ctx.fillStyle = '#777777'
  ctx.fillText('\u2014 Linus Torvalds', 70, 260)

  // Bottom decorative line
  ctx.fillStyle = '#d4593a'
  ctx.fillRect(30, 427, 600, 3)

  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  return tex
}

export default function WallPoster({ ...props }) {
  const texture = useMemo(() => createPosterTexture(), [])

  return (
    <SceneObject id="poster" idleAnimation="none" {...props}>
      {/* Frame */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.72, 0.52, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Poster */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[0.66, 0.46]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </SceneObject>
  )
}
