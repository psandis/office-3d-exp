import { Environment } from '@react-three/drei'

export default function Atmosphere() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <Environment preset="city" background blur={1} />
    </>
  )
}
