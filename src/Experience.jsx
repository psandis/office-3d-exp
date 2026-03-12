import { useControls } from 'leva'
import Atmosphere from './world/Atmosphere'
import Level from './objects/Level'
import Desk from './objects/Desk'
import Chair from './objects/Chair'
import Laptop from './objects/Laptop'
import Mouse from './objects/Mouse'
import CameraRig from './systems/CameraRig'
import PostProcessing from './systems/PostProcessing'

export default function Experience() {
  const desk = useControls('Desk', {
    x: { value: 0, min: -2, max: 2, step: 0.01 },
    y: { value: 0, min: -1, max: 2, step: 0.01 },
    z: { value: -1, min: -2, max: 2, step: 0.01 },
    scale: { value: 1.5, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const chair = useControls('Chair', {
    x: { value: 0.30, min: -2, max: 2, step: 0.01 },
    y: { value: 0.08, min: -1, max: 2, step: 0.01 },
    z: { value: -0.2, min: -2, max: 2, step: 0.01 },
    scale: { value: 1.7, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const laptop = useControls('Laptop', {
    x: { value: 0.20, min: -2, max: 2, step: 0.01 },
    y: { value: 0.65, min: 0, max: 2, step: 0.01 },
    z: { value: -0.8, min: -2, max: 2, step: 0.01 },
    scale: { value: 1.3, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: Math.PI, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const mouse = useControls('Mouse', {
    x: { value: 0.51, min: -2, max: 2, step: 0.01 },
    y: { value: 0.65, min: 0, max: 2, step: 0.01 },
    z: { value: -0.7, min: -2, max: 2, step: 0.01 },
    scale: { value: 1.5, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  return (
    <>
      <CameraRig />
      <PostProcessing />
      <Atmosphere />

      {/* Office room */}
      <Level />
      <Desk position={[desk.x, desk.y, desk.z]} scale={desk.scale} rotation={[0, desk.rotY, 0]} />
      <Chair position={[chair.x, chair.y, chair.z]} scale={chair.scale} rotation={[0, chair.rotY, 0]} />
      <Laptop position={[laptop.x, laptop.y, laptop.z]} scale={laptop.scale} rotation={[0, laptop.rotY, 0]} />
      <Mouse position={[mouse.x, mouse.y, mouse.z]} scale={mouse.scale} rotation={[0, mouse.rotY, 0]} />
    </>
  )
}
