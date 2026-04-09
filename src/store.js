import { create } from 'zustand'

const useStore = create((set) => ({
  // Camera
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  clearCameraTarget: () => set({ cameraTarget: null }),

  // Focused object
  focusedObject: null,
  setFocusedObject: (id) => set({ focusedObject: id }),
  clearFocusedObject: () => set({ focusedObject: null, cameraTarget: null }),

  // Hovered object
  hoveredObject: null,
  setHoveredObject: (id) => set({ hoveredObject: id }),
  clearHoveredObject: () => set({ hoveredObject: null }),

  // Audio
  audioEnabled: false,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

  // Poster
  posterMode: 'default',
  posterText: null,
  setPosterMode: (mode) => set({ posterMode: mode }),
  setPosterText: (text) => set({ posterText: text }),

  // Intro
  introComplete: false,
  setIntroComplete: () => set({ introComplete: true }),
}))

export default useStore
