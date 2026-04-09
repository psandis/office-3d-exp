import { useState } from 'react'
import useStore from './store'
import './IntroOverlay.css'

export default function IntroOverlay() {
  const [exploring, setExploring] = useState(false)
  const setIntroComplete = useStore((s) => s.setIntroComplete)

  const handleEnter = () => {
    setExploring(true)
    setTimeout(() => setIntroComplete(), 800)
  }

  return (
    <div className={`intro ${exploring ? 'intro-hidden' : ''}`}>
      <div className="intro-content">
        <div className="intro-badge">3D EXPERIENCE</div>
        <h1 className="intro-title">
          The
          <span className="intro-accent"> Office</span>
        </h1>
        <p className="intro-subtitle">
          An interactive 3D office environment.
          <br />Explore the space, click objects, type on the laptop.
        </p>
        <button className="intro-enter" onClick={handleEnter}>
          <span className="enter-icon">&#9655;</span>
          Explore
        </button>
      </div>
      <div className="intro-footer">
        <p>&copy; 2026 Petri Sandholm</p>
      </div>
    </div>
  )
}
