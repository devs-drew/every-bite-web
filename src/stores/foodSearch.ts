import { defineStore } from 'pinia'
import { ref } from 'vue'
import { foodSearchService } from '@/services/foodSearch.service'
import { WHOLE_FOODS } from '@/data/wholeFoods'

export interface FoodResult {
  off_product_id: string
  food_name: string
  brand_name?: string
  barcode?: string
  serving_size_g: number
  nutrients_per_100g: {
    calories: number
    protein_g?: number
    carbs_g?: number
    fat_g?: number
    fiber_g?: number
    sugar_g?: number
    sodium_mg?: number
  }
}

// First 6 items in WHOLE_FOODS are ordered as the most commonly logged Filipino foods
export const TOP_FOODS_FIXTURE = WHOLE_FOODS.slice(0, 6)

export const useFoodSearchStore = defineStore('foodSearch', () => {
  const results = ref<FoodResult[]>([])
  const query = ref('')
  const isSearching = ref(false)
  const lastBarcode = ref('')
  const searchFailed = ref(false)

  async function searchByName(q: string, page = 1) {
    query.value = q
    isSearching.value = true
    searchFailed.value = false
    try {
      const { data } = await foodSearchService.searchByName(q, page)
      results.value = data.products ?? []
      searchFailed.value = data.failed ?? false
    } finally { isSearching.value = false }
  }

  async function searchByBarcode(barcode: string) {
    lastBarcode.value = barcode
    isSearching.value = true
    try {
      const { data } = await foodSearchService.searchByBarcode(barcode)
      results.value = data ? [data] : []
    } finally { isSearching.value = false }
  }

  function clearResults() {
    results.value = []
    query.value = ''
    lastBarcode.value = ''
    searchFailed.value = false
  }

  return { results, query, isSearching, lastBarcode, searchFailed, searchByName, searchByBarcode, clearResults }
})
