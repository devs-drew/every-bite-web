import api from './api'

export const customFoodService = {
  list: () => api.get('/api/custom-foods'),
  create: (data: object) => api.post('/api/custom-foods', data),
  update: (id: number, data: object) => api.put(`/api/custom-foods/${id}`, data),
  delete: (id: number) => api.delete(`/api/custom-foods/${id}`),
}
