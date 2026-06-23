<template>
  <AppLayout :title="`${greeting},`">
    <template #header-right>
      <RouterLink to="/profile"
        class="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shadow-xs active:scale-95 transition">
        {{ initial }}
      </RouterLink>
    </template>

    <div class="px-5 pb-4 space-y-5">
      <p class="-mt-2 text-xl font-bold text-ink-900">{{ firstName }} 👋</p>

      <!-- Hero summary card -->
      <div class="bg-gradient-to-b from-brand-50 to-brand-100/50 rounded-4xl p-6 shadow-card">
        <div class="flex flex-col items-center">
          <CalorieSummaryRing
            :consumed="summary?.totals.calories ?? 0"
            :target="auth.user?.daily_calorie_target ?? 2000" />
        </div>
        <div class="mt-5">
          <MacroBarsSection
            :protein="summary?.totals.protein_g ?? 0"
            :carbs="summary?.totals.carbs_g ?? 0"
            :fat="summary?.totals.fat_g ?? 0" />
        </div>
      </div>

      <!-- Weekly chart -->
      <WeeklyChart
        :week-data="foodLog.weekHistory"
        :target="auth.user?.daily_calorie_target ?? 2000" />

      <!-- Meals -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h2 class="eb-eyebrow">Today's meals</h2>
          <RouterLink to="/search" class="text-xs font-semibold text-brand-700">+ Add</RouterLink>
        </div>
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
import { RouterLink } from 'vue-router'
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

const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? 'there')
const initial = computed(() => (auth.user?.name?.[0] ?? 'U').toUpperCase())
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

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
