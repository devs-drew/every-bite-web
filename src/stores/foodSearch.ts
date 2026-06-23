import { defineStore } from 'pinia'
import { ref } from 'vue'
import { foodSearchService } from '@/services/foodSearch.service'

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

export const TOP_FOODS_FIXTURE: FoodResult[] = [
  { off_product_id: 'top-1', food_name: 'Oatmeal', brand_name: 'Quaker', serving_size_g: 100, nutrients_per_100g: { calories: 370, protein_g: 13, carbs_g: 66, fat_g: 7 } },
  { off_product_id: 'top-2', food_name: 'Banana', serving_size_g: 118, nutrients_per_100g: { calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3 } },
  { off_product_id: 'top-3', food_name: 'Grilled Chicken Breast', serving_size_g: 150, nutrients_per_100g: { calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6 } },
  { off_product_id: 'top-4', food_name: 'Brown Rice', brand_name: 'Generic', serving_size_g: 195, nutrients_per_100g: { calories: 110, protein_g: 2.6, carbs_g: 23, fat_g: 0.9 } },
  { off_product_id: 'top-5', food_name: 'Greek Yogurt', brand_name: 'Chobani', serving_size_g: 170, nutrients_per_100g: { calories: 59, protein_g: 10, carbs_g: 3.6, fat_g: 0.4 } },
]

export const useFoodSearchStore = defineStore('foodSearch', () => {
  const results = ref<FoodResult[]>([])
  const query = ref('')
  const isSearching = ref(false)
  const lastBarcode = ref('')

  async function searchByName(q: string, page = 1) {
    query.value = q
    isSearching.value = true
    try {
      const { data } = await foodSearchService.searchByName(q, page)
      results.value = data.products ?? []
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
  }

  return { results, query, isSearching, lastBarcode, searchByName, searchByBarcode, clearResults }
})
