<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-6">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Every Bite</h1>
        <p class="text-gray-500 text-sm mt-2">
          {{ isLogin ? 'Sign in to continue' : 'Create your account' }}
        </p>
      </div>

      <!-- Login -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" required placeholder="you@example.com"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" required placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
        </div>
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
        <button type="button" @click="handleDemo"
          class="w-full border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          Try Demo
        </button>
      </form>

      <!-- Register -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" required placeholder="Your name"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" required placeholder="you@example.com"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" required :minlength="8" placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Daily Calorie Target</label>
          <input v-model.number="form.daily_calorie_target" type="number" min="500" max="9999" placeholder="2000"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
        </div>
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
          {{ loading ? 'Creating account…' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <RouterLink :to="isLogin ? '/register' : '/login'" class="text-gray-900 font-semibold hover:underline ml-1">
          {{ isLogin ? 'Sign up' : 'Sign in' }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isLogin = computed(() => route.path === '/login')
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '', daily_calorie_target: 2000 })

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
      daily_calorie_target: form.daily_calorie_target,
    })
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Registration failed. Please try again.'
  } finally { loading.value = false }
}
</script>
