<template>
  <div class="grid grid-cols-3 gap-3">
    <div v-for="macro in macros" :key="macro.label"
      class="bg-surface/70 rounded-2xl p-3 flex flex-col items-center gap-1.5">
      <div class="relative w-full h-1.5 rounded-full bg-ink-100 overflow-hidden">
        <div class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          :style="{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`, backgroundColor: macro.color }" />
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-base font-bold text-ink-900 tabular-nums">{{ macro.value }}</span>
        <span class="text-[11px] text-ink-400">g</span>
      </div>
      <span class="text-[11px] font-medium" :style="{ color: macro.color }">{{ macro.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  protein: number; carbs: number; fat: number
  proteinGoal?: number; carbsGoal?: number; fatGoal?: number
}>()

const macros = computed(() => [
  { label: 'Protein', value: Math.round(props.protein), goal: props.proteinGoal ?? 150, color: '#3b82f6' },
  { label: 'Carbs', value: Math.round(props.carbs), goal: props.carbsGoal ?? 250, color: '#f59e0b' },
  { label: 'Fat', value: Math.round(props.fat), goal: props.fatGoal ?? 65, color: '#f43f5e' },
])
</script>
