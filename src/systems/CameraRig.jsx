import { CameraControls, PerspectiveCamera } from '@react-three/drei'

export const cameraControlsRef = { current: null }

export default function CameraRig() {
  return (
    <>
      <CameraControls
        ref={(r) => { cameraControlsRef.current = r }}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={0.3}
        maxDistance={25}
        dollySpeed={1}
        truckSpeed={2}
        smoothTime={0.25}
      />
      <PerspectiveCamera
        makeDefault
        position={[0, 2.5, 7]}
        fov={50}
      />
    </>
  )
}
