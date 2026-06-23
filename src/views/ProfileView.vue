<template>
  <AppLayout title="Profile">
    <div class="p-4 space-y-6">
      <!-- Personal info -->
      <section class="space-y-4">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Personal Info</h2>
        <form @submit.prevent="saveProfile" class="space-y-3">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Name</label>
            <input v-model="profile.name" type="text" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input v-model="profile.email" type="email" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Age</label>
              <input v-model.number="profile.age" type="number" min="10" max="120" placeholder="—"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Weight (kg)</label>
              <input v-model.number="profile.weight_kg" type="number" min="20" max="500" step="0.1" placeholder="—"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
            </div>
          </div>
          <button type="submit" :disabled="savingProfile"
            class="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
            {{ savingProfile ? 'Saving…' : 'Save Info' }}
          </button>
        </form>
      </section>

      <!-- Goals -->
      <section class="space-y-4">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Goals</h2>
        <form @submit.prevent="saveGoals" class="space-y-3">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Goal weight (kg)</label>
            <input v-model.number="goals.goal_weight_kg" type="number" min="20" max="500" step="0.1" placeholder="—"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Daily calorie target</label>
              <button type="button" @click="calculateBMR"
                class="text-xs text-gray-500 hover:text-gray-900 underline transition">
                Calculate (BMR)
              </button>
            </div>
            <input v-model.number="goals.daily_calorie_target" type="number" min="500" max="9999" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition" />
            <p v-if="bmrNote" class="text-xs text-gray-400">{{ bmrNote }}</p>
          </div>
          <button type="submit" :disabled="savingGoals"
            class="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
            {{ savingGoals ? 'Saving…' : 'Save Goals' }}
          </button>
        </form>
      </section>

      <!-- Logout -->
      <button @click="handleLogout"
        class="w-full border border-red-100 text-red-400 py-3 rounded-xl text-sm font-medium hover:bg-red-50 transition">
        Sign Out
      </button>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const savingProfile = ref(false)
const savingGoals = ref(false)
const bmrNote = ref('')

const profile = reactive({ name: auth.user?.name ?? '', email: auth.user?.email ?? '', age: auth.user?.age, weight_kg: auth.user?.weight_kg })
const goals = reactive({ goal_weight_kg: auth.user?.goal_weight_kg, daily_calorie_target: auth.user?.daily_calorie_target ?? 2000 })

function calculateBMR() {
  if (!profile.weight_kg || !profile.age) { bmrNote.value = 'Enter your age and weight first.'; return }
  const bmr = Math.round(10 * profile.weight_kg + 6.25 * 170 - 5 * profile.age + 5)
  goals.daily_calorie_target = Math.round(bmr * 1.375)
  bmrNote.value = 'Estimated for lightly active. Adjust as needed.'
}

async function saveProfile() {
  savingProfile.value = true
  try { await auth.updateProfile(profile) } finally { savingProfile.value = false }
}

async function saveGoals() {
  savingGoals.value = true
  try { await auth.updateGoals(goals) } finally { savingGoals.value = false }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

onMounted(async () => {
  if (!auth.user) await auth.fetchUser()
  Object.assign(profile, { name: auth.user?.name, email: auth.user?.email, age: auth.user?.age, weight_kg: auth.user?.weight_kg })
  Object.assign(goals, { goal_weight_kg: auth.user?.goal_weight_kg, daily_calorie_target: auth.user?.daily_calorie_target })
})
</script>
