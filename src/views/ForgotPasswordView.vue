<template>
  <div class="min-h-screen flex flex-col bg-canvas max-w-md mx-auto px-6">
    <!-- Brand -->
    <div class="pt-20 pb-8 text-center">
      <div class="w-16 h-16 rounded-3xl bg-brand-600 shadow-brand flex items-center justify-center mx-auto mb-4">
        <Salad class="w-8 h-8 text-white" :stroke-width="2" />
      </div>
      <h1 class="text-2xl font-extrabold tracking-tight text-ink-900">Every Bite</h1>
      <p class="text-ink-500 text-sm mt-1.5">Reset your password</p>
    </div>

    <!-- Card -->
    <div class="eb-card p-6">
      <!-- Success state -->
      <div v-if="sent" class="text-center space-y-2">
        <p class="text-ink-900 font-semibold">Check your inbox</p>
        <p class="text-sm text-ink-500">
          If that email is registered, a reset link has been sent. It may take a minute to arrive.
        </p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="eb-label">Email</label>
          <input v-model="email" type="email" required placeholder="you@example.com" class="eb-input" />
        </div>
        <p v-if="error" class="text-sm text-danger-text">{{ error }}</p>
        <button type="submit" :disabled="loading" class="eb-btn-primary w-full mt-1">
          {{ loading ? 'Sending…' : 'Send Reset Link' }}
        </button>
      </form>
    </div>

    <p class="text-center text-sm text-ink-500 mt-6">
      <RouterLink to="/login" class="text-brand-700 font-semibold hover:underline">Back to sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Salad } from '@lucide/vue'
import { authService } from '@/services/auth.service'

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await authService.forgotPassword(email.value)
    sent.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
