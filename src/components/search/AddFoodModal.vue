<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/40" @click="$emit('update:modelValue', false)" />
      <div class="relative bg-white rounded-t-3xl w-full max-w-md p-6 space-y-5"
        style="animation: slideUp 0.25s ease-out">
        <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto -mt-1 mb-2" />

        <div>
          <h2 class="font-semibold text-gray-900 text-base">{{ food.food_name }}</h2>
          <p v-if="food.brand_name" class="text-xs text-gray-400 mt-0.5">{{ food.brand_name }}</p>
        </div>

        <!-- Meal selector -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Meal</label>
          <div class="flex gap-2 flex-wrap">
            <button v-for="m in meals" :key="m"
              type="button"
              @click="selectedMeal = m"
              class="px-3 py-1.5 rounded-lg text-sm capitalize transition"
              :class="selectedMeal === m
                ? 'bg-gray-900 text-white font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
              {{ m }}
            </button>
          </div>
        </div>

        <!-- Serving size -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Serving (g)</label>
          <div class="flex gap-2">
            <input v-model.number="servingG" type="number" min="1" max="9999"
              class="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
            <button v-for="g in [50, 100, 150]" :key="g"
              type="button"
              @click="servingG = g"
              class="px-3 py-2 text-xs rounded-xl transition"
              :class="servingG === g
                ? 'bg-gray-900 text-white font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
              {{ g }}g
            </button>
          </div>
        </div>

        <!-- Macro preview -->
        <div class="grid grid-cols-4 gap-2 bg-gray-50 rounded-2xl p-4 text-center">
          <div>
            <p class="text-base font-bold text-gray-900">{{ preview.calories }}</p>
            <p class="text-xs text-gray-400 mt-0.5">kcal</p>
          </div>
          <div>
            <p class="text-base font-bold text-gray-900">{{ preview.protein }}g</p>
            <p class="text-xs text-gray-400 mt-0.5">protein</p>
          </div>
          <div>
            <p class="text-base font-bold text-gray-900">{{ preview.carbs }}g</p>
            <p class="text-xs text-gray-400 mt-0.5">carbs</p>
          </div>
          <div>
            <p class="text-base font-bold text-gray-900">{{ preview.fat }}g</p>
            <p class="text-xs text-gray-400 mt-0.5">fat</p>
          </div>
        </div>

        <button @click="handleAdd" :disabled="adding"
          class="w-full bg-gray-900 text-white py-3.5 rounded-2xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
          {{ adding ? 'Adding…' : 'Add to Log' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

<style scoped>
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
</style>
