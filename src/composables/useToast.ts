import { ref } from 'vue'

const toast = ref<{ msg: string; type: 'success' | 'error' } | null>(null)
let timer: ReturnType<typeof setTimeout>

export function useToast() {
  function show(msg: string, type: 'success' | 'error' = 'success') {
    clearTimeout(timer)
    toast.value = { msg, type }
    timer = setTimeout(() => (toast.value = null), 3000)
  }
  return { toast, show }
}
