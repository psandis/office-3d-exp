# Boxinom 3D Interactive Experience — Grand Vision

## Concept

This is NOT a website. This is a **3D experience** — like walking into a game level. Think Unreal Engine / Unity quality feel, built for the web with React Three Fiber. Visitors land in a living, breathing world at www.boxinom.com. Every object is a placeholder component — no business content wired yet. The scene itself is the product. Content comes later.

The benchmark: **a AAA game lobby meets a portfolio**. Professional, polished, with that gaming touch — particle effects, lighting, post-processing, camera work, ambient life.

## Design Philosophy

- **Game-level design** — treat the scene like a game environment, not a webpage
- **Atmosphere first** — lighting, fog, particles, depth of field, bloom
- **Everything moves** — nothing is static, the world breathes
- **Juicy interactions** — hover feels satisfying, clicks feel impactful (scale bounce, particle burst, sound)
- **Camera is cinematic** — smooth dolly, orbit feels weighted, focus transitions are choreographed
- **60fps or nothing** — performance is not optional

## Architecture: Component Microservices

Every element in the scene is an independent, self-contained module — like microservices, each component owns its own:
- 3D model (GLB)
- Animations (idle, hover, click, intro)
- Shader materials
- Sound effects
- Interaction logic

```
<Experience>
  ├── <World>
  │   ├── <Ground />                    ← environment mesh + material
  │   ├── <Atmosphere />                ← fog, particles, ambient light
  │   └── <Skybox />                    ← HDR environment map
  │
  ├── <InteractiveObjects>
  │   ├── <SceneObject id="obj-1" />    ← placeholder component
  │   ├── <SceneObject id="obj-2" />    ← placeholder component
  │   ├── <SceneObject id="obj-3" />    ← placeholder component
  │   ├── <SceneObject id="obj-4" />    ← placeholder component
  │   ├── <SceneObject id="obj-5" />    ← placeholder component
  │   └── ...more as needed
  │
  ├── <AmbientLife>
  │   ├── <FloatingParticles />         ← dust motes, fireflies, energy
  │   ├── <AnimatedProps />             ← background objects that just live
  │   └── <DynamicLighting />           ← lights that pulse, shift, react
  │
  ├── <PostProcessing>
  │   ├── Bloom
  │   ├── Depth of Field
  │   ├── Vignette
  │   ├── Color Grading
  │   └── SSAO (ambient occlusion)
  │
  ├── <CameraRig />                     ← cinematic camera system
  ├── <SoundEngine />                   ← ambient + interaction sounds
  └── <UIOverlay />                     ← minimal HUD, loading, panels (future)
</Experience>
```

### Each SceneObject has:

| Property | Description |
|----------|-------------|
| `model` | Own .glb file (Draco compressed) |
| `idleAnimation` | Constant subtle motion (float, wobble, rotate, breathe) |
| `hoverEffect` | Glow, outline shader, scale spring, particle emission |
| `clickEffect` | Particle burst, camera dolly, sound, animation sequence |
| `introAnimation` | How it enters the scene on first load (drop in, fade, grow) |
| `position` | Placement in the scene |
| `soundFx` | Hover sound, click sound, ambient loop |

No content IDs, no panels, no business logic — just pure 3D components for now.

### Object Types

**Interactive** — respond to hover and click with satisfying feedback:
- Each object is a placeholder for future content
- Click triggers a cool animation/effect (no panel yet)
- Could be: a floating crystal, a holographic screen, a mechanical device, a glowing orb

**Ambient** — alive but not interactive:
- Floating particles / energy streams
- Background props that animate on loop
- Environmental details (grass, rocks, debris)

**Environmental** — the world itself:
- Ground/floor mesh
- Skybox / HDR environment
- Fog / volumetric lighting
- Dynamic shadows

## Game-Feel Interaction Design

### Hover
- Object emits subtle glow (emissive material ramp)
- Outline shader appears (like selecting an item in a game)
- Object slightly levitates / scales up with spring physics
- Quiet hover sound (soft chime or hum)
- Cursor changes to pointer with custom cursor (optional)

### Click / Tap
- Satisfying "select" sound
- Object does a bounce/pulse animation
- Particle burst from the object (sparks, energy, confetti)
- Camera smoothly pushes toward the object (cinematic dolly)
- For now: camera returns after a beat (no panel yet — just the juicy interaction)

### Camera
- **Default**: slow auto-orbit (like a game menu camera)
- **User control**: orbit with drag, zoom with scroll — weighted, not snappy
- **Focus**: smooth dolly to object on click, smooth return on dismiss
- **Intro**: cinematic sweep on first load (fly through the scene)

## Post-Processing Stack

Using `@react-three/postprocessing`:

| Effect | Purpose |
|--------|---------|
| Bloom | Glow on emissive materials — makes lights pop |
| Depth of Field | Tilt-shift / focus effect when zooming to object |
| Vignette | Darkened edges — cinematic framing |
| Color Grading | Brand color tone across the whole scene |
| SSAO | Ambient occlusion — depth and realism in crevices |
| Chromatic Aberration | Subtle — adds a lens feel (very light) |

## Sound Design

| Trigger | Sound |
|---------|-------|
| Scene load | Ambient pad fades in |
| Idle | Low ambient loop (wind, hum, distant chimes) |
| Hover | Soft tone / chime |
| Click | Satisfying select sound (thunk, chime, whoosh) |
| Camera move | Subtle whoosh |

Libraries: Howler.js or use Web Audio API directly.

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| 3D Engine | React Three Fiber | React renderer for Three.js |
| Scene helpers | @react-three/drei | Camera, Environment, useGLTF, shaders, Html |
| Animation | @react-spring/three | Spring physics for all transitions |
| Post-processing | @react-three/postprocessing | Bloom, DoF, vignette, color grading |
| Particles | three (Points / InstancedMesh) | Custom particle systems |
| Shaders | GLSL (custom) | Outline, glow, dissolve, energy effects |
| State | zustand | Scene state (focused object, camera target, UI state) |
| Sound | Howler.js | Spatial audio, ambient, interaction sounds |
| Build | Vite | Fast dev + production builds |
| 3D Models | Blender → glTF/GLB (Draco) | Each object exported separately |
| AR/VR (future) | @react-three/xr | WebXR — same scene, just add XR wrapper |

## File Structure (Target)

```
boxinom-3d/
├── public/
│   ├── models/
│   │   ├── level.glb
│   │   ├── object-1.glb
│   │   ├── object-2.glb
│   │   ├── object-3.glb
│   │   ├── object-4.glb
│   │   └── object-5.glb
│   ├── sounds/
│   │   ├── ambient.mp3
│   │   ├── hover.mp3
│   │   ├── click.mp3
│   │   └── whoosh.mp3
│   └── textures/
│       └── (HDR environment maps, custom textures)
│
├── src/
│   ├── App.jsx                     # Canvas + experience wrapper
│   ├── Experience.jsx              # Scene composition (the "level")
│   │
│   ├── world/
│   │   ├── Ground.jsx              # Floor/environment mesh
│   │   ├── Atmosphere.jsx          # Fog, ambient light, sky
│   │   ├── Particles.jsx           # Floating particle system
│   │   └── DynamicLights.jsx       # Animated lights
│   │
│   ├── objects/
│   │   ├── SceneObject.jsx         # Base component (hover, click, idle, intro)
│   │   ├── Object1.jsx             # Placeholder component
│   │   ├── Object2.jsx             # Placeholder component
│   │   ├── Object3.jsx             # Placeholder component
│   │   ├── Object4.jsx             # Placeholder component
│   │   └── Object5.jsx             # Placeholder component
│   │
│   ├── systems/
│   │   ├── CameraRig.jsx           # Cinematic camera system
│   │   ├── PostProcessing.jsx      # Bloom, DoF, vignette, color grade
│   │   ├── SoundEngine.jsx         # Audio manager
│   │   └── IntroSequence.jsx       # First-load camera flythrough
│   │
│   ├── shaders/
│   │   ├── outline.glsl            # Selection outline shader
│   │   ├── glow.glsl               # Emissive glow shader
│   │   └── dissolve.glsl           # Transition effect shader
│   │
│   ├── store.js                    # Zustand — scene state
│   ├── theme.js                    # Brand colors, shared constants
│   └── styles.css                  # Minimal global styles
│
├── package.json
└── vite.config.js
```

## Implementation Order

### Phase 1 — The World (foundation)
1. Migrate to Vite
2. Set up project structure
3. Zustand store (focused object, camera state, audio state)
4. Ground + Environment (HDR skybox, ambient light, fog)
5. CameraRig with auto-orbit and manual control
6. Post-processing pipeline (bloom, vignette, color grading)
7. Floating particle system

### Phase 2 — The Objects (interaction)
8. SceneObject base component (idle animation, hover, click)
9. Outline/glow shader for hover state
10. Click effect (particle burst + camera dolly)
11. Wire up existing GLB models as SceneObjects
12. Intro animation sequence (staggered object entrance)
13. Spring physics tuning — make everything feel weighted and satisfying

### Phase 3 — The Sound (immersion)
14. SoundEngine with Howler.js
15. Ambient background loop
16. Hover / click / camera sound effects
17. Volume control + mute toggle

### Phase 4 — The Polish (AAA feel)
18. Depth of Field on focus
19. SSAO for depth
20. Custom cursor
21. Loading screen with progress bar
22. Performance profiling + optimization
23. Mobile/touch controls
24. Brand colors baked into materials and post-processing

### Phase 5 — Custom Assets (brand identity)
25. Design custom 3D models in Blender
26. Replace placeholder objects one by one
27. Custom textures and materials
28. Scene layout redesign

### Phase 6 — Content + AR/VR (future)
29. Wire content panels to objects
30. Add @react-three/xr
31. VR/AR testing and optimization

## Key Principles

- **Game-level quality** — this competes with Unreal/Unity web experiences, not websites
- **Every object is independent** — add, remove, or swap without touching anything else
- **The scene IS the product** — content is secondary, experience is primary
- **Performance is sacred** — 60fps, under 5MB total, lazy load models
- **Sound matters** — a silent 3D scene is a dead 3D scene
- **The demo energy** — the current scene feels alive. Every addition must amplify that, never dilute it
- **No premature content** — objects are placeholders until the experience is solid
