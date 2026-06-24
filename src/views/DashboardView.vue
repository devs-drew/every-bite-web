<template>
  <AppLayout title="">
    <template #header-left>
      <RouterLink to="/profile"
        class="w-10 h-10 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center shadow-xs active:scale-95 transition flex-shrink-0">
        {{ initial }}
      </RouterLink>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-ink-500">{{ greeting }}!</p>
        <p class="text-lg font-bold text-ink-900 leading-tight">{{ firstName }}</p>
      </div>
    </template>


    <div class="px-5 pb-4 space-y-4">
      <DailyIntakeCard
        :consumed="summary?.totals.calories ?? 0"
        :target="auth.user?.daily_calorie_target ?? 2000"
        :first-name="firstName" />

      <WeekCalendar
        :selected-date="selectedDate"
        @select="onDateSelect" />

      <MacroBarsSection
        :protein="summary?.totals.protein_g ?? 0"
        :carbs="summary?.totals.carbs_g ?? 0"
        :fat="summary?.totals.fat_g ?? 0" />

      <WeeklyChart
        :week-data="foodLog.weekHistory"
        :target="auth.user?.daily_calorie_target ?? 2000"
        :today-calories="summary?.totals.calories ?? 0"
        :selected-date="selectedDate" />

      <!-- Meals -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h2 class="eb-eyebrow">{{ mealsLabel }}</h2>
          <RouterLink to="/search" class="text-xs font-semibold text-brand-700">+ Add</RouterLink>
        </div>
        <MealSectionCard
          v-for="meal in meals"
          :key="meal"
          :meal-type="meal"
          :logs="logsForMeal(meal)"
          :date="selectedDate"
          @delete="handleDelete" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import DailyIntakeCard from '@/components/dashboard/DailyIntakeCard.vue'
import WeekCalendar from '@/components/dashboard/WeekCalendar.vue'
import MacroBarsSection from '@/components/dashboard/MacroBarsSection.vue'
import WeeklyChart from '@/components/dashboard/WeeklyChart.vue'
import MealSectionCard from '@/components/dashboard/MealSectionCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useFoodLogStore } from '@/stores/foodLog'

const auth = useAuthStore()
const foodLog = useFoodLogStore()
const today = new Date().toISOString().slice(0, 10)
const meals = ['breakfast', 'lunch', 'dinner', 'snack'] as const

const selectedDate = ref(today)

const summary = computed(() => foodLog.summary[selectedDate.value])
const logsForDate = computed(() => foodLog.logs[selectedDate.value] ?? [])
const logsForMeal = (meal: string) => logsForDate.value.filter(l => l.meal_type === meal)

const mealsLabel = computed(() => {
  if (selectedDate.value === today) return "Today's meals"
  const d = new Date(selectedDate.value + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' meals'
})

const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? 'there')
const initial = computed(() => (auth.user?.name?.[0] ?? 'U').toUpperCase())
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

async function onDateSelect(iso: string) {
  selectedDate.value = iso
  await Promise.all([
    foodLog.fetchLogsForDate(iso),
    foodLog.fetchSummary(iso),
  ])
}

async function handleDelete(id: number) {
  await foodLog.deleteLog(id, selectedDate.value)
}

onMounted(async () => {
  await Promise.all([
    foodLog.fetchLogsForDate(today),
    foodLog.fetchSummary(today),
    foodLog.fetchWeekHistory(),
  ])
})
</script>
