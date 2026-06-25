<template>
  <div class="eb-card p-4 space-y-3">
    <p class="eb-eyebrow">Macros</p>
    <div class="grid grid-cols-3 gap-2">
      <div v-for="macro in macros" :key="macro.label" class="flex flex-col items-center gap-1.5">
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: macro.color }" />
          <span class="text-[11px] font-medium text-ink-500">{{ macro.label }}</span>
        </div>

        <!-- Arc ring -->
        <div class="relative" style="width:56px;height:56px">
          <svg width="56" height="56" viewBox="0 0 56 56" class="-rotate-90">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#e9efeb" stroke-width="5" />
            <circle cx="28" cy="28" r="22" fill="none"
              :stroke="macro.color"
              stroke-width="5"
              stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset(Math.min(macro.pct, 100))"
              style="transition: stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-[10px] font-bold tabular-nums leading-none"
              :style="{ color: macro.color }">{{ macro.pct }}<span class="text-[8px]">%</span></span>
          </div>
        </div>

        <!-- Value / goal -->
        <div class="flex items-baseline gap-0.5">
          <span class="text-sm font-bold text-ink-900 tabular-nums">{{ macro.value }}</span>
          <span class="text-[11px] text-ink-400"> / {{ macro.goal }}g</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  protein: number; carbs: number; fat: number
  proteinGoal?: number; carbsGoal?: number; fatGoal?: number
}>()

const ringRadius = 22
const ringCircumference = 2 * Math.PI * ringRadius

function ringOffset(pct: number) {
  return ringCircumference * (1 - pct / 100)
}

const macros = computed(() => {
  const make = (label: string, value: number, goal: number, color: string) => {
    const v = Math.round(value)
    return { label, value: v, goal, color, pct: Math.round((v / goal) * 100) }
  }
  return [
    make('Protein', props.protein, props.proteinGoal ?? 150, '#3b82f6'),
    make('Carbs',   props.carbs,   props.carbsGoal   ?? 250, '#f59e0b'),
    make('Fat',     props.fat,     props.fatGoal     ?? 65,  '#f43f5e'),
  ]
})
</script>
