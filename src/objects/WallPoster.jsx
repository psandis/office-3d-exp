import { useMemo, useEffect, useRef, Suspense } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { useVideoTexture } from '@react-three/drei'
import useStore from '../store'
import SceneObject from './SceneObject'

function renderDefaultPoster(ctx) {
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, 660, 460)
  ctx.fillStyle = '#d4593a'
  ctx.fillRect(30, 30, 600, 3)

  ctx.fillStyle = '#d4593a'
  ctx.font = '60px Georgia, serif'
  ctx.fillText('\u201C', 30, 110)

  ctx.fillStyle = '#e0e0e0'
  ctx.font = 'italic 30px Georgia, serif'
  ctx.fillText('Talk is cheap.', 70, 140)
  ctx.fillText('Show me the code.', 70, 185)

  ctx.fillStyle = '#d4593a'
  ctx.font = '60px Georgia, serif'
  ctx.fillText('\u201D', 430, 195)

  ctx.font = '18px Georgia, serif'
  ctx.fillStyle = '#777777'
  ctx.fillText('\u2014 Linus Torvalds', 70, 260)

  ctx.fillStyle = '#d4593a'
  ctx.fillRect(30, 427, 600, 3)
}

function renderCustomText(ctx, text) {
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, 660, 460)
  ctx.fillStyle = '#d4593a'
  ctx.fillRect(30, 30, 600, 3)

  ctx.fillStyle = '#e0e0e0'
  ctx.font = 'italic 28px Georgia, serif'
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > 540) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)

  const startY = 230 - (lines.length * 40) / 2
  lines.forEach((l, i) => {
    ctx.fillText(l, 70, startY + i * 40)
  })

  ctx.fillStyle = '#d4593a'
  ctx.fillRect(30, 427, 600, 3)
}

function VideoMesh() {
  const texture = useVideoTexture(import.meta.env.BASE_URL + 'video/poster-video.mp4', {
    muted: true,
    loop: true,
    playsInline: true,
  })
  return (
    <mesh position={[0, 0, 0.001]}>
      <planeGeometry args={[0.66, 0.46]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function CanvasMesh({ texture }) {
  return (
    <mesh position={[0, 0, 0.001]}>
      <planeGeometry args={[0.66, 0.46]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export default function WallPoster({ introDelay = 0, ...props }) {
  const canvasRef = useRef(document.createElement('canvas'))
  const canvasTexRef = useRef(null)
  const posterMode = useStore((s) => s.posterMode)
  const posterText = useStore((s) => s.posterText)

  const canvasTexture = useMemo(() => {
    canvasRef.current.width = 660
    canvasRef.current.height = 460
    const ctx = canvasRef.current.getContext('2d')
    renderDefaultPoster(ctx)
    const tex = new CanvasTexture(canvasRef.current)
    tex.colorSpace = SRGBColorSpace
    canvasTexRef.current = tex
    return tex
  }, [])

  useEffect(() => {
    if (posterMode === 'video') return
    const ctx = canvasRef.current.getContext('2d')
    if (posterMode === 'text' && posterText) {
      renderCustomText(ctx, posterText)
    } else {
      renderDefaultPoster(ctx)
    }
    if (canvasTexRef.current) canvasTexRef.current.needsUpdate = true
  }, [posterText, posterMode])

  return (
    <SceneObject id="poster" idleAnimation="none" introDelay={introDelay} {...props}>
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.72, 0.52, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {posterMode === 'video' ? (
        <Suspense fallback={<CanvasMesh texture={canvasTexture} />}>
          <VideoMesh />
        </Suspense>
      ) : (
        <CanvasMesh texture={canvasTexture} />
      )}
    </SceneObject>
  )
}
