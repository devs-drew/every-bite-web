import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/foodLog.service', () => ({
  foodLogService: {
    getLogs: vi.fn(),
    getSummary: vi.fn(),
    getHistory: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

import { useFoodLogStore, type FoodLog, type DailySummary } from '@/stores/foodLog'
import { foodLogService } from '@/services/foodLog.service'

const svc = vi.mocked(foodLogService)
const DATE = '2026-06-20'

function makeLog(overrides: Partial<FoodLog> = {}): FoodLog {
  return {
    id: 1, food_name: 'Banana', meal_type: 'breakfast', logged_date: DATE,
    serving_qty: 1, serving_size_g: 118, calories: 105, ...overrides,
  }
}

const SUMMARY: DailySummary = {
  date: DATE, daily_target: 2000,
  totals: { calories: 105, protein_g: 1.3, carbs_g: 27, fat_g: 0.4, fiber_g: 3 },
  by_meal: {},
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  svc.getSummary.mockResolvedValue({ data: SUMMARY } as any)
})

describe('foodLog store', () => {
  it('fetchLogsForDate stores the response keyed by date', async () => {
    const logs = [makeLog()]
    svc.getLogs.mockResolvedValue({ data: logs } as any)

    const store = useFoodLogStore()
    await store.fetchLogsForDate(DATE)

    expect(svc.getLogs).toHaveBeenCalledWith(DATE)
    expect(store.logs[DATE]).toEqual(logs)
  })

  it('addLog appends to the cached day and refreshes the summary', async () => {
    svc.getLogs.mockResolvedValue({ data: [] } as any)
    const created = makeLog({ id: 99, food_name: 'Apple' })
    svc.create.mockResolvedValue({ data: created } as any)

    const store = useFoodLogStore()
    await store.fetchLogsForDate(DATE) // seed logs[DATE] = []
    const ret = await store.addLog({ food_name: 'Apple' })

    expect(svc.create).toHaveBeenCalledWith({ food_name: 'Apple' })
    expect(store.logs[DATE]).toContainEqual(created)
    expect(svc.getSummary).toHaveBeenCalledWith(DATE)
    expect(store.summary[DATE]).toEqual(SUMMARY)
    expect(ret).toEqual(created)
  })

  it('deleteLog removes the entry and refreshes the summary', async () => {
    const a = makeLog({ id: 1 })
    const b = makeLog({ id: 2, food_name: 'Toast' })
    svc.getLogs.mockResolvedValue({ data: [a, b] } as any)
    svc.delete.mockResolvedValue({ data: null } as any)

    const store = useFoodLogStore()
    await store.fetchLogsForDate(DATE)
    await store.deleteLog(1, DATE)

    expect(svc.delete).toHaveBeenCalledWith(1)
    expect(store.logs[DATE]).toEqual([b])
    expect(svc.getSummary).toHaveBeenCalledWith(DATE)
  })

  it('updateLog replaces the entry in place and refreshes the summary', async () => {
    const a = makeLog({ id: 1, calories: 105 })
    svc.getLogs.mockResolvedValue({ data: [a] } as any)
    const updated = makeLog({ id: 1, calories: 210 })
    svc.update.mockResolvedValue({ data: updated } as any)

    const store = useFoodLogStore()
    await store.fetchLogsForDate(DATE)
    await store.updateLog(1, { calories: 210 }, DATE)

    expect(svc.update).toHaveBeenCalledWith(1, { calories: 210 })
    expect(store.logs[DATE][0].calories).toBe(210)
    expect(svc.getSummary).toHaveBeenCalledWith(DATE)
  })

  it('fetchWeekHistory loads the 7-day history into weekHistory', async () => {
    const week = [{ date: DATE, calories: 1800 }]
    svc.getHistory.mockResolvedValue({ data: week } as any)

    const store = useFoodLogStore()
    await store.fetchWeekHistory()

    expect(svc.getHistory).toHaveBeenCalledOnce()
    expect(store.weekHistory).toEqual(week)
  })
})
