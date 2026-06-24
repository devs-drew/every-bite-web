<template>
  <AppLayout title="Search Food" :show-back="true">
    <div class="px-5 pb-4 space-y-5">
      <!-- Search bar -->
      <div class="flex gap-2.5">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            v-model="query"
            type="text"
            placeholder="Search foods…"
            @input="onSearch"
            class="eb-input pl-11" />
        </div>
        <button @click="showScanner = true"
          class="flex items-center gap-1.5 px-4 rounded-2xl text-sm font-semibold text-white bg-brand-600 shadow-brand active:scale-95 transition">
          <ScanLine class="w-4 h-4" />
          Scan
        </button>
      </div>

      <!-- Loading -->
      <div v-if="search.isSearching" class="text-center py-12 text-ink-400 text-sm">Searching…</div>

      <template v-else>
        <!-- Search results -->
        <div v-if="query" class="space-y-2.5">
          <button v-for="food in search.results" :key="food.off_product_id"
            class="w-full flex items-center gap-3 p-3.5 eb-card text-left hover:shadow-pop transition"
            @click="selectFood(food)">
            <span class="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
              <component :is="foodIcon(food.food_name)" class="w-[18px] h-[18px] text-brand-600" :stroke-width="2.2" />
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-ink-900 truncate">{{ food.food_name }}</p>
              <p class="text-[11px] text-ink-400 mt-0.5">
                {{ food.brand_name ?? 'Generic' }} · {{ food.nutrients_per_100g.calories }} kcal/100g
              </p>
            </div>
            <span class="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Plus class="w-4 h-4" />
            </span>
          </button>
          <div v-if="!search.results.length" class="text-center py-12 space-y-3">
            <p class="text-sm text-ink-400">
              {{ search.searchFailed ? 'Couldn\'t reach the food database.' : `No results for "${query}"` }}
            </p>
            <button v-if="search.searchFailed"
              @click="search.searchByName(query)"
              class="text-sm font-semibold text-brand-600">
              Try again
            </button>
          </div>
        </div>

        <!-- Empty state + top foods -->
        <div v-else class="space-y-5">
          <div class="eb-card p-6 text-center">
            <span class="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
              <Search class="w-5 h-5 text-brand-500" />
            </span>
            <p class="text-sm font-medium text-ink-700">Find your food</p>
            <p class="text-xs text-ink-400 mt-1">Search by name or scan a barcode</p>
          </div>

          <div>
            <h3 class="eb-eyebrow mb-3 px-1">Frequently Logged</h3>
            <div class="space-y-2.5">
              <button v-for="food in topFoods" :key="food.off_product_id"
                class="w-full flex items-center gap-3 p-3.5 eb-card text-left hover:shadow-pop transition"
                @click="selectFood(food)">
                <span class="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                  <component :is="foodIcon(food.food_name)" class="w-[18px] h-[18px] text-brand-600" :stroke-width="2.2" />
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-ink-900 truncate">{{ food.food_name }}</p>
                  <p class="text-[11px] text-ink-400 mt-0.5">
                    {{ food.brand_name ?? 'Generic' }} · {{ food.nutrients_per_100g.calories }} kcal/100g
                  </p>
                </div>
                <span class="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Plus class="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <BarcodeScanner
      v-if="showScanner"
      @detected="onBarcodeDetected"
      @close="showScanner = false" />

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

function foodIcon(name: string) {
  const n = name.toLowerCase()
  if (n.includes('egg')) return Egg
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
