import { defineStore } from 'pinia'
import { ref } from 'vue'
import { foodLogService } from '@/services/foodLog.service'

export interface FoodLog {
  id: number
  food_name: string
  brand_name?: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  logged_date: string
  serving_qty: number
  serving_size_g: number
  calories: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  fiber_g?: number
}

export interface DailySummary {
  date: string
  daily_target: number
  totals: { calories: number; protein_g: number; carbs_g: number; fat_g: number; fiber_g: number }
  by_meal: Record<string, { calories: number; protein_g: number; carbs_g: number; fat_g: number }>
}

// Generate 7-day fixture week relative to today
function buildFixtureWeek(): { date: string; calories: number }[] {
  const offsets = [-6, -5, -4, -3, -2, -1, 0]
  const calorieValues = [1850, 2210, 1640, 1980, 0, 2050, 937] // 0 = no data that day
  return offsets.map((offset, i) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return { date: d.toISOString().slice(0, 10), calories: calorieValues[i] }
  })
}
export const FIXTURE_WEEK = buildFixtureWeek()

// Fixture data used while backend is offline
const FIXTURE_LOGS: FoodLog[] = [
  { id: 1, food_name: 'Oatmeal', brand_name: 'Quaker', meal_type: 'breakfast', logged_date: '', serving_qty: 1, serving_size_g: 100, calories: 370, protein_g: 13, carbs_g: 66, fat_g: 7 },
  { id: 2, food_name: 'Banana', meal_type: 'breakfast', logged_date: '', serving_qty: 1, serving_size_g: 118, calories: 105, protein_g: 1.3, carbs_g: 27, fat_g: 0.4 },
  { id: 3, food_name: 'Grilled Chicken Breast', meal_type: 'lunch', logged_date: '', serving_qty: 1, serving_size_g: 150, calories: 247, protein_g: 46, carbs_g: 0, fat_g: 5.4 },
  { id: 4, food_name: 'Brown Rice', meal_type: 'lunch', logged_date: '', serving_qty: 1, serving_size_g: 195, calories: 215, protein_g: 5, carbs_g: 45, fat_g: 1.8 },
]

const FIXTURE_SUMMARY: DailySummary = {
  date: '',
  daily_target: 2000,
  totals: { calories: 937, protein_g: 65.3, carbs_g: 138, fat_g: 14.6, fiber_g: 6.2 },
  by_meal: {
    breakfast: { calories: 475, protein_g: 14.3, carbs_g: 93, fat_g: 7.4 },
    lunch: { calories: 462, protein_g: 51, carbs_g: 45, fat_g: 7.2 },
    dinner: { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
    snack: { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  },
}

export const useFoodLogStore = defineStore('foodLog', () => {
  const logs = ref<Record<string, FoodLog[]>>({})
  const summary = ref<Record<string, DailySummary>>({})
  const weekHistory = ref<{ date: string; calories: number }[]>([])
  const loading = ref(false)
  const useFixtures = ref(false)

  async function fetchLogsForDate(date: string) {
    if (useFixtures.value) {
      logs.value[date] = FIXTURE_LOGS.map(l => ({ ...l, logged_date: date }))
      return
    }
    loading.value = true
    try {
      const { data } = await foodLogService.getLogs(date)
      logs.value[date] = data
    } finally { loading.value = false }
  }

  async function fetchSummary(date: string) {
    if (useFixtures.value) {
      summary.value[date] = { ...FIXTURE_SUMMARY, date }
      return
    }
    const { data } = await foodLogService.getSummary(date)
    summary.value[date] = data
  }

  async function addLog(payload: object) {
    const { data } = await foodLogService.create(payload)
    const date = (data as FoodLog).logged_date
    if (logs.value[date]) logs.value[date].push(data)
    await fetchSummary(date)
    return data
  }

  async function updateLog(id: number, payload: object, date: string) {
    const { data } = await foodLogService.update(id, payload)
    if (logs.value[date]) {
      const idx = logs.value[date].findIndex(l => l.id === id)
      if (idx !== -1) logs.value[date][idx] = data
    }
    await fetchSummary(date)
  }

  async function deleteLog(id: number, date: string) {
    await foodLogService.delete(id)
    if (logs.value[date]) logs.value[date] = logs.value[date].filter(l => l.id !== id)
    await fetchSummary(date)
  }

  async function fetchWeekHistory() {
    if (useFixtures.value) {
      weekHistory.value = FIXTURE_WEEK
      return
    }
    const to = new Date().toISOString().slice(0, 10)
    const from = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)
    const { data } = await foodLogService.getHistory(from, to)
    weekHistory.value = data
  }

  return { logs, summary, weekHistory, loading, useFixtures, fetchLogsForDate, fetchSummary, fetchWeekHistory, addLog, updateLog, deleteLog }
})
