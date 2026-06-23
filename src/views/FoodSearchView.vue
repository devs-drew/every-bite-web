<template>
  <AppLayout title="Search Food" :show-back="true">
    <div class="p-4 space-y-5">
      <!-- Search bar -->
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            v-model="query"
            type="text"
            placeholder="Search foods…"
            @input="onSearch"
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
        </div>
        <button @click="showScanner = true"
          class="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition">
          <ScanLine class="w-4 h-4" />
          Scan
        </button>
      </div>

      <!-- Loading -->
      <div v-if="search.isSearching" class="text-center py-12 text-gray-400 text-sm">Searching…</div>

      <template v-else>
        <!-- Search results -->
        <div v-if="query" class="space-y-2">
          <div v-for="food in search.results" :key="food.off_product_id"
            class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 cursor-pointer transition"
            @click="selectFood(food)">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ food.food_name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ food.brand_name ?? 'Generic' }} · {{ food.nutrients_per_100g.calories }} kcal/100g
              </p>
            </div>
            <Plus class="w-5 h-5 text-gray-300 ml-3 shrink-0" />
          </div>
          <div v-if="!search.results.length" class="text-center py-12 text-gray-400 text-sm">
            No results for "{{ query }}"
          </div>
        </div>

        <!-- Empty state + top foods -->
        <div v-else class="space-y-5">
          <!-- Empty hint -->
          <div class="text-center py-4">
            <Search class="w-8 h-8 mx-auto mb-2 text-gray-200" />
            <p class="text-sm text-gray-400">Search or scan a barcode to find food</p>
          </div>

          <!-- Top logged foods -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Frequently Logged
            </h3>
            <div class="space-y-2">
              <div v-for="food in topFoods" :key="food.off_product_id"
                class="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 cursor-pointer transition"
                @click="selectFood(food)">
                <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <component :is="foodIcon(food.food_name)" class="w-4 h-4 text-gray-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ food.food_name }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ food.brand_name ?? 'Generic' }} · {{ food.nutrients_per_100g.calories }} kcal/100g
                  </p>
                </div>
                <Plus class="w-4 h-4 text-gray-300 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Barcode scanner (fullscreen camera) -->
    <BarcodeScanner
      v-if="showScanner"
      @detected="onBarcodeDetected"
      @close="showScanner = false" />

    <!-- Add food modal -->
    <AddFoodModal
      v-if="selectedFood"
      v-model="showModal"
      :food="selectedFood"
      :initial-meal="route.query.meal as string"
      :date="route.query.date as string"
      @added="onAdded" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, ScanLine, Plus, Egg, Apple, Wheat, Beef, Milk } from '@lucide/vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AddFoodModal from '@/components/search/AddFoodModal.vue'
import BarcodeScanner from '@/components/search/BarcodeScanner.vue'
import { useFoodSearchStore, TOP_FOODS_FIXTURE, type FoodResult } from '@/stores/foodSearch'

const search = useFoodSearchStore()
const route = useRoute()
const router = useRouter()

const query = ref('')
const showScanner = ref(false)
const selectedFood = ref<FoodResult | null>(null)
const showModal = ref(false)
const topFoods = TOP_FOODS_FIXTURE

// Map food name keywords to icons
function foodIcon(name: string) {
  const n = name.toLowerCase()
  if (n.includes('egg'))    return Egg
  if (n.includes('chicken') || n.includes('beef') || n.includes('meat')) return Beef
  if (n.includes('milk') || n.includes('yogurt') || n.includes('dairy')) return Milk
  if (n.includes('rice') || n.includes('oat') || n.includes('bread') || n.includes('grain')) return Wheat
  return Apple
}

let debounceTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) { search.clearResults(); return }
  debounceTimer = setTimeout(() => search.searchByName(query.value), 400)
}

async function onBarcodeDetected(barcode: string) {
  showScanner.value = false
  await search.searchByBarcode(barcode)
}

function selectFood(food: FoodResult) {
  selectedFood.value = food
  showModal.value = true
}

function onAdded() {
  router.push('/dashboard')
}
</script>
