<template>
  <div class="min-h-screen bg-canvas flex flex-col overflow-hidden select-none max-w-md mx-auto">
    <!-- Skip -->
    <div class="flex justify-end px-6 pt-12 pb-4">
      <button @click="finish" class="text-sm font-medium text-ink-400 hover:text-ink-700 transition">Skip</button>
    </div>

    <!-- Slides -->
    <div class="flex-1 relative overflow-hidden">
      <div
        class="flex h-full transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(calc(-${current} * (100% / ${slides.length})))`, width: `${slides.length * 100}%` }">
        <div
          v-for="(slide, i) in slides"
          :key="i"
          class="flex flex-col items-center justify-center px-8 text-center"
          :style="{ width: `${100 / slides.length}%` }">

          <!-- Icon blob -->
          <div class="relative mb-12">
            <div class="w-48 h-48 rounded-[2.5rem] bg-brand-50 rotate-6 flex items-center justify-center">
              <div class="w-36 h-36 rounded-[2rem] bg-brand-100 -rotate-6 flex items-center justify-center shadow-sm">
                <component :is="slide.icon" class="w-16 h-16 text-brand-600" :stroke-width="1.5" />
              </div>
            </div>
            <span class="absolute -top-1 -right-2 w-6 h-6 rounded-full bg-brand-400/70" />
            <span class="absolute bottom-2 -left-4 w-3.5 h-3.5 rounded-full bg-brand-300/70" />
            <span class="absolute -bottom-2 right-6 w-2.5 h-2.5 rounded-full bg-warning/60" />
          </div>

          <!-- Text -->
          <h2 class="text-3xl font-extrabold text-ink-900 leading-tight mb-4 whitespace-pre-line">{{ slide.title }}</h2>
          <p class="text-ink-500 text-base leading-relaxed max-w-xs">{{ slide.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="px-6 pb-12 pt-6 flex flex-col items-center gap-6">
      <div class="flex gap-2">
        <button
          v-for="(_, i) in slides"
          :key="i"
          @click="current = i"
          class="rounded-full transition-all duration-300"
          :class="i === current ? 'w-7 h-2.5 bg-brand-600' : 'w-2.5 h-2.5 bg-brand-200'" />
      </div>
      <button @click="next" class="eb-btn-primary w-full py-4 text-base">
        {{ isLast ? 'Get Started' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Salad, ScanLine, Trophy } from '@lucide/vue'

const router = useRouter()
const current = ref(0)

const slides = [
  {
    icon: Salad,
    title: 'Log Every Bite',
    subtitle: 'Track your meals, calories, and macros with ease. Every bite counts toward your goals.',
  },
  {
    icon: ScanLine,
    title: 'Scan Barcodes\nin Seconds',
    subtitle: 'Point your camera at any product barcode and get instant nutrition data.',
  },
  {
    icon: Trophy,
    title: 'Crush Your\nDaily Goals',
    subtitle: 'Stay consistent with daily targets and watch your progress grow week by week.',
  },
]

const isLast = computed(() => current.value === slides.length - 1)

function next() {
  if (isLast.value) finish()
  else current.value++
}

function finish() {
  localStorage.setItem('onboarding_seen', '1')
  router.push('/login')
}
</script>
