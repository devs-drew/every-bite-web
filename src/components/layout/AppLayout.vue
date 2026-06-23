<template>
  <div class="flex flex-col min-h-screen bg-white max-w-md mx-auto relative">
    <header class="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
      <button v-if="showBack" @click="router.back()"
        class="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <h1 class="text-base font-semibold text-gray-900 flex-1">{{ title }}</h1>
      <slot name="header-right" />
    </header>

    <main class="flex-1 overflow-y-auto pb-20">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex z-10">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex flex-col items-center gap-1 py-3 flex-1 text-xs text-gray-400 transition-colors"
        active-class="text-gray-900"
      >
        <component :is="tab.icon" class="w-5 h-5" />
        {{ tab.label }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ChevronLeft, LayoutDashboard, BookOpen, Search, User } from '@lucide/vue'

defineProps<{ title: string; showBack?: boolean }>()

const router = useRouter()
const tabs = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/log', label: 'Log', icon: BookOpen },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/profile', label: 'Profile', icon: User },
]
</script>
