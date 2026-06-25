// Pure nutrition math (Mifflin-St Jeor) + unit conversions.
// Shared by ProfileView and OnboardingView; unit-tested in nutrition.spec.ts.

export interface BmrInput {
  weightKg: number
  heightCm: number
  age: number
  gender: 'male' | 'female'
}

/** Mifflin-St Jeor BMR, rounded. Returns 0 if any input is missing/zero. */
export function mifflinStJeorBmr({ weightKg, heightCm, age, gender }: BmrInput): number {
  if (!weightKg || !heightCm || !age) return 0
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return Math.round(gender === 'male' ? base + 5 : base - 161)
}

/** Total daily energy expenditure = BMR × activity factor, rounded. */
export function tdee(bmr: number, activityFactor: number): number {
  return Math.round(bmr * activityFactor)
}

/** Daily calorie target = TDEE + adjustment, floored at 1200 kcal. */
export function dailyTarget(tdeeValue: number, adjustment: number): number {
  return Math.max(1200, tdeeValue + adjustment)
}

// --- Unit conversions (match the app's existing rounding exactly) ---
export const kgToLbs = (kg: number): number => Math.round(kg * 2.205)
export const lbsToKg = (lbs: number): number => Math.round((lbs / 2.205) * 10) / 10
export const cmToFtIn = (cm: number): { ft: number; in: number } => ({
  ft: Math.floor(cm / 2.54 / 12),
  in: Math.round((cm / 2.54) % 12),
})
export const ftInToCm = (ft: number, inches: number): number => Math.round((ft * 12 + inches) * 2.54)
