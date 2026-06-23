<template>
  <div class="flex items-center justify-between py-3 px-4 group">
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-800 truncate">{{ log.food_name }}</p>
      <p class="text-xs text-gray-400 mt-0.5">
        {{ log.serving_qty }} × {{ log.serving_size_g }}g
        <span v-if="log.brand_name"> · {{ log.brand_name }}</span>
      </p>
    </div>
    <div class="flex items-center gap-3 ml-2 shrink-0">
      <span class="text-sm font-semibold text-gray-700">{{ Math.round(log.calories) }} kcal</span>
      <button @click="$emit('delete', log.id)"
        class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition">
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import type { FoodLog } from '@/stores/foodLog'

defineProps<{ log: FoodLog }>()
defineEmits<{ delete: [id: number] }>()
</script>
