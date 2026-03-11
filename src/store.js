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
  audioEnabled: true,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

  // Intro
  introComplete: false,
  setIntroComplete: () => set({ introComplete: true }),
}))

export default useStore
