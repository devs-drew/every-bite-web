<template>
  <div class="min-h-screen flex flex-col bg-canvas max-w-md mx-auto px-6">
    <!-- Brand -->
    <div class="pt-20 pb-8 text-center">
      <div class="w-16 h-16 rounded-3xl bg-brand-600 shadow-brand flex items-center justify-center mx-auto mb-4">
        <Salad class="w-8 h-8 text-white" :stroke-width="2" />
      </div>
      <h1 class="text-2xl font-extrabold tracking-tight text-ink-900">Every Bite</h1>
      <p class="text-ink-500 text-sm mt-1.5">Choose a new password</p>
    </div>

    <!-- Card -->
    <div class="eb-card p-6">
      <!-- Invalid link state -->
      <div v-if="invalidLink" class="text-center space-y-3">
        <p class="text-sm text-danger-text">Invalid or expired reset link.</p>
        <RouterLink to="/forgot-password" class="text-brand-700 text-sm font-semibold hover:underline">
          Request a new one
        </RouterLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="eb-label">New Password</label>
          <input v-model="password" type="password" required :minlength="8" placeholder="••••••••" class="eb-input" />
        </div>
        <div>
          <label class="eb-label">Confirm Password</label>
          <input v-model="passwordConfirmation" type="password" required :minlength="8" placeholder="••••••••" class="eb-input" />
        </div>
        <p v-if="error" class="text-sm text-danger-text">{{ error }}</p>
        <button type="submit" :disabled="loading" class="eb-btn-primary w-full mt-1">
          {{ loading ? 'Updating…' : 'Set New Password' }}
        </button>
      </form>
    </div>

    <p class="text-center text-sm text-ink-500 mt-6">
      <RouterLink to="/login" class="text-brand-700 font-semibold hover:underline">Back to sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Salad } from '@lucide/vue'
import { authService } from '@/services/auth.service'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { show } = useToast()

const token = computed(() => route.query.token as string | undefined)
const email = computed(() => route.query.email as string | undefined)
const invalidLink = computed(() => !token.value || !email.value)

const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await authService.resetPassword({
      token: token.value!,
      email: email.value!,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    show('Password updated — please sign in', 'success')
    router.push('/login')
  } catch (e: any) {
    const msg = e.response?.data?.errors?.email?.[0]
      ?? e.response?.data?.message
      ?? 'Something went wrong. Please try again.'
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>
