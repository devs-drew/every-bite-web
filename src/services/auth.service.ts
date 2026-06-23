import api from './api'

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string; password_confirmation: string; daily_calorie_target?: number }

export const authService = {
  login: (data: LoginPayload) => api.post('/api/login', data),
  register: (data: RegisterPayload) => api.post('/api/register', data),
  logout: () => api.post('/api/logout'),
  getUser: () => api.get('/api/user'),
  updateProfile: (data: object) => api.put('/api/user/profile', data),
  updateGoals: (data: object) => api.put('/api/user/goals', data),
}
