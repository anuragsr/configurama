import { create } from 'zustand';
import { CATEGORIES, DEFAULT_SLOTS, SKIN_TONES } from '../data/apparelRegistry';

export const useConfigStore = create((set, get) => ({
  gender: 'male',
  activeCategory: 'all',
  activePart: 'crown',
  autoRotate: true,
  showMannequin: true,
  skinTone: 'warm_beige',
  summaryOpen: false,
  cameraResetSignal: 0,
  slots: JSON.parse(JSON.stringify(DEFAULT_SLOTS)),

  setGender: (gender) => set({ gender }),

  setSkinTone: (skinTone) => set({ skinTone }),

  setActiveCategory: (category) => {
    const state = get();
    let nextPart = state.activePart;

    // A category may contain more than one slot - default to the first slot
    // in that category whose parts don't already include the current
    // activePart.
    const effectiveCategory = category === 'all' ? 'headwear' : category;
    const slot = Object.values(state.slots).find((s) => s.category === effectiveCategory);
    if (slot && slot.parts) {
      const partKeys = Object.keys(slot.parts);
      nextPart = partKeys.includes(state.activePart) ? state.activePart : partKeys[0];
    }

    // Also reset the stage group's rotation and stop the turntable so
    // switching categories always brings the model back to facing forward,
    // not wherever the turntable or a manual drag left it.
    set({
      activeCategory: category,
      activePart: nextPart,
      autoRotate: false,
      cameraResetSignal: state.cameraResetSignal + 1,
    });
  },

  setActivePart: (partKey) => set({ activePart: partKey }),

  setPartColor: (slotKey, partKey, colorHex) =>
    set((state) => {
      const updatedSlots = { ...state.slots };
      if (updatedSlots[slotKey] && updatedSlots[slotKey].parts[partKey]) {
        updatedSlots[slotKey] = {
          ...updatedSlots[slotKey],
          parts: {
            ...updatedSlots[slotKey].parts,
            [partKey]: {
              ...updatedSlots[slotKey].parts[partKey],
              color: colorHex,
            },
          },
        };
      }
      return { slots: updatedSlots };
    }),

  setSlotFabric: (slotKey, fabricId) =>
    set((state) => {
      const updatedSlots = { ...state.slots };
      if (updatedSlots[slotKey]) {
        updatedSlots[slotKey] = {
          ...updatedSlots[slotKey],
          fabric: fabricId,
        };
      }
      return { slots: updatedSlots };
    }),

  setSlotVariant: (slotKey, variantId) =>
    set((state) => {
      const updatedSlots = { ...state.slots };
      if (updatedSlots[slotKey]) {
        updatedSlots[slotKey] = {
          ...updatedSlots[slotKey],
          variant: variantId,
        };
      }
      return { slots: updatedSlots };
    }),

  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),

  toggleMannequin: () => set((state) => ({ showMannequin: !state.showMannequin })),

  setSummaryOpen: (summaryOpen) => set({ summaryOpen }),

  // Bumped whenever the camera should snap back to the active category's
  // framing, even if activeCategory itself isn't changing (e.g. the user
  // dragged the camera while already on the Overview tab).
  resetCamera: () =>
    set((state) => ({ autoRotate: false, cameraResetSignal: state.cameraResetSignal + 1 })),

  resetToDefaults: () =>
    set((state) => ({
      slots: JSON.parse(JSON.stringify(DEFAULT_SLOTS)),
      activeCategory: 'all',
      activePart: 'crown',
      skinTone: 'warm_beige',
      autoRotate: false,
      // Also bump the camera reset signal so the stage group's own
      // rotation (spun up by the auto-rotate turntable) gets reset too.
      cameraResetSignal: state.cameraResetSignal + 1,
    })),

  getActiveCategoryConfig: () => {
    const state = get();
    return CATEGORIES.find((c) => c.id === state.activeCategory) || CATEGORIES[0];
  },
}));
