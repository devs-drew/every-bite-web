<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 bg-black flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 pt-12 pb-4 z-10">
        <button @click="close" class="text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
          <X class="w-5 h-5" />
        </button>
        <span class="text-white text-sm font-medium">Scan Barcode</span>
        <div class="w-9" />
      </div>

      <!-- Camera feed -->
      <div class="flex-1 relative flex items-center justify-center overflow-hidden">
        <video ref="videoEl" class="absolute inset-0 w-full h-full object-cover" autoplay muted playsinline />

        <!-- Viewfinder overlay -->
        <div class="relative z-10 w-64 h-40">
          <!-- Corner marks -->
          <span class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
          <span class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
          <span class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
          <span class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />

          <!-- Scanning line animation -->
          <div v-if="scanning" class="absolute inset-x-2 h-0.5 bg-green-400 rounded-full scan-line" />
        </div>

        <!-- Dim overlay outside viewfinder -->
        <div class="absolute inset-0 pointer-events-none"
          style="background: radial-gradient(ellipse 280px 180px at center, transparent 80%, rgba(0,0,0,0.6) 100%)" />
      </div>

      <!-- Status -->
      <div class="px-4 pb-12 pt-6 text-center z-10">
        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        <p v-else-if="scanning" class="text-white/70 text-sm">Point your camera at a barcode</p>
        <p v-else class="text-white/70 text-sm">Starting camera…</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X } from '@lucide/vue'

const emit = defineEmits<{ detected: [barcode: string]; close: [] }>()

const videoEl = ref<HTMLVideoElement | null>(null)
const scanning = ref(false)
const error = ref('')

let stream: MediaStream | null = null
let animFrame: number | null = null
let detector: any = null

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
    })
    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
    }
    await initDetector()
  } catch (e: any) {
    error.value = e.name === 'NotAllowedError'
      ? 'Camera permission denied. Please allow camera access and try again.'
      : 'Could not access camera. Try on a device with a camera.'
  }
}

async function initDetector() {
  // Use native BarcodeDetector (Chrome 83+) — fast, no library needed
  if ('BarcodeDetector' in window) {
    detector = new (window as any).BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
    })
    scanning.value = true
    scanLoop()
  } else {
    error.value = 'Barcode scanning is not supported in this browser. Use Chrome or Edge.'
  }
}

function scanLoop() {
  if (!videoEl.value || videoEl.value.readyState < 2) {
    animFrame = requestAnimationFrame(scanLoop)
    return
  }
  detector.detect(videoEl.value)
    .then((barcodes: any[]) => {
      if (barcodes.length > 0) {
        const value = barcodes[0].rawValue
        stopCamera()
        emit('detected', value)
      } else {
        animFrame = requestAnimationFrame(scanLoop)
      }
    })
    .catch(() => { animFrame = requestAnimationFrame(scanLoop) })
}

function stopCamera() {
  if (animFrame !== null) cancelAnimationFrame(animFrame)
  stream?.getTracks().forEach(t => t.stop())
  stream = null
  scanning.value = false
}

function close() {
  stopCamera()
  emit('close')
}

onMounted(startCamera)
onUnmounted(stopCamera)
</script>

<style scoped>
.scan-line {
  animation: scan 2s ease-in-out infinite;
  top: 10%;
}
@keyframes scan {
  0%, 100% { top: 10%; opacity: 1; }
  50%       { top: 85%; opacity: 0.8; }
}
</style>
