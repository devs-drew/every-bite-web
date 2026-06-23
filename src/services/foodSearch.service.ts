import api from './api'

export const foodSearchService = {
  searchByName: (q: string, page = 1) =>
    api.get('/api/food/search', { params: { q, page } }),
  searchByBarcode: (barcode: string) =>
    api.get(`/api/food/barcode/${barcode}`),
}
