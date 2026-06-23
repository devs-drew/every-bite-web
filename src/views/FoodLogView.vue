<template>
  <AppLayout title="Food Log">
    <div class="px-5 pb-4 space-y-5">
      <!-- Date navigator -->
      <div class="eb-card px-3 py-3 flex items-center justify-between">
        <button @click="changeDate(-1)"
          class="w-9 h-9 rounded-full flex items-center justify-center text-ink-700 hover:bg-surface-sunken active:scale-95 transition">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div class="text-center">
          <p class="text-sm font-bold text-ink-900">{{ isToday ? 'Today' : displayDay }}</p>
          <p class="text-[11px] text-ink-400">{{ displayDate }}</p>
        </div>
        <button @click="changeDate(1)" :disabled="isToday"
          class="w-9 h-9 rounded-full flex items-center justify-center text-ink-700 hover:bg-surface-sunken disabled:opacity-30 active:scale-95 transition">
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>

      <!-- Day total -->
      <div class="bg-gradient-to-b from-brand-50 to-brand-100/50 rounded-3xl px-4 py-5 text-center shadow-card">
        <p class="text-3xl font-extrabold text-ink-900 tabular-nums">{{ Math.round(dayTotal) }}</p>
        <p class="text-xs text-brand-600 font-medium mt-0.5">kcal consumed</p>
      </div>

      <!-- Meals -->
      <div class="space-y-3">
        <MealSectionCard
          v-for="meal in meals"
          :key="meal"
          :meal-type="meal"
          :logs="logsForMeal(meal)"
          :date="currentDate"
          @delete="handleDelete" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import MealSectionCard from '@/components/dashboard/MealSectionCard.vue'
import { useFoodLogStore } from '@/stores/foodLog'

const route = useRoute()
const foodLog = useFoodLogStore()
const meals = ['breakfast', 'lunch', 'dinner', 'snack'] as const

const currentDate = ref((route.params.date as string) || new Date().toISOString().slice(0, 10))
const isToday = computed(() => currentDate.value === new Date().toISOString().slice(0, 10))

const displayDay = computed(() =>
  new Date(currentDate.value + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }))
const displayDate = computed(() =>
  new Date(currentDate.value + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' }))

const logsForDate = computed(() => foodLog.logs[currentDate.value] ?? [])
const logsForMeal = (meal: string) => logsForDate.value.filter(l => l.meal_type === meal)
const dayTotal = computed(() => logsForDate.value.reduce((s, l) => s + l.calories, 0))

function changeDate(delta: number) {
  const d = new Date(currentDate.value + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  currentDate.value = d.toISOString().slice(0, 10)
}

async function handleDelete(id: number) {
  await foodLog.deleteLog(id, currentDate.value)
}

async function loadDate(date: string) {
  await foodLog.fetchLogsForDate(date)
}

watch(currentDate, loadDate)
onMounted(() => loadDate(currentDate.value))
</script>
