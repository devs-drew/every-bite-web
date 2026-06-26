<template>
  <div class="min-h-screen flex flex-col bg-canvas max-w-md mx-auto px-6">
    <!-- Brand -->
    <div class="pt-20 pb-8 text-center">
      <div class="w-16 h-16 rounded-3xl bg-brand-600 shadow-brand flex items-center justify-center mx-auto mb-4">
        <Salad class="w-8 h-8 text-white" :stroke-width="2" />
      </div>
      <h1 class="text-2xl font-extrabold tracking-tight text-ink-900">Every Bite</h1>
      <p class="text-ink-500 text-sm mt-1.5">
        {{ isLogin ? 'Welcome back — let\'s keep it going' : 'Start tracking in seconds' }}
      </p>
    </div>

    <!-- Card -->
    <div class="eb-card p-6">
      <!-- Login -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="eb-label">Email</label>
          <input v-model="form.email" type="email" required placeholder="you@example.com" class="eb-input" />
        </div>
        <div>
          <div class="flex justify-between items-center">
            <label class="eb-label">Password</label>
            <RouterLink to="/forgot-password" class="text-xs text-brand-700 hover:underline">Forgot password?</RouterLink>
          </div>
          <input v-model="form.password" type="password" required placeholder="••••••••" class="eb-input" />
        </div>
        <p v-if="error" class="text-sm text-danger-text">{{ error }}</p>
        <button type="submit" :disabled="loading" class="eb-btn-primary w-full mt-1">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
        <button type="button" @click="handleDemo" class="eb-btn-secondary w-full">
          Try Demo
        </button>
      </form>

      <!-- Register -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="eb-label">Name</label>
          <input v-model="form.name" type="text" required placeholder="Your name" class="eb-input" />
        </div>
        <div>
          <label class="eb-label">Email</label>
          <input v-model="form.email" type="email" required placeholder="you@example.com" class="eb-input" />
        </div>
        <div>
          <label class="eb-label">Password</label>
          <input v-model="form.password" type="password" required :minlength="8" placeholder="••••••••" class="eb-input" />
        </div>
        <p v-if="error" class="text-sm text-danger-text">{{ error }}</p>
        <button type="submit" :disabled="loading" class="eb-btn-primary w-full mt-1">
          {{ loading ? 'Creating account…' : 'Create Account' }}
        </button>
      </form>
    </div>

    <p class="text-center text-sm text-ink-500 mt-6">
      {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
      <RouterLink :to="isLogin ? '/register' : '/login'" class="text-brand-700 font-semibold hover:underline ml-1">
        {{ isLogin ? 'Sign up' : 'Sign in' }}
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Salad } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isLogin = computed(() => route.path === '/login')
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '' })

onMounted(() => {
  const savedName = localStorage.getItem('onboarding_name')
  if (savedName) form.name = savedName
})

function handleDemo() {
  auth.loginAsDemo()
  router.push('/dashboard')
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login({ email: form.email, password: form.password })
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Login failed. Please try again.'
  } finally { loading.value = false }
}

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password,
    })
    router.push('/onboarding')
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Registration failed. Please try again.'
  } finally { loading.value = false }
}
</script>
