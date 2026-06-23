<template>
  <div class="eb-card p-5 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-ink-900">This Week</h3>
        <p class="text-xs text-ink-400 mt-0.5">{{ weekRange }}</p>
      </div>
      <div class="text-right">
        <p class="text-base font-bold text-brand-600 tabular-nums">{{ weekAvg }}</p>
        <p class="text-[11px] text-ink-400">avg / day</p>
      </div>
    </div>

    <!-- Bar chart -->
    <div class="flex items-end justify-between gap-2 h-28">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="flex-1 flex flex-col items-center gap-2 h-full justify-end"
      >
        <span class="text-[9px] font-semibold tabular-nums"
          :class="day.isToday ? 'text-brand-700' : 'text-ink-400'">
          {{ day.calories > 0 ? day.calories : '' }}
        </span>
        <div class="w-7 rounded-t-xl rounded-b-sm transition-all duration-500 relative"
          :class="day.isToday ? 'bg-brand-600' : day.calories > 0 ? 'bg-brand-200' : 'bg-ink-100'"
          :style="{ height: barHeight(day.calories) }">
          <span v-if="day.calories > target"
            class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-warning ring-2 ring-surface" />
        </div>
        <span class="text-[11px] font-semibold"
          :class="day.isToday ? 'text-brand-700' : 'text-ink-400'">
          {{ day.label }}
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-between pt-3 border-t border-line">
      <span class="flex items-center gap-1.5 text-[11px] text-ink-500">
        <span class="w-2 h-2 rounded-full bg-warning inline-block" /> Over goal
      </span>
      <span class="text-[11px] text-ink-500">Goal: <span class="font-semibold text-ink-700">{{ target }}</span> kcal</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  weekData: { date: string; calories: number }[]
  target: number
}>()

const MAX_BAR_PX = 88
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
  if (calories === 0) return '8px'
  return `${Math.round((calories / maxCalories.value) * MAX_BAR_PX)}px`
}

const weekAvg = computed(() => {
  const logged = props.weekData.filter(d => d.calories > 0)
  if (!logged.length) return 0
  return Math.round(logged.reduce((s, d) => s + d.calories, 0) / logged.length)
})

const weekRange = computed(() => {
  const first = props.weekData[0]?.date
  const last = props.weekData[props.weekData.length - 1]?.date
  if (!first || !last) return ''
  const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(first)} – ${fmt(last)}`
})
</script>
