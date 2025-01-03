import { create } from 'zustand'

interface DashboardState {
  selectedTimeRange: 'day' | 'week' | 'month'
  setTimeRange: (range: 'day' | 'week' | 'month') => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedTimeRange: 'week',
  setTimeRange: (range) => set({ selectedTimeRange: range }),
}))
