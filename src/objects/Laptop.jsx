import { useEffect, useMemo, useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Box3, CanvasTexture, Float32BufferAttribute, MathUtils, MeshStandardMaterial, SRGBColorSpace, Vector3 } from 'three'
import SceneObject from './SceneObject'
import { cameraControlsRef } from '../systems/CameraRig'
import useStore from '../store'

const COMMANDS = {
  help: [
    { color: '#bb9af7', text: 'Available commands:' },
    { color: '#9ece6a', text: '  ls, cat, whoami, node -v' },
    { color: '#9ece6a', text: '  npm run dev, neofetch' },
    { color: '#9ece6a', text: '  clear, echo, poster' },
  ],
  ls: [{ color: '#9ece6a', text: 'src/  public/  package.json  vite.config.js  README.md' }],
  'cat README.md': [
    { color: '#a9b1d6', text: '# Office 3D Experience' },
    { text: '' },
    { color: '#a9b1d6', text: 'Interactive 3D office built with' },
    { color: '#a9b1d6', text: 'React Three Fiber + Zustand.' },
    { text: '' },
    { color: '#a9b1d6', text: 'Click objects. Type commands.' },
    { color: '#a9b1d6', text: 'Play with the radio.' },
  ],
  'cat package.json': [
    { color: '#565f89', text: '{' },
    { color: '#7aa2f7', text: '  "name": "office-3d-exp",' },
    { color: '#7aa2f7', text: '  "version": "0.3.0",' },
    { color: '#7aa2f7', text: '  "private": true' },
    { color: '#565f89', text: '}' },
  ],
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

const focusBox = new Box3()
const focusCenter = new Vector3()
const focusSize = new Vector3()
const focusTarget = new Vector3()
const focusDirection = new Vector3()
const focusPosition = new Vector3()
const currentTarget = new Vector3()
const currentPosition = new Vector3()

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

export default function Laptop({ scale = 1.3, rotation, introDelay = 0, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/laptop.glb')
  const introComplete = useStore((s) => s.introComplete)
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
  const laptopObjectRef = useRef(null)
  const camSavedRef = useRef(false)
  const pointerDownOnLaptopRef = useRef(false)
  const screenMaterialRef = useRef(null)

  const restoreCamera = useCallback(() => {
    const cc = cameraControlsRef.current
    if (cc && camSavedRef.current) {
      focusedRef.current = false
      cc.reset(true)
      camSavedRef.current = false
    }
  }, [])

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
    screenMaterialRef.current = screenMat
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
        } else if (cmd === 'cat') {
          linesRef.current.push({ color: '#f7768e', text: 'Usage: cat <filename>' })
        } else if (cmd.startsWith('cat ') && !COMMANDS[cmd]) {
          linesRef.current.push({ color: '#f7768e', text: `cat: ${cmd.slice(4)}: No such file` })
        } else if (cmd === 'poster reset') {
          useStore.getState().setPosterMode('default')
          useStore.getState().setPosterText(null)
          linesRef.current.push({ color: '#9ece6a', text: 'Poster reset to default.' })
        } else if (cmd === 'poster video') {
          useStore.getState().setPosterMode('video')
          useStore.getState().setPosterText(null)
          linesRef.current.push({ color: '#9ece6a', text: 'Poster mode: video' })
        } else if (cmd.startsWith('poster ')) {
          const text = cmd.slice(7).slice(0, 80)
          if (text) {
            useStore.getState().setPosterMode('text')
            useStore.getState().setPosterText(text)
            linesRef.current.push({ color: '#9ece6a', text: `Poster updated: "${text}"` })
          } else {
            linesRef.current.push({ color: '#f7768e', text: 'Usage: poster <text|video|reset>' })
          }
        } else if (cmd === 'poster') {
          linesRef.current.push({ color: '#bb9af7', text: 'Usage: poster <text|video|reset>' })
          linesRef.current.push({ color: '#565f89', text: 'poster <text>  — custom text (max 80 chars)' })
          linesRef.current.push({ color: '#565f89', text: 'poster video   — animated display' })
          linesRef.current.push({ color: '#565f89', text: 'poster reset   — back to default' })
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

  // Click laptop → focus hidden input + zoom camera to laptop
  const handlePointerDown = useCallback((e) => {
    if (e.object?.material !== screenMaterialRef.current) return
    e.stopPropagation()
    pointerDownOnLaptopRef.current = true
  }, [])

  const handleClick = useCallback((e) => {
    if (e.object?.material !== screenMaterialRef.current) return
    e.stopPropagation()
    const cc = cameraControlsRef.current
    const laptopObject = laptopObjectRef.current

    if (camSavedRef.current) {
      restoreCamera()
      hiddenInputRef.current?.blur()
      return
    }

    focusedRef.current = true
    hiddenInputRef.current?.focus()

    if (cc && laptopObject) {
      laptopObject.updateWorldMatrix(true, true)
      focusBox.setFromObject(laptopObject)
      if (focusBox.isEmpty()) return

      focusBox.getCenter(focusCenter)
      focusBox.getSize(focusSize)

      const camera = cc.camera
      const verticalFov = MathUtils.degToRad(camera.getEffectiveFOV ? camera.getEffectiveFOV() : camera.fov)
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
      const fitHeightDistance = (focusSize.y * 0.5) / Math.tan(verticalFov / 2)
      const fitWidthDistance = (focusSize.x * 0.5) / Math.tan(horizontalFov / 2)
      const fitDepthDistance = focusSize.z * 1.8
      const focusDistance = Math.max(fitHeightDistance, fitWidthDistance, fitDepthDistance) * 0.85

      cc.getTarget(currentTarget)
      cc.getPosition(currentPosition)
      focusDirection.subVectors(currentPosition, currentTarget)

      if (focusDirection.lengthSq() < 1e-6) {
        focusDirection.set(1, 0.5, 1)
      }

      focusDirection.normalize()
      focusTarget.copy(focusCenter).setY(focusCenter.y + focusSize.y * 0.1)
      focusPosition.copy(focusTarget).addScaledVector(focusDirection, focusDistance)

      cc.saveState()
      camSavedRef.current = true
      cc.setLookAt(
        focusPosition.x,
        focusPosition.y,
        focusPosition.z,
        focusTarget.x,
        focusTarget.y,
        focusTarget.z,
        true,
      )
    }
  }, [restoreCamera])

  // Click elsewhere → blur + restore camera
  useEffect(() => {
    const blur = () => {
      if (pointerDownOnLaptopRef.current) {
        pointerDownOnLaptopRef.current = false
        return
      }

      restoreCamera()
    }
    window.addEventListener('pointerdown', blur)
    return () => window.removeEventListener('pointerdown', blur)
  }, [restoreCamera])

  // Make the hidden terminal input ready once the scene has fully entered.
  useEffect(() => {
    if (!introComplete || !hiddenInputRef.current) return
    const timer = setTimeout(() => {
      focusedRef.current = true
      hiddenInputRef.current?.focus()
    }, introDelay + 900)
    return () => clearTimeout(timer)
  }, [introComplete, introDelay])

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
    <SceneObject id="laptop" idleAnimation="none" introDelay={introDelay} rotation={rotation} {...props}>
      <primitive
        ref={laptopObjectRef}
        object={cloned}
        scale={scale}
        position={[0.17, 0, -0.16]}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/laptop.glb')
