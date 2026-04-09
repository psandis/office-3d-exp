import { useEffect, useMemo, useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { AnimationMixer, CircleGeometry, Euler, MeshBasicMaterial, Mesh, Quaternion } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import SceneObject from './SceneObject'

const MODEL_SCALE_CORRECTION = 0.127
const TYPING_SOUND = import.meta.env.BASE_URL + 'sounds/dragon-studio-keyboard-typing-sound-effect-335503.mp3'

const ANIMATIONS = {
  sitting: import.meta.env.BASE_URL + 'models/animate-guy/Sitting.fbx',
  typing: import.meta.env.BASE_URL + 'models/animate-guy/Typing.fbx',
  walking: import.meta.env.BASE_URL + 'models/animate-guy/Walking.fbx',
}

export default function Guy({ scale = 1, animation = 'typing', rotation, introDelay = 0, iris = {}, ...props }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/guy.glb')
  const clonedScene = useMemo(() => clone(scene), [scene])
  const mixerRef = useRef(null)
  const currentAction = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const playSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TYPING_SOUND)
      audioRef.current.volume = 0.5
    }
    clearTimeout(timerRef.current)
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
    timerRef.current = setTimeout(() => {
      audioRef.current.pause()
    }, 5000)
  }, [])

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
    <SceneObject id="guy" noGlow idleAnimation="none" introDelay={introDelay} rotation={rotation} {...props}>
      <mesh visible={false} position={[0, 1.0, 0.15]} onClick={(e) => { e.stopPropagation(); playSound() }}>
        <boxGeometry args={[0.4, 1.8, 0.3]} />
      </mesh>
      <primitive object={clonedScene} scale={scale * MODEL_SCALE_CORRECTION} />
    </SceneObject>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/guy.glb')
