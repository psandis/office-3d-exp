import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Experience from './Experience'
import IntroOverlay from './IntroOverlay'
import AudioManager from './AudioManager'
import useStore from './store'

export default function App() {
  const introComplete = useStore((s) => s.introComplete)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <Leva hidden={!introComplete || isMobile} collapsed />
      <Canvas flat>
        <Experience />
      </Canvas>
      <IntroOverlay />
      <AudioManager />
    </>
  )
}
