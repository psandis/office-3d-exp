import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { theme } from '../theme'

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={theme.bloom.intensity}
        luminanceThreshold={theme.bloom.luminanceThreshold}
        luminanceSmoothing={theme.bloom.luminanceSmoothing}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.1} darkness={0.4} />
    </EffectComposer>
  )
}
