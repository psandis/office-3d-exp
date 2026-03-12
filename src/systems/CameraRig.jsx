import { CameraControls, PerspectiveCamera } from '@react-three/drei'

export default function CameraRig() {
  return (
    <>
      <CameraControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={1}
        maxDistance={25}
        dollySpeed={1}
        truckSpeed={2}
        smoothTime={0.25}
      />
      <PerspectiveCamera
        makeDefault
        position={[6, 5, 6]}
        fov={50}
      />
    </>
  )
}
