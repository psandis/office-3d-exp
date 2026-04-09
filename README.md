# Office 3D Experience

![Office 3D Experience](public/office-3d-exp.png)

**Live demo:** https://psandis.github.io/office-3d-exp/

An interactive 3D office scene rendered in the browser. A developer character sits at a desk typing on a laptop with a working terminal emulator, surrounded by office furniture, wall art, and shelf decorations. The scene features post-processing effects, spring-based animations, and orbit camera controls.

## Live Features

- **Interactive Terminal** - Click the laptop to type commands into a live terminal emulator rendered as a canvas texture. Supports ls, whoami, neofetch, echo, clear, and more
- **Animated Character** - Mixamo-rigged character with sitting, typing, and walking animations. Head tilts down toward the laptop, eyes are custom blue with positioned iris discs
- **Animated Decorations** - Sudo figurine with spring-driven head that wanders randomly, camera object with animated rotation, cactus with wobble material
- **Post-Processing** - Bloom with luminance threshold, vignette darkening at edges
- **Office Environment** - 4m x 3m x 2.7m room with carpet floor (procedural texture), window with glass transmission, ceiling lights, wall poster with Linus Torvalds quote, baseboards
- **Debug Controls** - Full Leva GUI for positioning every object in real time

## Scene Objects

| Object | Model | Details |
|--------|-------|---------|
| Developer | guy.glb + FBX animations | Typing animation, custom eyes |
| Desk | sitting-desk.glb | Sitting height desk |
| Chair | desk-chair.glb | Office chair |
| Laptop | laptop.glb | Canvas texture terminal |
| Mouse | mouse.glb | Desktop mouse |
| Desk Lamp | light-desk.glb | Angled lamp |
| Shelf | shelf.glb | Wall-mounted shelf |
| Android Bot | android-bot.glb | Shelf decoration |
| Sudo | level-react-draco.glb | Animated head figurine |
| Camera | level-react-draco.glb | Animated rotation |
| Cactus | level-react-draco.glb | Wobble material |
| Wall Poster | Procedural canvas | "Talk is cheap. Show me the code." |

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| 3D Engine | React Three Fiber | 8.14 |
| Scene Helpers | @react-three/drei | 9.88 |
| Animation | @react-spring/three | 9.7 |
| Post-Processing | @react-three/postprocessing | 2.15 |
| State | Zustand | 4.4 |
| Debug GUI | Leva | 0.10 |
| Build | Vite | 5.0 |
| 3D Models | Blender, Mixamo (GLB/FBX) | - |

## Project Structure

```
office-3d-exp/
├── public/
│   ├── models/
│   │   ├── guy.glb                   Character model
│   │   ├── animate-guy/              FBX animations (Sitting, Typing, Walking)
│   │   ├── laptop.glb                Laptop with terminal texture target
│   │   ├── sitting-desk.glb          Office desk
│   │   ├── desk-chair.glb            Office chair
│   │   ├── mouse.glb                 Desktop mouse
│   │   ├── light-desk.glb            Desk lamp
│   │   ├── shelf.glb                 Wall shelf
│   │   └── android-bot.glb           Android figurine
│   └── office-3d-exp.png             Screenshot
├── src/
│   ├── App.jsx                       Canvas setup
│   ├── Experience.jsx                Scene composition with Leva controls
│   ├── store.js                      Zustand state (hover, focus)
│   ├── theme.js                      Shared color and effect constants
│   ├── styles.css                    Global styles
│   ├── objects/
│   │   ├── SceneObject.jsx           Base interactive wrapper (hover, click, idle)
│   │   ├── Guy.jsx                   Animated character with eye customization
│   │   ├── Laptop.jsx                Terminal emulator on canvas texture
│   │   ├── Sudo.jsx                  Spring-animated head figurine
│   │   ├── CameraObj.jsx             Animated camera decoration
│   │   ├── Cactus.jsx                Wobble material cactus
│   │   ├── Level.jsx                 Room geometry (walls, floor, window)
│   │   ├── CeilingLights.jsx         Overhead lighting
│   │   ├── WallPoster.jsx            Procedural poster texture
│   │   └── ...                       Desk, Chair, Mouse, Shelf, etc.
│   ├── systems/
│   │   ├── CameraRig.jsx             Orbit camera with limits
│   │   └── PostProcessing.jsx        Bloom + vignette
│   └── world/
│       ├── Atmosphere.jsx            Environment map + ambient light
│       └── Particles.jsx             Floating particles
├── package.json
└── vite.config.js
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 3555)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

[MIT](LICENSE)

---

© 2026 Petri Sandholm
