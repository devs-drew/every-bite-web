<template>
  <div class="bg-brand-500 rounded-4xl p-5">
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col gap-3 flex-1 min-w-0">
        <span class="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full self-start">
          ⚡ Daily intake
        </span>
        <div>
          <div class="flex items-baseline gap-1 flex-wrap">
            <span class="text-2xl font-extrabold text-white tabular-nums">{{ Math.round(consumed) }}</span>
            <span class="text-base text-white/80 font-medium">/ {{ target }} kcal</span>
          </div>
          <p class="text-sm text-white/70 mt-0.5">{{ remaining }} kcal remaining, {{ firstName }}</p>
        </div>
      </div>

      <!-- Compact % ring -->
      <div class="relative flex-shrink-0" style="width: 88px; height: 88px">
        <svg width="88" height="88" viewBox="0 0 88 88" class="-rotate-90">
          <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="9" />
          <circle
            cx="44" cy="44" r="36" fill="none"
            stroke="white"
            stroke-width="9"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            style="transition: stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-xl font-extrabold text-white tabular-nums leading-none">{{ pct }}<span class="text-[11px] font-medium text-white/70">%</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ consumed: number; target: number; firstName: string }>()

const radius = 36
const circumference = 2 * Math.PI * radius
const progress = computed(() => Math.min(props.consumed / props.target, 1))
const dashOffset = computed(() => circumference * (1 - progress.value))
const pct = computed(() => Math.round(progress.value * 100))
const remaining = computed(() => Math.max(0, Math.round(props.target - props.consumed)))
</script>
