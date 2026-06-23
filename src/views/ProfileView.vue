<template>
  <AppLayout title="Profile">
    <div class="px-5 pb-4 space-y-5">
      <!-- Avatar header -->
      <div class="flex items-center gap-4 px-1">
        <div class="w-16 h-16 rounded-3xl bg-brand-100 text-brand-700 text-2xl font-extrabold flex items-center justify-center shadow-xs">
          {{ initial }}
        </div>
        <div class="min-w-0">
          <p class="text-lg font-bold text-ink-900 truncate">{{ profile.name || 'Your name' }}</p>
          <p class="text-sm text-ink-400 truncate">{{ profile.email || '—' }}</p>
        </div>
      </div>

      <!-- Personal info -->
      <section class="space-y-3">
        <h2 class="eb-eyebrow px-1">Personal Info</h2>
        <form @submit.prevent="saveProfile" class="eb-card p-5 space-y-4">
          <div>
            <label class="eb-label">Name</label>
            <input v-model="profile.name" type="text" required class="eb-input" />
          </div>
          <div>
            <label class="eb-label">Email</label>
            <input v-model="profile.email" type="email" required class="eb-input" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="eb-label">Age</label>
              <input v-model.number="profile.age" type="number" min="10" max="120" placeholder="—" class="eb-input" />
            </div>
            <div>
              <label class="eb-label">Weight (kg)</label>
              <input v-model.number="profile.weight_kg" type="number" min="20" max="500" step="0.1" placeholder="—" class="eb-input" />
            </div>
          </div>
          <button type="submit" :disabled="savingProfile" class="eb-btn-primary w-full">
            {{ savingProfile ? 'Saving…' : 'Save Info' }}
          </button>
        </form>
      </section>

      <!-- Goals -->
      <section class="space-y-3">
        <h2 class="eb-eyebrow px-1">Goals</h2>
        <form @submit.prevent="saveGoals" class="eb-card p-5 space-y-4">
          <div>
            <label class="eb-label">Goal weight (kg)</label>
            <input v-model.number="goals.goal_weight_kg" type="number" min="20" max="500" step="0.1" placeholder="—" class="eb-input" />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="eb-label mb-0">Daily calorie target</label>
              <button type="button" @click="calculateBMR" class="text-xs font-semibold text-brand-700 hover:underline">
                Calculate (BMR)
              </button>
            </div>
            <input v-model.number="goals.daily_calorie_target" type="number" min="500" max="9999" required class="eb-input" />
            <p v-if="bmrNote" class="text-xs text-ink-400 mt-1.5">{{ bmrNote }}</p>
          </div>
          <button type="submit" :disabled="savingGoals" class="eb-btn-primary w-full">
            {{ savingGoals ? 'Saving…' : 'Save Goals' }}
          </button>
        </form>
      </section>

      <button @click="handleLogout" class="eb-btn-danger w-full">
        Sign Out
      </button>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
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

const initial = computed(() => (profile.name?.[0] ?? 'U').toUpperCase())

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
