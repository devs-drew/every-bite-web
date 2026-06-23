<template>
  <div class="flex flex-col items-center gap-1">
    <svg :width="size" :height="size" viewBox="0 0 120 120">
      <!-- Track -->
      <circle cx="60" cy="60" :r="radius" fill="none" stroke="currentColor"
        class="text-muted/30" :stroke-width="strokeWidth" />
      <!-- Progress -->
      <circle cx="60" cy="60" :r="radius" fill="none"
        :stroke="ringColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 60 60)"
        style="transition: stroke-dashoffset 0.5s ease" />
      <!-- Center text -->
      <text x="60" y="55" text-anchor="middle" class="fill-foreground" font-size="18" font-weight="600">
        {{ remaining > 0 ? remaining : 0 }}
      </text>
      <text x="60" y="72" text-anchor="middle" class="fill-muted-foreground" font-size="9">
        {{ remaining > 0 ? 'kcal left' : 'over goal' }}
      </text>
    </svg>
    <div class="text-xs text-muted-foreground">
      {{ consumed }} / {{ target }} kcal
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ consumed: number; target: number; size?: number }>()
const size = computed(() => props.size ?? 160)
const strokeWidth = 10
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
