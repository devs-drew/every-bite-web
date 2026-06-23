<template>
  <div class="eb-card overflow-hidden">
    <button @click="expanded = !expanded"
      class="w-full flex items-center justify-between px-4 py-3.5 text-left">
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-2xl flex items-center justify-center" :class="iconBg">
          <component :is="icon" class="w-[18px] h-[18px]" :class="iconColor" :stroke-width="2.2" />
        </span>
        <div>
          <span class="font-semibold text-sm text-ink-900 capitalize block leading-tight">{{ mealType }}</span>
          <span class="text-[11px] text-ink-400">{{ logs.length }} {{ logs.length === 1 ? 'item' : 'items' }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="text-sm font-bold text-ink-800 tabular-nums">{{ mealCalories }}</span>
        <span class="text-[11px] text-ink-400 -ml-1.5">kcal</span>
        <ChevronDown class="w-4 h-4 text-ink-400 transition-transform duration-200"
          :class="{ 'rotate-180': expanded }" />
      </div>
    </button>

    <div v-if="expanded" class="px-2 pb-2">
      <FoodLogItem v-for="log in logs" :key="log.id" :log="log" @delete="$emit('delete', $event)" />
      <p v-if="!logs.length" class="px-3 py-3 text-xs text-ink-400 italic">Nothing logged yet</p>
      <RouterLink :to="`/search?meal=${mealType}&date=${date}`"
        class="flex items-center justify-center gap-1.5 mx-1 mt-1 py-2.5 rounded-2xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition">
        <Plus class="w-4 h-4" /> Add food
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, Plus, Coffee, Sun, Sunset, Cookie } from '@lucide/vue'
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

const meta = computed(() => ({
  breakfast: { icon: Coffee, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  lunch: { icon: Sun, iconBg: 'bg-brand-50', iconColor: 'text-brand-600' },
  dinner: { icon: Sunset, iconBg: 'bg-rose-50', iconColor: 'text-rose-500' },
  snack: { icon: Cookie, iconBg: 'bg-violet-50', iconColor: 'text-violet-500' },
}[props.mealType]))

const icon = computed(() => meta.value.icon)
const iconBg = computed(() => meta.value.iconBg)
const iconColor = computed(() => meta.value.iconColor)
</script>
