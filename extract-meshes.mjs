import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { cloneDocument, prune } from '@gltf-transform/functions'
import draco3d from 'draco3dgltf'

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  })

const doc = await io.read('./public/level-react-draco.glb')
const root = doc.getRoot()
const scene = root.listScenes()[0]

for (const node of scene.listChildren()) {
  const name = node.getName()
  if (name === 'Level') continue // keep Level in the main file

  const clone = cloneDocument(doc)
  const cloneScene = clone.getRoot().listScenes()[0]
  for (const n of cloneScene.listChildren()) {
    if (n.getName() !== name) {
      n.dispose()
    }
  }

  await clone.transform(prune())

  const outPath = `./public/models/${name.toLowerCase()}.glb`
  await io.write(outPath, clone)
  console.log(`Extracted: ${name} → ${outPath}`)
}

console.log('Done.')
