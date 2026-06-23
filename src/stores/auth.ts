import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service'

export interface User {
  id: number
  name: string
  email: string
  age?: number
  weight_kg?: number
  goal_weight_kg?: number
  daily_calorie_target: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('auth_token', t)
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  async function login(payload: LoginPayload) {
    const { data } = await authService.login(payload)
    setToken(data.token)
    user.value = data.user
  }

  async function register(payload: RegisterPayload) {
    const { data } = await authService.register(payload)
    setToken(data.token)
    user.value = data.user
  }

  async function logout() {
    try { await authService.logout() } catch {}
    clearAuth()
  }

  async function fetchUser() {
    const { data } = await authService.getUser()
    user.value = data
  }

  async function updateProfile(payload: object) {
    const { data } = await authService.updateProfile(payload)
    user.value = data
  }

  async function updateGoals(payload: object) {
    const { data } = await authService.updateGoals(payload)
    user.value = data
  }

  function loginAsDemo() {
    setToken('demo-token')
    user.value = {
      id: 0,
      name: 'Demo User',
      email: 'demo@everybite.app',
      age: 28,
      weight_kg: 75,
      goal_weight_kg: 70,
      daily_calorie_target: 2000,
    }
  }

  return { user, token, isAuthenticated, login, register, logout, fetchUser, updateProfile, updateGoals, loginAsDemo }
})
