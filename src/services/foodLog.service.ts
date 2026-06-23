import api from './api'

export const foodLogService = {
  getLogs: (date: string, meal_type?: string) =>
    api.get('/api/food-logs', { params: { date, meal_type } }),
  getSummary: (date: string) =>
    api.get('/api/food-logs/summary', { params: { date } }),
  getHistory: (from: string, to: string) =>
    api.get('/api/food-logs/history', { params: { from, to } }),
  create: (data: object) => api.post('/api/food-logs', data),
  update: (id: number, data: object) => api.put(`/api/food-logs/${id}`, data),
  delete: (id: number) => api.delete(`/api/food-logs/${id}`),
}
