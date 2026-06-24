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

      <!-- Personal Info -->
      <section class="space-y-3">
        <h2 class="eb-eyebrow px-1">Personal Info</h2>
        <form @submit.prevent="saveProfile" class="eb-card p-5 space-y-4">
          <!-- Gender -->
          <div>
            <label class="eb-label">Gender</label>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" @click="profile.gender = 'male'"
                class="py-2.5 rounded-xl text-sm font-semibold transition-all"
                :class="profile.gender === 'male' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                Male
              </button>
              <button type="button" @click="profile.gender = 'female'"
                class="py-2.5 rounded-xl text-sm font-semibold transition-all"
                :class="profile.gender === 'female' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                Female
              </button>
            </div>
          </div>

          <!-- Name -->
          <div>
            <label class="eb-label">Name</label>
            <input v-model="profile.name" type="text" required class="eb-input" />
          </div>

          <!-- Email -->
          <div>
            <label class="eb-label">Email</label>
            <input v-model="profile.email" type="email" required class="eb-input" />
          </div>

          <!-- Age + Unit -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="eb-label">Age</label>
              <input v-model.number="profile.age" type="number" min="10" max="120" placeholder="—" class="eb-input" />
            </div>
            <div>
              <label class="eb-label">Units</label>
              <div class="grid grid-cols-2 gap-1.5 mt-1">
                <button type="button" @click="unit = 'metric'"
                  class="py-2 rounded-lg text-xs font-semibold transition-all"
                  :class="unit === 'metric' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                  Metric
                </button>
                <button type="button" @click="unit = 'imperial'"
                  class="py-2 rounded-lg text-xs font-semibold transition-all"
                  :class="unit === 'imperial' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                  Imperial
                </button>
              </div>
            </div>
          </div>

          <!-- Weight + Height -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="eb-label">Weight ({{ unit === 'metric' ? 'kg' : 'lbs' }})</label>
              <input
                v-if="unit === 'metric'"
                v-model.number="profile.weight_kg"
                type="number" min="20" max="300" step="0.1" placeholder="—" class="eb-input" />
              <input
                v-else
                v-model.number="weightLbs"
                type="number" min="44" max="660" step="0.1" placeholder="—" class="eb-input" />
            </div>
            <div>
              <label class="eb-label">Height</label>
              <div v-if="unit === 'metric'" class="relative">
                <input v-model.number="profile.height_cm" type="number" min="100" max="250" placeholder="—" class="eb-input pr-10" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400 pointer-events-none">cm</span>
              </div>
              <div v-else class="grid grid-cols-2 gap-1.5">
                <div class="relative">
                  <input v-model.number="heightFt" type="number" min="3" max="8" placeholder="ft" class="eb-input pr-6" />
                  <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-ink-400 pointer-events-none">ft</span>
                </div>
                <div class="relative">
                  <input v-model.number="heightIn" type="number" min="0" max="11" placeholder="in" class="eb-input pr-6" />
                  <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-ink-400 pointer-events-none">in</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Level -->
          <div>
            <label class="eb-label">Activity Level</label>
            <div class="grid grid-cols-2 gap-2 mt-1">
              <button
                v-for="act in activities"
                :key="act.label"
                type="button"
                @click="profile.activity_factor = act.factor"
                class="py-3 px-3 rounded-xl text-left transition-all"
                :class="profile.activity_factor === act.factor ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                <p class="text-sm font-semibold">{{ act.label }}</p>
                <p class="text-[11px] mt-0.5" :class="profile.activity_factor === act.factor ? 'text-white/70' : 'text-ink-400'">{{ act.hint }}</p>
              </button>
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
          <!-- Goal direction -->
          <div>
            <label class="eb-label">Goal</label>
            <div class="flex flex-col gap-2 mt-1">
              <button type="button" @click="setGoalDirection('lose')"
                class="py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                :class="goals.goal_direction === 'lose' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                🔻 Lose Weight
              </button>
              <button type="button" @click="setGoalDirection('maintain')"
                class="py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                :class="goals.goal_direction === 'maintain' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                ⚖️ Maintain Weight
              </button>
              <button type="button" @click="setGoalDirection('gain')"
                class="py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                :class="goals.goal_direction === 'gain' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                🔺 Gain Weight
              </button>
            </div>
          </div>

          <!-- Intensity picker -->
          <div v-if="goals.goal_direction !== 'maintain'">
            <label class="eb-label">How fast?</label>
            <div class="grid grid-cols-3 gap-2 mt-1">
              <button
                v-for="preset in deficitPresets[goals.goal_direction]"
                :key="preset.label"
                type="button"
                @click="goals.calorie_adjustment = preset.delta"
                class="py-3 px-2 rounded-xl text-center transition-all"
                :class="goals.calorie_adjustment === preset.delta ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                <p class="text-sm font-semibold">{{ preset.label }}</p>
                <p class="text-[10px] mt-0.5 leading-tight"
                  :class="goals.calorie_adjustment === preset.delta ? 'text-white/70' : 'text-ink-400'">{{ preset.hint }}</p>
              </button>
            </div>
          </div>

          <!-- Calculated target -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="eb-label mb-0">Daily calorie target</label>
              <span v-if="bmr > 0" class="text-xs text-ink-400">
                TDEE {{ tdee.toLocaleString() }}{{ goals.calorie_adjustment !== 0 ? (goals.calorie_adjustment > 0 ? ' +' : ' ') + goals.calorie_adjustment : '' }}
              </span>
            </div>
            <input v-model.number="goals.daily_calorie_target" type="number" min="500" max="9999" required class="eb-input" />
            <p v-if="bmr > 0" class="text-xs text-ink-400 mt-1.5">
              Calculated from your profile · tap Save Goals to apply
            </p>
          </div>

          <!-- Goal weight -->
          <div>
            <label class="eb-label">Goal weight ({{ unit === 'metric' ? 'kg' : 'lbs' }})</label>
            <input v-model.number="goals.goal_weight_kg" type="number" min="20" max="500" step="0.1" placeholder="—" class="eb-input" />
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const savingProfile = ref(false)
const savingGoals = ref(false)

const unit = ref<'metric' | 'imperial'>(
  (localStorage.getItem('onboarding_unit') as 'metric' | 'imperial') ?? 'metric'
)

// Imperial height helpers (display only — always stored as cm in profile.height_cm)
const heightFt = ref(Math.floor((auth.user?.height_cm ?? 170) / 2.54 / 12))
const heightIn = ref(Math.round(((auth.user?.height_cm ?? 170) / 2.54) % 12))

// Imperial weight helper (display only — always stored as kg in profile.weight_kg)
const weightLbs = ref(Math.round((auth.user?.weight_kg ?? 70) * 2.205))

const profile = reactive({
  name:            auth.user?.name ?? '',
  email:           auth.user?.email ?? '',
  age:             auth.user?.age ?? Number(localStorage.getItem('onboarding_age') ?? 25),
  gender:          (auth.user?.gender ?? localStorage.getItem('onboarding_gender') ?? 'male') as 'male' | 'female',
  weight_kg:       auth.user?.weight_kg ?? 70,
  height_cm:       auth.user?.height_cm ?? Number(localStorage.getItem('onboarding_height_cm') ?? 170),
  activity_factor: auth.user?.activity_factor ?? Number(localStorage.getItem('onboarding_activity_factor') ?? 1.55),
})

const goals = reactive({
  goal_weight_kg:      auth.user?.goal_weight_kg,
  daily_calorie_target:auth.user?.daily_calorie_target ?? 2000,
  goal_direction:      (auth.user?.goal_direction ?? localStorage.getItem('onboarding_goal_direction') ?? 'maintain') as 'lose' | 'maintain' | 'gain',
  calorie_adjustment:  auth.user?.calorie_adjustment ?? Number(localStorage.getItem('onboarding_calorie_adjustment') ?? 0),
})

const initial = computed(() => (profile.name?.[0] ?? 'U').toUpperCase())

const activities = [
  { label: 'Sedentary', hint: 'Little or no exercise', factor: 1.2   },
  { label: 'Light',     hint: '1–3 days/week',          factor: 1.375 },
  { label: 'Moderate',  hint: '3–5 days/week',          factor: 1.55  },
  { label: 'Active',    hint: '6–7 days/week',          factor: 1.725 },
]

const deficitPresets = {
  lose: [
    { label: 'Mild',       hint: '≈ 0.25 kg/week', delta: -250 },
    { label: 'Moderate',   hint: '≈ 0.5 kg/week',  delta: -500 },
    { label: 'Aggressive', hint: '≈ 0.75 kg/week', delta: -750 },
  ],
  gain: [
    { label: 'Mild',       hint: '≈ 0.25 kg/week', delta: 250 },
    { label: 'Moderate',   hint: '≈ 0.5 kg/week',  delta: 500 },
    { label: 'Aggressive', hint: '≈ 0.75 kg/week', delta: 750 },
  ],
}

const bmr = computed(() => {
  if (!profile.weight_kg || !profile.height_cm || !profile.age) return 0
  const base = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age
  return Math.round(profile.gender === 'male' ? base + 5 : base - 161)
})
const tdee = computed(() => Math.round(bmr.value * profile.activity_factor))

// Sync imperial helpers → metric storage when they change
watch(weightLbs, (lbs) => { profile.weight_kg = Math.round((lbs / 2.205) * 10) / 10 })
watch([heightFt, heightIn], ([ft, inn]) => { profile.height_cm = Math.round((ft * 12 + inn) * 2.54) })

function setGoalDirection(dir: 'lose' | 'maintain' | 'gain') {
  goals.goal_direction = dir
  if (dir === 'maintain') goals.calorie_adjustment = 0
  else if (dir === 'lose' && goals.calorie_adjustment >= 0) goals.calorie_adjustment = -500
  else if (dir === 'gain' && goals.calorie_adjustment <= 0) goals.calorie_adjustment = 500
}

async function saveProfile() {
  savingProfile.value = true
  localStorage.setItem('onboarding_unit', unit.value)
  try { await auth.updateProfile({ ...profile }) } finally { savingProfile.value = false }
}

async function saveGoals() {
  const target = Math.max(1200, tdee.value + goals.calorie_adjustment)
  if (target > 0) goals.daily_calorie_target = target
  savingGoals.value = true
  try { await auth.updateGoals({ ...goals }) } finally { savingGoals.value = false }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

onMounted(async () => {
  if (!auth.user) await auth.fetchUser()
  Object.assign(profile, {
    name:            auth.user?.name,
    email:           auth.user?.email,
    age:             auth.user?.age,
    gender:          auth.user?.gender ?? profile.gender,
    weight_kg:       auth.user?.weight_kg ?? profile.weight_kg,
    height_cm:       auth.user?.height_cm ?? profile.height_cm,
    activity_factor: auth.user?.activity_factor ?? profile.activity_factor,
  })
  Object.assign(goals, {
    goal_weight_kg:      auth.user?.goal_weight_kg,
    daily_calorie_target:auth.user?.daily_calorie_target,
    goal_direction:      auth.user?.goal_direction ?? goals.goal_direction,
    calorie_adjustment:  auth.user?.calorie_adjustment ?? goals.calorie_adjustment,
  })
  // sync imperial display helpers
  if (profile.height_cm) {
    heightFt.value = Math.floor(profile.height_cm / 2.54 / 12)
    heightIn.value = Math.round((profile.height_cm / 2.54) % 12)
  }
  if (profile.weight_kg) weightLbs.value = Math.round(profile.weight_kg * 2.205)
})
</script>
