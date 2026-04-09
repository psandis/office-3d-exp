# Office 3D Experience

![Office 3D Experience](public/office-3d-exp.png)

**Live demo:** https://psandis.github.io/office-3d-exp/

An interactive 3D office scene rendered in the browser. A developer character sits at a desk typing on a laptop with a working terminal emulator. A puppy sits on the floor next to its bowl. A radio plays lounge music. Every object has sound, glow, and spring-based animations. Click around, drag the android bot, type commands in the terminal, and change the wall poster from the command line.

## Live Features

- **Interactive Terminal** - Click the laptop to zoom in and type commands. Supports ls, cat, whoami, neofetch, echo, clear, and poster commands that change the wall art in real time
- **Animated Character** - Mixamo-rigged developer with sitting, typing, and walking animations. Click to trigger typing sounds. Custom blue eyes with positioned iris discs
- **Radio with Music** - Plays office lounge music. Visual speaker cone animation and floating musical notes when active
- **Puppy** - Animated dog sitting on the office floor with a food bowl and bark sound effect
- **Draggable Android Bot** - Grab and slide the robot figurine along the shelf. Plays robot sound and shows animated tone indicators
- **Desk Lamp** - Click for a lamp click sound effect
- **Interactive Wall Poster** - Default Linus Torvalds quote. Change it from the laptop terminal: `poster <text>`, `poster video`, `poster reset`
- **Intro Overlay** - Entry screen with staggered object entrance animations
- **Post-Processing** - Bloom with luminance threshold, vignette
- **Hover Glow** - Emissive glow shader on interactive objects with smooth lerp transitions
- **Sound Design** - Typing, lamp click, robot beep, dog bark, bowl clink, and background music
- **Office Environment** - 4m x 3m x 2.7m room with procedural carpet texture, window with glass transmission, ceiling lights, baseboards

## Scene Objects

| Object | Model | Details |
|--------|-------|---------|
| Developer | guy.glb + FBX animations | Typing animation, click for sound |
| Puppy | puppy-idle.glb | Animated dog with bark sound |
| Dog Bowl | dog-bowl.glb | Bowl with clink sound |
| Radio | radio.glb | Plays lounge music, speaker animation |
| Desk | sitting-desk.glb | Office desk |
| Chair | desk-chair.glb | Office chair |
| Laptop | laptop.glb | Canvas texture terminal with camera zoom |
| Mouse | mouse.glb | Desktop mouse |
| Desk Lamp | light-desk.glb | Click for lamp sound |
| Shelf | shelf.glb | Wall-mounted shelf |
| Android Bot | android-bot.glb | Draggable, plays robot sound |
| Sudo | level-react-draco.glb | Spring-animated head figurine |
| Camera | level-react-draco.glb | Animated rotation |
| Cactus | level-react-draco.glb | Wobble material |
| Wall Poster | Procedural canvas / video | Changeable from terminal |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| 3D Engine | React Three Fiber |
| Scene Helpers | @react-three/drei |
| Animation | @react-spring/three |
| Post-Processing | @react-three/postprocessing |
| State | Zustand |
| Debug GUI | Leva |
| Build | Vite |
| 3D Models | Blender, Mixamo (GLB/FBX) |

## Project Structure

```
office-3d-exp/
├── public/
│   ├── models/                       GLB models and FBX animations
│   ├── sounds/                       Audio files (music, effects)
│   ├── video/                        Poster video content
│   └── office-3d-exp.png             Screenshot
├── src/
│   ├── App.jsx                       Canvas, Leva, intro overlay
│   ├── Experience.jsx                Scene composition with Leva controls
│   ├── AudioManager.jsx              Background music manager
│   ├── IntroOverlay.jsx              Entry screen overlay
│   ├── IntroOverlay.css              Overlay styles
│   ├── store.js                      Zustand state
│   ├── theme.js                      Shared color and effect constants
│   ├── styles.css                    Global styles
│   ├── objects/
│   │   ├── SceneObject.jsx           Base wrapper (hover glow, drag, intro)
│   │   ├── Guy.jsx                   Animated character
│   │   ├── Laptop.jsx                Terminal emulator with camera zoom
│   │   ├── Radio.jsx                 Music player with speaker animation
│   │   ├── Puppy.jsx                 Animated dog
│   │   ├── DogBowl.jsx              Dog food bowl
│   │   ├── AndroidBot.jsx           Draggable robot with sound
│   │   ├── LightDesk.jsx            Lamp with click sound
│   │   ├── WallPoster.jsx           Dynamic poster (text/video)
│   │   ├── Sudo.jsx                 Spring-animated head figurine
│   │   ├── CameraObj.jsx            Animated camera decoration
│   │   ├── Cactus.jsx               Wobble material cactus
│   │   ├── Level.jsx                Room geometry
│   │   ├── CeilingLights.jsx        Overhead lighting
│   │   └── ...                      Desk, Chair, Mouse, Shelf
│   ├── systems/
│   │   ├── CameraRig.jsx            Orbit camera with exported ref
│   │   └── PostProcessing.jsx       Bloom + vignette
│   └── world/
│       ├── Atmosphere.jsx           Environment map + ambient light
│       └── Particles.jsx            Floating particles
├── package.json
└── vite.config.js
```

## Getting Started

```bash
npm install
npm run dev
```

Opens at http://localhost:4444

## Build

```bash
npm run build
npm run preview
```

## License

[MIT](LICENSE)

---

© 2026 Petri Sandholm
