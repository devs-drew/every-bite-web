<template>
  <AppLayout title="Dashboard">
    <div class="p-4 space-y-6">
      <!-- Calorie ring + macros -->
      <div class="flex flex-col items-center gap-4 pt-2">
        <CalorieSummaryRing
          :consumed="summary?.totals.calories ?? 0"
          :target="auth.user?.daily_calorie_target ?? 2000" />
        <MacroBarsSection
          :protein="summary?.totals.protein_g ?? 0"
          :carbs="summary?.totals.carbs_g ?? 0"
          :fat="summary?.totals.fat_g ?? 0"
          class="w-full" />
      </div>

      <!-- Weekly chart -->
      <WeeklyChart
        :week-data="foodLog.weekHistory"
        :target="auth.user?.daily_calorie_target ?? 2000" />

      <!-- Meal sections -->
      <div class="space-y-3">
        <MealSectionCard
          v-for="meal in meals"
          :key="meal"
          :meal-type="meal"
          :logs="logsForMeal(meal)"
          :date="today"
          @delete="handleDelete" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import CalorieSummaryRing from '@/components/dashboard/CalorieSummaryRing.vue'
import MacroBarsSection from '@/components/dashboard/MacroBarsSection.vue'
import MealSectionCard from '@/components/dashboard/MealSectionCard.vue'
import WeeklyChart from '@/components/dashboard/WeeklyChart.vue'
import { useAuthStore } from '@/stores/auth'
import { useFoodLogStore } from '@/stores/foodLog'

const auth = useAuthStore()
const foodLog = useFoodLogStore()
const today = new Date().toISOString().slice(0, 10)
const meals = ['breakfast', 'lunch', 'dinner', 'snack'] as const

const summary = computed(() => foodLog.summary[today])
const logsForDate = computed(() => foodLog.logs[today] ?? [])
const logsForMeal = (meal: string) => logsForDate.value.filter(l => l.meal_type === meal)

async function handleDelete(id: number) {
  await foodLog.deleteLog(id, today)
}

onMounted(async () => {
  await Promise.all([
    foodLog.fetchLogsForDate(today),
    foodLog.fetchSummary(today),
    foodLog.fetchWeekHistory(),
  ])
})
</script>
