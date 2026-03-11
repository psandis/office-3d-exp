import Atmosphere from './world/Atmosphere'
import Particles from './world/Particles'
import Level from './objects/Level'
import Sudo from './objects/Sudo'
import CameraObj from './objects/CameraObj'
import Cactus from './objects/Cactus'
import FloatingBox from './objects/FloatingBox'
import CameraRig from './systems/CameraRig'
import PostProcessing from './systems/PostProcessing'

export default function Experience() {
  return (
    <>
      {/* Systems */}
      <CameraRig />
      <PostProcessing />

      {/* World */}
      <Atmosphere />
      <Particles />

      {/* Scene objects — each is an independent component */}
      <group scale={20} position={[5, -11, -5]}>
        <Level />
        <Sudo />
        <CameraObj />
        <Cactus />
        <FloatingBox position={[-0.8, 1.4, 0.4]} scale={0.15} />
      </group>
    </>
  )
}
