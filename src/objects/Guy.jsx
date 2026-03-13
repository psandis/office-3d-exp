import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { AnimationMixer, CircleGeometry, Euler, MeshBasicMaterial, Mesh, Quaternion } from 'three'
import { useControls } from 'leva'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import SceneObject from './SceneObject'

const MODEL_SCALE_CORRECTION = 0.127

const ANIMATIONS = {
  sitting: '/models/animate-guy/Sitting.fbx',
  typing: '/models/animate-guy/Typing.fbx',
  walking: '/models/animate-guy/Walking.fbx',
}

export default function Guy({ scale = 1, animation = 'typing', rotation, ...props }) {
  const { scene } = useGLTF('/models/guy.glb')
  const clonedScene = useMemo(() => clone(scene), [scene])
  const mixerRef = useRef(null)
  const currentAction = useRef(null)

  // Load all FBX animation files
  const sittingFbx = useLoader(FBXLoader, ANIMATIONS.sitting)
  const typingFbx = useLoader(FBXLoader, ANIMATIONS.typing)
  const walkingFbx = useLoader(FBXLoader, ANIMATIONS.walking)

  const clips = useMemo(() => {
    const fix = (clip) => {
      if (!clip) return clip
      // Fix bone names and strip position tracks (they're in FBX scale, not GLB)
      clip.tracks = clip.tracks.filter((track) => {
        track.name = track.name.replace(/mixamorig:/g, 'mixamorig')
        // Strip position tracks (FBX scale mismatch) and Armature root tracks
        if (track.name.endsWith('.position')) return false
        if (track.name.startsWith('Armature.')) return false
        return true
      })
      return clip
    }
    return {
      sitting: fix(sittingFbx.animations[0]),
      typing: fix(typingFbx.animations[0]),
      walking: fix(walkingFbx.animations[0]),
    }
  }, [sittingFbx, typingFbx, walkingFbx])

  // Create mixer
  useEffect(() => {
    mixerRef.current = new AnimationMixer(clonedScene)
    return () => mixerRef.current?.stopAllAction()
  }, [clonedScene])

  // Play selected animation
  useEffect(() => {
    const mixer = mixerRef.current
    const clip = clips[animation]
    if (!mixer || !clip) return

    if (currentAction.current) {
      currentAction.current.fadeOut(0.3)
    }

    const action = mixer.clipAction(clip)
    action.reset().fadeIn(0.3).play()
    currentAction.current = action
  }, [animation, clips, clonedScene])

  // Get head bone
  const headBone = useMemo(() => clonedScene.getObjectByName('mixamorigHead'), [clonedScene])
  const headTiltQuat = useMemo(() => new Quaternion().setFromEuler(new Euler(0.25, 0, 0)), [])

  // Style eyes blue
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material?.name === 'Eyes') {
        child.material = child.material.clone()
        child.material.color.set('#4a90d9')
      }
    })
  }, [clonedScene])

  // Add black iris discs to head bone
  const iris = useControls('Iris position', {
    x: { value: 0.3, min: -2, max: 2, step: 0.01 },
    y: { value: 0.6, min: -2, max: 2, step: 0.01 },
    z: { value: 0.5, min: -2, max: 2, step: 0.01 },
    spacing: { value: 0.6, min: 0, max: 2, step: 0.01 },
    size: { value: 0.15, min: 0.01, max: 0.5, step: 0.01 },
  })

  useEffect(() => {
    if (!headBone) return
    const geom = new CircleGeometry(iris.size, 16)
    const mat = new MeshBasicMaterial({ color: '#000000' })

    // Remove old irises
    const old = headBone.children.filter(c => c.userData.isIris)
    old.forEach(c => { headBone.remove(c); c.geometry.dispose() })

    const leftIris = new Mesh(geom, mat)
    leftIris.position.set(-iris.spacing / 2 + iris.x, iris.y, iris.z)
    leftIris.userData.isIris = true
    headBone.add(leftIris)

    const rightIris = new Mesh(geom.clone(), mat)
    rightIris.position.set(iris.spacing / 2 + iris.x, iris.y, iris.z)
    rightIris.userData.isIris = true
    headBone.add(rightIris)
  }, [headBone, iris])

  // Tick the mixer, then apply head tilt to look down at laptop
  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
    if (headBone) {
      headBone.quaternion.multiply(headTiltQuat)
    }
  })

  return (
    <SceneObject id="guy" idleAnimation="none" rotation={rotation} {...props}>
      <primitive object={clonedScene} scale={scale * MODEL_SCALE_CORRECTION} />
    </SceneObject>
  )
}

useGLTF.preload('/models/guy.glb')
