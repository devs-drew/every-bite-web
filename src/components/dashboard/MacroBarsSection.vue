<template>
  <div class="space-y-3 px-4">
    <div v-for="macro in macros" :key="macro.label" class="space-y-1">
      <div class="flex justify-between text-xs">
        <span class="font-medium">{{ macro.label }}</span>
        <span class="text-muted-foreground">{{ macro.value }}g</span>
      </div>
      <div class="h-2 rounded-full bg-muted overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500"
          :class="macro.color"
          :style="{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%` }" />
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

const macros = computed(() => [
  { label: 'Protein', value: Math.round(props.protein), goal: props.proteinGoal ?? 150, color: 'bg-blue-500' },
  { label: 'Carbs', value: Math.round(props.carbs), goal: props.carbsGoal ?? 250, color: 'bg-amber-400' },
  { label: 'Fat', value: Math.round(props.fat), goal: props.fatGoal ?? 65, color: 'bg-rose-400' },
])
</script>
