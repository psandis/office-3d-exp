import { CameraControls, PerspectiveCamera } from '@react-three/drei'
import { theme } from '../theme'

export default function CameraRig() {
  return (
    <>
      <CameraControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.6}
        minDistance={5}
        maxDistance={30}
      />
      <PerspectiveCamera
        makeDefault
        position={theme.camera.defaultPosition}
        fov={50}
      />
    </>
  )
}
