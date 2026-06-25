<template>
  <div class="min-h-screen bg-canvas flex flex-col overflow-hidden select-none max-w-md mx-auto">
    <!-- Skip -->
    <div class="flex justify-end px-6 pt-12 pb-4">
      <button @click="skip" class="text-sm font-medium text-ink-400 hover:text-ink-700 transition">Skip</button>
    </div>

    <!-- Slides -->
    <div
      class="flex-1 relative overflow-hidden"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div
        class="flex h-full transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(calc(-${current} * (100% / ${slides.length})))`, width: `${slides.length * 100}%` }">
        <div
          v-for="(slide, i) in slides"
          :key="i"
          class="flex flex-col"
          :class="slide.type === 'profile'
            ? 'items-stretch justify-start overflow-y-auto px-6 pt-2 text-left h-full'
            : 'items-center justify-center px-8 text-center'"
          :style="{ width: `${100 / slides.length}%` }">

          <!-- Content slides (1–3) -->
          <template v-if="slide.type === 'content'">
            <div class="relative mb-12">
              <div class="w-48 h-48 rounded-[2.5rem] bg-brand-50 rotate-6 flex items-center justify-center">
                <div class="w-36 h-36 rounded-[2rem] bg-brand-100 -rotate-6 flex items-center justify-center shadow-sm">
                  <component :is="slide.icon" class="w-16 h-16 text-brand-600" :stroke-width="1.5" />
                </div>
              </div>
              <span class="absolute -top-1 -right-2 w-6 h-6 rounded-full bg-brand-400/70" />
              <span class="absolute bottom-2 -left-4 w-3.5 h-3.5 rounded-full bg-brand-300/70" />
              <span class="absolute -bottom-2 right-6 w-2.5 h-2.5 rounded-full bg-warning/60" />
            </div>
            <h2 class="text-3xl font-extrabold text-ink-900 leading-tight mb-4 whitespace-pre-line">{{ slide.title }}</h2>
            <p class="text-ink-500 text-base leading-relaxed max-w-xs">{{ slide.subtitle }}</p>
          </template>

          <!-- Profile slide (4th) -->
          <template v-else-if="slide.type === 'profile'">
            <h2 class="text-2xl font-extrabold text-ink-900 leading-tight mb-1">About You</h2>
            <p class="text-sm text-ink-500 mb-4">Help us personalize your daily calorie target</p>

            <p class="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Gender</p>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <button @click="profile.gender = 'male'" class="py-2.5 rounded-xl text-sm font-semibold transition-all"
                :class="profile.gender === 'male' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">Male</button>
              <button @click="profile.gender = 'female'" class="py-2.5 rounded-xl text-sm font-semibold transition-all"
                :class="profile.gender === 'female' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">Female</button>
            </div>

            <label class="eb-label">Name</label>
            <input v-model="profile.name" type="text" class="eb-input mb-1" placeholder="Your name" @input="profileError = ''" />
            <p v-if="profileError" class="text-xs text-red-500 mb-2">{{ profileError }}</p>
            <div v-else class="mb-3" />

            <label class="eb-label">Age</label>
            <input v-model.number="profile.age" type="number" min="10" max="120" placeholder="—" class="eb-input mb-3" />

            <p class="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Units</p>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <button @click="profile.unit = 'metric'" class="py-2.5 rounded-xl text-sm font-semibold transition-all"
                :class="profile.unit === 'metric' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">Metric</button>
              <button @click="profile.unit = 'imperial'" class="py-2.5 rounded-xl text-sm font-semibold transition-all"
                :class="profile.unit === 'imperial' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">Imperial</button>
            </div>

            <label class="eb-label">Weight</label>
            <div class="relative mb-3">
              <input v-if="profile.unit === 'metric'" v-model.number="profile.weightKg" type="number" min="20" max="300" placeholder="—" class="eb-input pr-12" />
              <input v-else v-model.number="profile.weightLbs" type="number" min="44" max="660" placeholder="—" class="eb-input pr-12" />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400 pointer-events-none">{{ profile.unit === 'metric' ? 'kg' : 'lbs' }}</span>
            </div>

            <label class="eb-label">Height</label>
            <div class="mb-3">
              <div v-if="profile.unit === 'metric'" class="relative">
                <input v-model.number="profile.heightCm" type="number" min="100" max="250" placeholder="—" class="eb-input pr-12" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400 pointer-events-none">cm</span>
              </div>
              <div v-else class="grid grid-cols-2 gap-2">
                <div class="relative">
                  <input v-model.number="profile.heightFt" type="number" min="3" max="8" placeholder="ft" class="eb-input pr-9" />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-400 pointer-events-none">ft</span>
                </div>
                <div class="relative">
                  <input v-model.number="profile.heightIn" type="number" min="0" max="11" placeholder="in" class="eb-input pr-9" />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-400 pointer-events-none">in</span>
                </div>
              </div>
            </div>

            <p class="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Activity Level</p>
            <div class="grid grid-cols-2 gap-2 pb-4">
              <button v-for="act in activities" :key="act.label" @click="profile.activityFactor = act.factor"
                class="py-3 px-3 rounded-xl text-left transition-all"
                :class="profile.activityFactor === act.factor ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                <p class="text-sm font-semibold">{{ act.label }}</p>
                <p class="text-[11px] mt-0.5" :class="profile.activityFactor === act.factor ? 'text-white/70' : 'text-ink-400'">{{ act.hint }}</p>
              </button>
            </div>
          </template>

          <!-- Goal slide (5th) -->
          <template v-else-if="slide.type === 'goal'">
            <div class="w-full max-w-xs">
              <h2 class="text-3xl font-extrabold text-ink-900 leading-tight mb-2">What's Your Goal?</h2>
              <p class="text-ink-500 text-base leading-relaxed mb-8">We'll adjust your calories based on your goal</p>

              <!-- Direction buttons -->
              <div class="flex flex-col gap-3 mb-6">
                <button @click="setDirection('lose')" class="py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  :class="goalConfig.direction === 'lose' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                  🔻 Lose Weight
                </button>
                <button @click="setDirection('maintain')" class="py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  :class="goalConfig.direction === 'maintain' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                  ⚖️ Maintain Weight
                </button>
                <button @click="setDirection('gain')" class="py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  :class="goalConfig.direction === 'gain' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                  🔺 Gain Weight
                </button>
              </div>

              <!-- Intensity picker -->
              <template v-if="goalConfig.direction !== 'maintain'">
                <p class="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-2">How fast?</p>
                <div class="grid grid-cols-3 gap-2 mb-5">
                  <button
                    v-for="preset in deficitPresets[goalConfig.direction]"
                    :key="preset.label"
                    @click="goalConfig.adjustment = preset.delta"
                    class="py-3 px-2 rounded-xl text-center transition-all"
                    :class="goalConfig.adjustment === preset.delta ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'">
                    <p class="text-sm font-semibold">{{ preset.label }}</p>
                    <p class="text-[10px] mt-0.5 leading-tight"
                      :class="goalConfig.adjustment === preset.delta ? 'text-white/70' : 'text-ink-400'">{{ preset.hint }}</p>
                  </button>
                </div>

                <!-- Adjustment preview pill -->
                <div class="flex justify-center">
                  <span class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold"
                    :class="goalConfig.direction === 'lose' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'">
                    {{ goalConfig.adjustment > 0 ? '+' : '' }}{{ goalConfig.adjustment }} kcal/day
                  </span>
                </div>
              </template>
            </div>
          </template>

          <!-- Setup slide (6th) -->
          <template v-else-if="slide.type === 'setup'">
            <div class="w-full max-w-xs">
              <div class="mb-6">
                <h2 class="text-3xl font-extrabold text-ink-900 leading-tight mb-2">Your Daily Goal</h2>
                <p class="text-ink-500 text-base leading-relaxed">Here's your personalized calorie target</p>
              </div>

              <div class="text-center mb-2">
                <span class="text-5xl font-extrabold text-brand-600 tabular-nums">{{ goalKcal.toLocaleString() }}</span>
                <span class="text-xl font-medium text-ink-400 ml-1.5">kcal</span>
              </div>
              <div class="text-center mb-8 space-y-0.5">
                <p class="text-xs text-ink-400">TDEE {{ tdee.toLocaleString() }} kcal · BMR {{ bmr.toLocaleString() }} × {{ profile.activityFactor }}</p>
                <p v-if="goalConfig.adjustment !== 0" class="text-xs"
                  :class="goalConfig.adjustment < 0 ? 'text-red-400' : 'text-green-500'">
                  Adjustment: {{ goalConfig.adjustment > 0 ? '+' : '' }}{{ goalConfig.adjustment }} kcal/day
                </p>
              </div>

              <div class="relative">
                <input v-model.number="goalKcal" type="number" min="500" max="9999"
                  class="eb-input text-center tabular-nums" placeholder="Custom amount" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400 pointer-events-none">kcal</span>
              </div>

              <p class="text-center text-xs text-ink-400 mt-4">You can change this anytime in Profile</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="px-6 pb-12 pt-6 flex flex-col items-center gap-6">
      <div class="flex gap-2">
        <button
          v-for="(_, i) in slides"
          :key="i"
          @click="current = i"
          class="rounded-full transition-all duration-300"
          :class="i === current ? 'w-7 h-2.5 bg-brand-600' : 'w-2.5 h-2.5 bg-brand-200'" />
      </div>
      <button @click="next" class="eb-btn-primary w-full py-4 text-base">
        {{ isLast ? 'Get Started' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Salad, ScanLine, Trophy } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { mifflinStJeorBmr, tdee as computeTdee, dailyTarget, lbsToKg, ftInToCm } from '@/utils/nutrition'

const router = useRouter()
const auth = useAuthStore()
const current = ref(0)
const goalKcal = ref(2000)
const profileError = ref('')

const profile = reactive({
  name: '',
  gender: 'male' as 'male' | 'female',
  age: null as number | null,
  unit: 'metric' as 'metric' | 'imperial',
  weightKg: null as number | null,
  heightCm: null as number | null,
  weightLbs: null as number | null,
  heightFt: null as number | null,
  heightIn: null as number | null,
  activityFactor: 1.55,
})

const activities = [
  { label: 'Sedentary', hint: 'Little or no exercise', factor: 1.2   },
  { label: 'Light',     hint: '1–3 days/week',          factor: 1.375 },
  { label: 'Moderate',  hint: '3–5 days/week',          factor: 1.55  },
  { label: 'Active',    hint: '6–7 days/week',          factor: 1.725 },
]

const goalConfig = reactive({
  direction: 'maintain' as 'lose' | 'maintain' | 'gain',
  adjustment: 0,
})

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

function setDirection(dir: 'lose' | 'maintain' | 'gain') {
  goalConfig.direction = dir
  if (dir === 'maintain') goalConfig.adjustment = 0
  else if (dir === 'lose') goalConfig.adjustment = -500
  else goalConfig.adjustment = 500
}

const bmr = computed(() => {
  const kg = profile.unit === 'metric' ? profile.weightKg : (profile.weightLbs != null ? profile.weightLbs / 2.205 : null)
  const cm = profile.unit === 'metric'
    ? profile.heightCm
    : (profile.heightFt != null ? (profile.heightFt * 12 + (profile.heightIn ?? 0)) * 2.54 : null)
  if (!kg || !cm || !profile.age) return 0
  return mifflinStJeorBmr({ weightKg: kg, heightCm: cm, age: profile.age, gender: profile.gender })
})
const tdee = computed(() => computeTdee(bmr.value, profile.activityFactor))

const slides = [
  { type: 'content' as const, icon: Salad,   title: 'Log Every Bite',           subtitle: 'Track your meals, calories, and macros with ease. Every bite counts toward your goals.' },
  { type: 'content' as const, icon: ScanLine, title: 'Scan Barcodes\nin Seconds', subtitle: 'Point your camera at any product barcode and get instant nutrition data.' },
  { type: 'content' as const, icon: Trophy,   title: 'Crush Your\nDaily Goals',   subtitle: 'Stay consistent with daily targets and watch your progress grow week by week.' },
  { type: 'profile' as const },
  { type: 'goal'    as const },
  { type: 'setup'   as const },
]

const isLast = computed(() => current.value === slides.length - 1)

watch(current, (idx) => {
  if (slides[idx]?.type === 'setup')
    goalKcal.value = dailyTarget(tdee.value, goalConfig.adjustment)
})

let touchStartX = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const dx = touchStartX - e.changedTouches[0].clientX
  if (dx > 50) next()
  else if (dx < -50 && current.value > 0) current.value--
}

function next() {
  if (slides[current.value]?.type === 'profile') {
    if (!profile.name.trim()) { profileError.value = 'Please enter your name'; return }
    profileError.value = ''
  }
  if (isLast.value) finish()
  else current.value++
}

function skip() {
  localStorage.setItem('onboarding_seen', '1')
  router.push(auth.isAuthenticated ? '/dashboard' : '/login')
}

async function finish() {
  const heightCm = profile.unit === 'metric'
    ? profile.heightCm
    : (profile.heightFt != null ? ftInToCm(profile.heightFt, profile.heightIn ?? 0) : null)
  const weightKg = profile.unit === 'metric'
    ? profile.weightKg
    : (profile.weightLbs != null ? lbsToKg(profile.weightLbs) : null)

  localStorage.setItem('onboarding_seen',               '1')
  localStorage.setItem('onboarding_goal',               String(goalKcal.value))
  localStorage.setItem('onboarding_name',               profile.name.trim())
  localStorage.setItem('onboarding_gender',             profile.gender)
  localStorage.setItem('onboarding_height_cm',          String(heightCm))
  localStorage.setItem('onboarding_activity_factor',    String(profile.activityFactor))
  localStorage.setItem('onboarding_goal_direction',     goalConfig.direction)
  localStorage.setItem('onboarding_calorie_adjustment', String(goalConfig.adjustment))
  localStorage.setItem('onboarding_unit',               profile.unit)

  if (auth.isAuthenticated) {
    await auth.updateProfile({
      name:            profile.name.trim(),
      age:             profile.age,
      gender:          profile.gender,
      weight_kg:       weightKg,
      height_cm:       heightCm,
      activity_factor: profile.activityFactor,
    })
    await auth.updateGoals({
      goal_direction:       goalConfig.direction,
      calorie_adjustment:   goalConfig.adjustment,
      daily_calorie_target: goalKcal.value,
    })
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>
