<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-800">This Week</h3>
      <span class="text-xs text-gray-400">{{ weekRange }}</span>
    </div>

    <!-- Bar chart -->
    <div class="flex items-end justify-between gap-1.5 h-24">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="flex-1 flex flex-col items-center gap-1.5"
      >
        <span class="text-xs text-gray-400" style="font-size: 9px;">
          {{ day.calories > 0 ? day.calories : '' }}
        </span>
        <div class="w-full rounded-t-lg transition-all duration-500 relative"
          :class="day.isToday ? 'bg-gray-900' : day.calories > 0 ? 'bg-gray-200' : 'bg-gray-100'"
          :style="{ height: barHeight(day.calories) }">
          <!-- Over target indicator -->
          <div v-if="day.calories > target"
            class="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400" />
        </div>
        <span class="text-xs font-medium"
          :class="day.isToday ? 'text-gray-900' : 'text-gray-400'">
          {{ day.label }}
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-between pt-1 border-t border-gray-50">
      <div class="flex items-center gap-3 text-xs text-gray-400">
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-sm bg-gray-900 inline-block" /> Today
        </span>
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> Over goal
        </span>
      </div>
      <span class="text-xs text-gray-400">Goal: {{ target }} kcal</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  weekData: { date: string; calories: number }[]
  target: number
}>()

const MAX_BAR_PX = 80

const today = new Date().toISOString().slice(0, 10)

const weekDays = computed(() =>
  props.weekData.map(d => {
    const date = new Date(d.date + 'T00:00:00')
    return {
      date: d.date,
      calories: Math.round(d.calories),
      isToday: d.date === today,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
    }
  })
)

const maxCalories = computed(() =>
  Math.max(props.target, ...props.weekData.map(d => d.calories), 1)
)

function barHeight(calories: number): string {
  if (calories === 0) return '6px'
  return `${Math.round((calories / maxCalories.value) * MAX_BAR_PX)}px`
}

const weekRange = computed(() => {
  const first = props.weekData[0]?.date
  const last = props.weekData[props.weekData.length - 1]?.date
  if (!first || !last) return ''
  const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(first)} – ${fmt(last)}`
})
</script>
