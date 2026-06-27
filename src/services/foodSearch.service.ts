import type { FoodResult } from '@/stores/foodSearch'
import api from '@/services/api'
import { WHOLE_FOODS } from '@/data/wholeFoods'

export const foodSearchService = {
  // ponytail: no AbortController — view debounces 400ms. Add if out-of-order results appear.
  async searchByName(q: string, page = 1): Promise<{ data: { products: FoodResult[]; failed?: boolean } }> {
    const lower = q.toLowerCase()

    // Local whole foods — tokenized scoring, no network
    const tokens = lower.split(/[\s,]+/).filter(w => w.length >= 3)
    const localMatches = tokens.length === 0
      ? WHOLE_FOODS.filter(f => f.food_name.toLowerCase().includes(lower))
      : WHOLE_FOODS
          .map(f => ({ f, score: tokens.filter(t => f.food_name.toLowerCase().includes(t)).length }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .map(({ f }) => f)

    try {
      const response = await api.get('/products/search', { params: { q, page } })
      const apiProducts: FoodResult[] = response.data.products ?? []
      return { data: { products: [...localMatches, ...apiProducts], failed: response.data.failed ?? false } }
    } catch {
      return { data: { products: localMatches, failed: true } }
    }
  },

  async searchByBarcode(barcode: string): Promise<{ data: FoodResult | null }> {
    try {
      const response = await api.get(`/products/barcode/${encodeURIComponent(barcode)}`)
      return { data: response.data }
    } catch {
      return { data: null }
    }
  },
}
