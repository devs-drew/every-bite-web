<template>
  <div class="bg-white rounded-2xl border border-gray-100">
    <button @click="expanded = !expanded"
      class="w-full flex items-center justify-between px-4 py-3.5 text-left">
      <div class="flex items-center gap-2.5">
        <component :is="icon" class="w-4 h-4 text-gray-400" />
        <span class="font-medium text-sm text-gray-800 capitalize">{{ mealType }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">{{ mealCalories }} kcal</span>
        <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': expanded }" />
      </div>
    </button>

    <div v-if="expanded" class="border-t border-gray-50">
      <FoodLogItem v-for="log in logs" :key="log.id" :log="log" @delete="$emit('delete', $event)" />
      <div v-if="!logs.length" class="px-4 py-3 text-xs text-gray-400 italic">Nothing logged yet</div>
      <div class="px-4 py-3 border-t border-gray-50">
        <RouterLink :to="`/search?meal=${mealType}&date=${date}`"
          class="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition">
          <Plus class="w-3.5 h-3.5" /> Add food
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, Plus, Coffee, Sun, Sunset, Apple } from '@lucide/vue'
import FoodLogItem from './FoodLogItem.vue'
import type { FoodLog } from '@/stores/foodLog'

const props = defineProps<{
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  logs: FoodLog[]
  date: string
}>()
defineEmits<{ delete: [id: number] }>()

const expanded = ref(true)
const mealCalories = computed(() => Math.round(props.logs.reduce((s, l) => s + l.calories, 0)))
const icon = computed(() => ({ breakfast: Coffee, lunch: Sun, dinner: Sunset, snack: Apple }[props.mealType]))
</script>
