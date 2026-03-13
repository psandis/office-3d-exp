import { useControls, button } from 'leva'
import Atmosphere from './world/Atmosphere'
import Level from './objects/Level'
import Desk from './objects/Desk'
import Chair from './objects/Chair'
import Laptop from './objects/Laptop'
import Mouse from './objects/Mouse'
import CeilingLights from './objects/CeilingLights'
import WallPoster from './objects/WallPoster'
import Guy from './objects/Guy'
import LightDesk from './objects/LightDesk'
import Shelf from './objects/Shelf'
import AndroidBot from './objects/AndroidBot'
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
    x: { value: 0.48, min: -2, max: 2, step: 0.01 },
    y: { value: 0, min: -1, max: 2, step: 0.01 },
    z: { value: -0.13, min: -2, max: 2, step: 0.01 },
    scale: { value: 1.7, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const laptop = useControls('Laptop', {
    x: { value: 0.22, min: -2, max: 2, step: 0.01 },
    y: { value: 0.65, min: 0, max: 2, step: 0.01 },
    z: { value: -0.81, min: -2, max: 2, step: 0.01 },
    scale: { value: 1.3, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: Math.PI, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const mouse = useControls('Mouse', {
    x: { value: 0.70, min: -2, max: 2, step: 0.01 },
    y: { value: 0.65, min: 0, max: 2, step: 0.01 },
    z: { value: -0.78, min: -2, max: 2, step: 0.01 },
    scale: { value: 1.5, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const guy = useControls('Guy', {
    x: { value: 0.37, min: -2, max: 2, step: 0.01 },
    y: { value: -0.35, min: -1, max: 2, step: 0.01 },
    z: { value: -0.03, min: -2, max: 2, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 3, step: 0.01 },
    rotY: { value: -Math.PI, min: -Math.PI, max: Math.PI, step: 0.01 },
    animation: { value: 'typing', options: ['sitting', 'typing', 'walking'] },
    'Copy values': button((get) => {
      const vals = { x: get('Guy.x'), y: get('Guy.y'), z: get('Guy.z'), scale: get('Guy.scale'), rotY: get('Guy.rotY'), animation: get('Guy.animation') }
      console.log('[Guy values]', JSON.stringify(vals))
    }),
  })

  const lightDesk = useControls('LightDesk', {
    x: { value: -0.26, min: -2, max: 2, step: 0.01 },
    y: { value: 0.65, min: 0, max: 2, step: 0.01 },
    z: { value: -0.97, min: -2, max: 2, step: 0.01 },
    scale: { value: 0.7, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: 0.76, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const shelf = useControls('Shelf', {
    x: { value: -1.70, min: -2, max: 2, step: 0.01 },
    y: { value: 1.11, min: -1, max: 2, step: 0.01 },
    z: { value: 0.01, min: -2, max: 2, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 5, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const androidBot = useControls('AndroidBot', {
    x: { value: -1.71, min: -2, max: 2, step: 0.01 },
    y: { value: 1.80, min: -1, max: 2.7, step: 0.01 },
    z: { value: 0.01, min: -2, max: 2, step: 0.01 },
    scale: { value: 0.07, min: 0.01, max: 0.5, step: 0.01 },
    rotY: { value: 1.61, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  const poster = useControls('Poster', {
    x: { value: 1.0, min: -2, max: 2, step: 0.01 },
    y: { value: 1.6, min: 0, max: 2.7, step: 0.01 },
    z: { value: -1.48, min: -2, max: 2, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  return (
    <>
      <CameraRig />
      <PostProcessing />
      <Atmosphere />

      {/* Office room */}
      <Level />
      <CeilingLights />
      <WallPoster position={[poster.x, poster.y, poster.z]} rotation={[0, poster.rotY, 0]} />
      <Desk position={[desk.x, desk.y, desk.z]} scale={desk.scale} rotation={[0, desk.rotY, 0]} />
      <Chair position={[chair.x, chair.y, chair.z]} scale={chair.scale} rotation={[0, chair.rotY, 0]} />
      <Laptop position={[laptop.x, laptop.y, laptop.z]} scale={laptop.scale} rotation={[0, laptop.rotY, 0]} />
      <Mouse position={[mouse.x, mouse.y, mouse.z]} scale={mouse.scale} rotation={[0, mouse.rotY, 0]} />
      <Guy position={[guy.x, guy.y, guy.z]} scale={guy.scale} rotation={[0, guy.rotY, 0]} animation={guy.animation} />
      <LightDesk position={[lightDesk.x, lightDesk.y, lightDesk.z]} scale={lightDesk.scale} rotation={[0, lightDesk.rotY, 0]} />
      <Shelf position={[shelf.x, shelf.y, shelf.z]} scale={shelf.scale} rotation={[0, shelf.rotY, 0]} />
      <AndroidBot position={[androidBot.x, androidBot.y, androidBot.z]} scale={androidBot.scale} rotation={[0, androidBot.rotY, 0]} />
    </>
  )
}
