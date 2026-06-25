<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" style="animation: eb-fade .2s ease-out"
        @click="$emit('cancel')" />
      <div class="relative bg-surface rounded-3xl w-full max-w-sm p-6 space-y-4"
        style="animation: eb-fade .2s ease-out">
        <h2 class="text-base font-bold text-ink-900">{{ title }}</h2>
        <p class="text-sm text-ink-500 leading-relaxed">{{ message }}</p>
        <div class="flex gap-3 pt-1">
          <button @click="$emit('cancel')" class="eb-btn-secondary flex-1">
            {{ cancelLabel }}
          </button>
          <button @click="$emit('confirm')"
            class="flex-1 py-3 rounded-2xl text-sm font-bold transition-all"
            :class="destructive ? 'bg-red-500 text-white active:bg-red-600' : 'eb-btn-primary'">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  destructive: false,
})

defineEmits<{ confirm: []; cancel: [] }>()
</script>
