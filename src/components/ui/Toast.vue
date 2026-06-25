<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast"
        class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg whitespace-nowrap"
        :class="toast.type === 'error' ? 'bg-red-500' : 'bg-brand-600'"
      >
        {{ toast.msg }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
const { toast } = useToast()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>
