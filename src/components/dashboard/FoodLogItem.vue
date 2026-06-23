<template>
  <div class="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-surface-sunken group transition">
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-ink-900 truncate">{{ log.food_name }}</p>
      <p class="text-[11px] text-ink-400 mt-0.5">
        {{ log.serving_qty }} × {{ log.serving_size_g }}g
        <span v-if="log.brand_name"> · {{ log.brand_name }}</span>
      </p>
    </div>
    <div class="flex items-center gap-2 ml-2 shrink-0">
      <span class="text-sm font-bold text-ink-800 tabular-nums">{{ Math.round(log.calories) }}</span>
      <span class="text-[11px] text-ink-400 -ml-1">kcal</span>
      <button @click="$emit('delete', log.id)"
        class="ml-1 w-7 h-7 flex items-center justify-center rounded-full text-ink-300 hover:text-danger-text hover:bg-danger-bg transition">
        <Trash2 class="w-3.5 h-3.5" />
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
