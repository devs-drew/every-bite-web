<template>
  <div class="eb-card p-4 space-y-3">
    <!-- Month / week nav -->
    <div class="flex items-center justify-between">
      <span class="text-base font-bold text-ink-900">{{ monthLabel }}</span>
      <div class="flex items-center gap-1">
        <button
          @click="prevWeek"
          class="w-7 h-7 flex items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 active:scale-95 transition">
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          @click="nextWeek"
          class="w-7 h-7 flex items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 active:scale-95 transition">
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Day letters -->
    <div class="grid grid-cols-7">
      <div
        v-for="(letter, i) in dayLetters"
        :key="i"
        class="flex items-center justify-center text-[11px] font-medium text-ink-400 h-7">
        {{ letter }}
      </div>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-7">
      <button
        v-for="day in weekDays"
        :key="day.iso"
        @click="emit('select', day.iso)"
        class="flex items-center justify-center h-8 transition active:scale-95">
        <span
          class="w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full"
          :class="day.isSelected
            ? 'bg-brand-600 text-white'
            : day.isToday
              ? 'text-brand-600 font-bold'
              : 'text-ink-700 hover:bg-ink-50'">
          {{ day.date }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{ selectedDate: string }>()
const emit = defineEmits<{ select: [iso: string] }>()

const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function toSunday(d: Date): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() - copy.getDay())
  copy.setHours(0, 0, 0, 0)
  return copy
}

const todayMidnight = new Date()
todayMidnight.setHours(0, 0, 0, 0)
const todayIso = todayMidnight.toISOString().slice(0, 10)

const weekStart = ref(toSunday(new Date()))

const monthLabel = computed(() => {
  const mid = new Date(weekStart.value)
  mid.setDate(mid.getDate() + 3)
  return mid.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    return {
      iso,
      date: d.getDate(),
      isToday: iso === todayIso,
      isSelected: iso === props.selectedDate,
    }
  })
)

function prevWeek() {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() - 7)
  weekStart.value = d
}

function nextWeek() {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + 7)
  weekStart.value = d
}
</script>
