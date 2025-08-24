import { create } from 'zustand'

export const useRoleStore = create((set) => ({
  isDirector: false,
  setIsDirector: (value) => set({ isDirector: value }),
}))