<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" style="animation: eb-fade .2s ease-out"
        @click="$emit('update:modelValue', false)" />
      <div class="relative bg-surface rounded-t-4xl w-full max-w-md p-6 space-y-5"
        style="animation: eb-slide-up .28s cubic-bezier(.4,0,.2,1)">
        <div class="w-10 h-1.5 bg-ink-200 rounded-full mx-auto -mt-1.5 mb-1" />

        <div class="flex items-center gap-3">
          <span class="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
            <Utensils class="w-5 h-5 text-brand-600" />
          </span>
          <div class="min-w-0">
            <h2 class="font-bold text-ink-900 text-base truncate">{{ food.food_name }}</h2>
            <p v-if="food.brand_name" class="text-xs text-ink-400 truncate">{{ food.brand_name }}</p>
          </div>
        </div>

        <!-- Meal selector -->
        <div class="space-y-2">
          <label class="eb-eyebrow">Meal</label>
          <div class="flex gap-2 flex-wrap">
            <button v-for="m in meals" :key="m" type="button" @click="selectedMeal = m"
              class="capitalize" :class="selectedMeal === m ? 'eb-chip-on' : 'eb-chip-off'">
              {{ m }}
            </button>
          </div>
        </div>

        <!-- Serving size -->
        <div class="space-y-2">
          <label class="eb-eyebrow">Serving (g)</label>
          <div class="flex gap-2">
            <input v-model.number="servingG" type="number" min="1" max="9999" class="eb-input flex-1" />
            <button v-for="g in [50, 100, 150]" :key="g" type="button" @click="servingG = g"
              class="shrink-0" :class="servingG === g ? 'eb-chip-on' : 'eb-chip-off'">
              {{ g }}g
            </button>
          </div>
        </div>

        <!-- Macro preview -->
        <div class="grid grid-cols-4 gap-2 bg-surface-sunken rounded-3xl p-4 text-center">
          <div>
            <p class="text-lg font-extrabold text-ink-900 tabular-nums">{{ preview.calories }}</p>
            <p class="text-[11px] text-ink-400 mt-0.5">kcal</p>
          </div>
          <div v-for="m in macroPreview" :key="m.label">
            <p class="text-lg font-extrabold tabular-nums" :style="{ color: m.color }">{{ m.value }}g</p>
            <p class="text-[11px] text-ink-400 mt-0.5">{{ m.label }}</p>
          </div>
        </div>

        <button @click="handleAdd" :disabled="adding" class="eb-btn-primary w-full">
          {{ adding ? 'Adding…' : 'Add to Log' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Utensils } from '@lucide/vue'
import { useFoodLogStore } from '@/stores/foodLog'
import type { FoodResult } from '@/stores/foodSearch'

const props = defineProps<{
  modelValue: boolean
  food: FoodResult
  initialMeal?: string
  date?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [boolean]; added: [] }>()

const foodLog = useFoodLogStore()
const meals = ['breakfast', 'lunch', 'dinner', 'snack']
const selectedMeal = ref(props.initialMeal ?? 'breakfast')
const servingG = ref(props.food.serving_size_g ?? 100)
const adding = ref(false)

const preview = computed(() => {
  const ratio = servingG.value / 100
  const n = props.food.nutrients_per_100g
  return {
    calories: Math.round((n.calories ?? 0) * ratio),
    protein: Math.round((n.protein_g ?? 0) * ratio * 10) / 10,
    carbs: Math.round((n.carbs_g ?? 0) * ratio * 10) / 10,
    fat: Math.round((n.fat_g ?? 0) * ratio * 10) / 10,
  }
})

const macroPreview = computed(() => [
  { label: 'protein', value: preview.value.protein, color: '#3b82f6' },
  { label: 'carbs', value: preview.value.carbs, color: '#f59e0b' },
  { label: 'fat', value: preview.value.fat, color: '#f43f5e' },
])

async function handleAdd() {
  adding.value = true
  try {
    const date = props.date ?? new Date().toISOString().slice(0, 10)
    await foodLog.addLog({
      food_name: props.food.food_name,
      brand_name: props.food.brand_name,
      barcode: props.food.barcode,
      off_product_id: props.food.off_product_id,
      meal_type: selectedMeal.value,
      logged_date: date,
      serving_qty: 1,
      serving_size_g: servingG.value,
      calories: preview.value.calories,
      protein_g: preview.value.protein,
      carbs_g: preview.value.carbs,
      fat_g: preview.value.fat,
    })
    emit('added')
    emit('update:modelValue', false)
  } finally { adding.value = false }
}
</script>
