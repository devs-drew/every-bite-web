// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('@codetrix-studio/capacitor-google-auth', () => ({
  GoogleAuth: {
    initialize: vi.fn().mockResolvedValue(undefined),
    signIn: vi.fn().mockResolvedValue({
      authentication: { idToken: 'fake-google-id-token' },
    }),
  },
}))

vi.mock('@/services/auth.service', () => ({
  authService: {
    googleSignIn: vi.fn().mockResolvedValue({
      data: {
        token: 'sanctum-abc123',
        user: {
          id: 1,
          name: 'Google User',
          email: 'google@example.com',
          daily_calorie_target: 2000,
        },
        is_new_user: true,
      },
    }),
  },
}))

describe('auth store — loginWithGoogle', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('sets token and user on successful Google sign-in', async () => {
    const auth = useAuthStore()

    const result = await auth.loginWithGoogle()

    expect(auth.token).toBe('sanctum-abc123')
    expect(auth.user?.email).toBe('google@example.com')
    expect(result.isNewUser).toBe(true)
    expect(localStorage.getItem('auth_token')).toBe('sanctum-abc123')
  })

  it('returns isNewUser false when backend says so', async () => {
    const { authService } = await import('@/services/auth.service')
    vi.mocked(authService.googleSignIn).mockResolvedValueOnce({
      data: {
        token: 'sanctum-xyz',
        user: { id: 2, name: 'Existing', email: 'old@example.com', daily_calorie_target: 1800 },
        is_new_user: false,
      },
    } as any)

    const auth = useAuthStore()
    const result = await auth.loginWithGoogle()

    expect(result.isNewUser).toBe(false)
  })
})
