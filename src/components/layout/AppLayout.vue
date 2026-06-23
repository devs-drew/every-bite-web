<template>
  <div class="flex flex-col min-h-screen bg-canvas max-w-md mx-auto relative">
    <header class="sticky top-0 z-20 bg-canvas/85 backdrop-blur-md px-5 pt-5 pb-3 flex items-center gap-3">
      <button v-if="showBack" @click="router.back()"
        class="w-9 h-9 -ml-1 rounded-full bg-surface shadow-xs flex items-center justify-center text-ink-700 active:scale-95 transition">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <h1 class="text-xl font-bold tracking-tight text-ink-900 flex-1">{{ title }}</h1>
      <slot name="header-right" />
    </header>

    <main class="flex-1 overflow-y-auto pb-28">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-20 px-4 pb-4 pointer-events-none">
      <div class="pointer-events-auto bg-surface/95 backdrop-blur-md border border-line rounded-[1.75rem] shadow-pop flex px-2 py-2">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex-1 flex flex-col items-center gap-1 py-1.5 group"
        >
          <span
            class="flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200"
            :class="isActive(tab.to) ? 'bg-brand-100 text-brand-700' : 'text-ink-400 group-active:scale-90'">
            <component :is="tab.icon" class="w-[18px] h-[18px]" :stroke-width="isActive(tab.to) ? 2.4 : 2" />
          </span>
          <span class="text-[10.5px] font-semibold transition-colors"
            :class="isActive(tab.to) ? 'text-brand-700' : 'text-ink-400'">
            {{ tab.label }}
          </span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { ChevronLeft, LayoutGrid, NotebookPen, Search, User } from '@lucide/vue'

defineProps<{ title: string; showBack?: boolean }>()

const router = useRouter()
const route = useRoute()

const tabs = [
  { to: '/dashboard', label: 'Home', icon: LayoutGrid },
  { to: '/log', label: 'Log', icon: NotebookPen },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/profile', label: 'Profile', icon: User },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>
