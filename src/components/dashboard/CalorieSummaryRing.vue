<template>
  <div class="flex flex-col items-center">
    <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" viewBox="0 0 120 120" class="-rotate-90">
        <!-- Track -->
        <circle cx="60" cy="60" :r="radius" fill="none" stroke="#e9efeb" :stroke-width="strokeWidth" />
        <!-- Progress -->
        <circle cx="60" cy="60" :r="radius" fill="none"
          :stroke="ringColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          style="transition: stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)" />
      </svg>
      <!-- Center -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-3xl font-extrabold text-ink-900 tabular-nums leading-none">
          {{ remaining > 0 ? remaining : 0 }}
        </span>
        <span class="text-xs font-medium mt-1" :class="remaining > 0 ? 'text-brand-600' : 'text-danger-text'">
          {{ remaining > 0 ? 'kcal left' : 'over goal' }}
        </span>
      </div>
    </div>
    <div class="text-xs text-ink-500 mt-3">
      <span class="font-semibold text-ink-700">{{ Math.round(consumed) }}</span> / {{ target }} kcal
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ consumed: number; target: number; size?: number }>()
const size = computed(() => props.size ?? 168)
const strokeWidth = 11
const radius = 50
const circumference = 2 * Math.PI * radius
const progress = computed(() => Math.min(props.consumed / props.target, 1))
const dashOffset = computed(() => circumference * (1 - progress.value))
const remaining = computed(() => Math.round(props.target - props.consumed))
const ringColor = computed(() => {
  const pct = props.consumed / props.target
  if (pct >= 1) return '#ef4444'
  if (pct >= 0.9) return '#f59e0b'
  return '#22c55e'
})
</script>
