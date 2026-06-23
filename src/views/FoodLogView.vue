<template>
  <AppLayout title="Food Log">
    <div class="p-4 space-y-4">
      <!-- Date navigator -->
      <div class="flex items-center justify-between">
        <button @click="changeDate(-1)" class="p-2 rounded-md hover:bg-muted transition-colors">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <span class="text-sm font-medium">{{ displayDate }}</span>
        <button @click="changeDate(1)" :disabled="isToday" class="p-2 rounded-md hover:bg-muted disabled:opacity-30 transition-colors">
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>

      <!-- Day total -->
      <div class="bg-muted/40 rounded-xl px-4 py-3 text-center">
        <p class="text-2xl font-bold">{{ Math.round(dayTotal) }}</p>
        <p class="text-xs text-muted-foreground">kcal consumed</p>
      </div>

      <!-- Meal sections -->
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

const displayDate = computed(() => {
  const d = new Date(currentDate.value + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
})

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
