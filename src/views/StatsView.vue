<template>
  <AppLayout title="Stats">
    <div class="flex flex-col items-center justify-center h-64 gap-2 px-5">
      <BarChart2 class="w-10 h-10 text-ink-200" />
      <p class="text-base font-semibold text-ink-400">Coming Soon</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { BarChart2 } from '@lucide/vue'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>
