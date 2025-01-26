import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, AuthTokens } from '@/types/auth'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isHydrated: boolean
  setHydrated: () => void
  setAuth: (data: { user: User; tokens: AuthTokens }) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      setAuth: (data) =>
        set({
          user: data.user,
          tokens: data.tokens,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        }),
      updateUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
