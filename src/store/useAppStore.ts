import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Section, Voucher, Traveler } from '../types'

interface AppState {
  currentSection: Section
  checklistDone: Record<string, boolean>
  vouchers: Voucher[]
  costsActual: Record<string, number>
  travelers: Traveler[]
  highlightedMapPoint: string | null
  selectedDay: string | null
  setSection: (s: Section) => void
  toggleChecklist: (id: string) => void
  addVoucher: (v: Voucher) => void
  updateVoucher: (id: string, patch: Partial<Voucher>) => void
  removeVoucher: (id: string) => void
  setCostActual: (id: string, value: number | undefined) => void
  addTraveler: (t: Traveler) => void
  updateTraveler: (id: string, patch: Partial<Traveler>) => void
  removeTraveler: (id: string) => void
  setHighlightedMapPoint: (id: string | null) => void
  setSelectedDay: (id: string | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentSection: 'dashboard',
      checklistDone: {},
      vouchers: [],
      costsActual: {},
      travelers: [],
      highlightedMapPoint: null,
      selectedDay: null,
      setSection: (s) => set({ currentSection: s }),
      toggleChecklist: (id) =>
        set((state) => ({
          checklistDone: { ...state.checklistDone, [id]: !state.checklistDone[id] },
        })),
      addVoucher: (v) =>
        set((state) => ({ vouchers: [...state.vouchers, v] })),
      updateVoucher: (id, patch) =>
        set((state) => ({
          vouchers: state.vouchers.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
      removeVoucher: (id) =>
        set((state) => ({ vouchers: state.vouchers.filter((v) => v.id !== id) })),
      setCostActual: (id, value) =>
        set((state) => {
          const next = { ...state.costsActual }
          if (value === undefined || Number.isNaN(value)) delete next[id]
          else next[id] = value
          return { costsActual: next }
        }),
      addTraveler: (t) =>
        set((state) => ({ travelers: [...state.travelers, t] })),
      updateTraveler: (id, patch) =>
        set((state) => ({
          travelers: state.travelers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      removeTraveler: (id) =>
        set((state) => ({ travelers: state.travelers.filter((t) => t.id !== id) })),
      setHighlightedMapPoint: (id) => set({ highlightedMapPoint: id }),
      setSelectedDay: (id) => set({ selectedDay: id }),
    }),
    {
      name: 'travel-guide-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        checklistDone: state.checklistDone,
        vouchers: state.vouchers,
        costsActual: state.costsActual,
        travelers: state.travelers,
      }),
    },
  ),
)
