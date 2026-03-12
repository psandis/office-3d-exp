import { useEffect, useMemo, useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, MeshStandardMaterial, SRGBColorSpace, Float32BufferAttribute } from 'three'
import SceneObject from './SceneObject'

const COMMANDS = {
  help: [{ color: '#bb9af7', text: 'Commands: ls, cat, whoami, node -v, npm run dev, neofetch, clear, echo' }],
  ls: [{ color: '#9ece6a', text: 'src/  public/  package.json  vite.config.js  README.md' }],
  whoami: [{ color: '#9ece6a', text: 'developer' }],
  'node -v': [{ color: '#a9b1d6', text: 'v20.11.0' }],
  'npm run dev': [
    { color: '#9ece6a', text: '  VITE v5.0.0  ready in 420 ms' },
    { text: '' },
    { color: '#7aa2f7', text: '  ➜  Local:   http://localhost:4444/' },
    { color: '#565f89', text: '  ➜  Network: http://192.168.1.42:4444/' },
  ],
  neofetch: [
    { color: '#7aa2f7', text: '       /\\        developer@boxinom' },
    { color: '#7aa2f7', text: '      /  \\       ──────────────────' },
    { color: '#7aa2f7', text: '     /    \\      OS: macOS 15.0' },
    { color: '#7aa2f7', text: '    /      \\     Shell: zsh 5.9' },
    { color: '#7aa2f7', text: '   /   /\\   \\    Terminal: kitty' },
    { color: '#7aa2f7', text: '  /   /  \\   \\   CPU: Apple M3 Pro' },
    { color: '#7aa2f7', text: ' /   /    \\   \\  Memory: 36GB' },
    { color: '#7aa2f7', text: '/___/______\\___\\ Uptime: ∞' },
  ],
}

function renderTerminal(ctx, lines, inputText, cursorOn) {
  ctx.fillStyle = '#1a1b26'
  ctx.fillRect(0, 0, 512, 340)

  // Title bar
  ctx.fillStyle = '#16161e'
  ctx.fillRect(0, 0, 512, 24)
  const dots = [['#f7768e', 12], ['#e0af68', 26], ['#9ece6a', 40]]
  dots.forEach(([color, x]) => {
    ctx.beginPath()
    ctx.arc(x, 12, 5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })
  ctx.fillStyle = '#565f89'
  ctx.font = '10px monospace'
  ctx.fillText('Terminal — zsh', 60, 15)

  // Content
  ctx.font = '12px monospace'
  const lineH = 15
  const startY = 38
  const maxLines = Math.floor((340 - startY) / lineH) - 1 // leave room for input line

  // Only show last N lines that fit
  const visible = lines.slice(-maxLines)
  visible.forEach((line, i) => {
    const y = startY + i * lineH
    if (line.prompt) {
      ctx.fillStyle = '#7aa2f7'
      ctx.fillText('~', 8, y)
      ctx.fillStyle = '#9ece6a'
      ctx.fillText('/boxinom', 18, y)
      ctx.fillStyle = '#a9b1d6'
      ctx.fillText(' $ ' + line.text, 82, y)
    } else {
      ctx.fillStyle = line.color || '#a9b1d6'
      ctx.fillText(line.text, 8, y)
    }
  })

  // Input line at bottom of visible content
  const inputY = startY + visible.length * lineH
  ctx.fillStyle = '#7aa2f7'
  ctx.fillText('~', 8, inputY)
  ctx.fillStyle = '#9ece6a'
  ctx.fillText('/boxinom', 18, inputY)
  ctx.fillStyle = '#a9b1d6'
  ctx.fillText(' $ ' + inputText, 82, inputY)

  // Cursor
  if (cursorOn) {
    const cursorX = 82 + ctx.measureText(' $ ' + inputText).width
    ctx.fillStyle = '#a9b1d6'
    ctx.fillRect(cursorX, inputY - 11, 7, 14)
  }
}

export default function Laptop({ scale = 1.3, rotation, ...props }) {
  const { scene } = useGLTF('/models/laptop.glb')
  const canvasRef = useRef(document.createElement('canvas'))
  const ctxRef = useRef(null)
  const texRef = useRef(null)
  const linesRef = useRef([
    { color: '#7aa2f7', text: 'Welcome to boxinom.com terminal v1.0.0' },
    { color: '#565f89', text: 'Type "help" for available commands.' },
    { text: '' },
  ])
  const inputRef = useRef('')
  const cursorRef = useRef(true)
  const lastBlinkRef = useRef(0)
  const focusedRef = useRef(false)
  const hiddenInputRef = useRef(null)

  // Init canvas + texture
  useMemo(() => {
    canvasRef.current.width = 512
    canvasRef.current.height = 340
    ctxRef.current = canvasRef.current.getContext('2d')
    const tex = new CanvasTexture(canvasRef.current)
    tex.colorSpace = SRGBColorSpace
    texRef.current = tex
    renderTerminal(ctxRef.current, linesRef.current, '', true)
    return tex
  }, [])

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
      }
    })
    return c
  }, [scene])

  useEffect(() => {
    const screenMat = new MeshStandardMaterial({
      map: texRef.current,
      emissive: '#ffffff',
      emissiveMap: texRef.current,
      emissiveIntensity: 0.5,
    })
    cloned.traverse((child) => {
      if (!child.isMesh) return
      if (child.material && child.material.name === 'metal') {
        child.material = screenMat

        // Always overwrite UVs — model has TEXCOORD_0 but values are wrong for our texture
        const geo = child.geometry
        const pos = geo.attributes.position
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
        for (let i = 0; i < pos.count; i++) {
          minX = Math.min(minX, pos.getX(i))
          maxX = Math.max(maxX, pos.getX(i))
          minY = Math.min(minY, pos.getY(i))
          maxY = Math.max(maxY, pos.getY(i))
        }
        const uvs = new Float32Array(pos.count * 2)
        for (let i = 0; i < pos.count; i++) {
          uvs[i * 2] = 1 - (pos.getX(i) - minX) / (maxX - minX || 1)
          uvs[i * 2 + 1] = (pos.getY(i) - minY) / (maxY - minY || 1)
        }
        geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
      }
    })
  }, [cloned])

  // Create hidden DOM input for keyboard capture
  useEffect(() => {
    const input = document.createElement('input')
    input.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;'
    document.body.appendChild(input)
    hiddenInputRef.current = input

    const handleKey = (e) => {
      if (!focusedRef.current) return
      e.stopPropagation()

      if (e.key === 'Enter') {
        const cmd = inputRef.current.trim()
        linesRef.current.push({ prompt: true, text: cmd })

        if (cmd === 'clear') {
          linesRef.current = []
        } else if (cmd.startsWith('echo ')) {
          linesRef.current.push({ color: '#a9b1d6', text: cmd.slice(5) })
        } else if (COMMANDS[cmd]) {
          linesRef.current.push(...COMMANDS[cmd])
        } else if (cmd) {
          linesRef.current.push({ color: '#f7768e', text: `zsh: command not found: ${cmd}` })
        }

        inputRef.current = ''
        input.value = ''
      } else if (e.key === 'Backspace') {
        inputRef.current = inputRef.current.slice(0, -1)
        input.value = inputRef.current
      } else if (e.key.length === 1) {
        inputRef.current += e.key
        input.value = inputRef.current
      }

      renderTerminal(ctxRef.current, linesRef.current, inputRef.current, cursorRef.current)
      texRef.current.needsUpdate = true
    }

    input.addEventListener('keydown', handleKey)
    return () => {
      input.removeEventListener('keydown', handleKey)
      document.body.removeChild(input)
    }
  }, [])

  // Click laptop → focus hidden input
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    focusedRef.current = true
    hiddenInputRef.current?.focus()
  }, [])

  // Click elsewhere → blur
  useEffect(() => {
    const blur = (e) => {
      if (e.target !== hiddenInputRef.current) {
        focusedRef.current = false
      }
    }
    window.addEventListener('pointerdown', blur)
    return () => window.removeEventListener('pointerdown', blur)
  }, [])

  // Blink cursor
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (t - lastBlinkRef.current > 0.5) {
      lastBlinkRef.current = t
      cursorRef.current = !cursorRef.current
      renderTerminal(ctxRef.current, linesRef.current, inputRef.current, cursorRef.current)
      texRef.current.needsUpdate = true
    }
  })

  return (
    <SceneObject id="laptop" idleAnimation="none" rotation={rotation} {...props}>
      <primitive
        object={cloned}
        scale={scale}
        position={[0.17, 0, -0.16]}
        onClick={handleClick}
      />
    </SceneObject>
  )
}

useGLTF.preload('/models/laptop.glb')
