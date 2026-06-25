import { describe, it, expect } from 'vitest'
import {
  mifflinStJeorBmr, tdee, dailyTarget,
  kgToLbs, lbsToKg, cmToFtIn, ftInToCm,
} from './nutrition'

describe('mifflinStJeorBmr', () => {
  it('uses the male formula (+5)', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(mifflinStJeorBmr({ weightKg: 80, heightCm: 180, age: 30, gender: 'male' })).toBe(1780)
  })

  it('uses the female formula (-161)', () => {
    // 10*65 + 6.25*165 - 5*28 - 161 = 650 + 1031.25 - 140 - 161 = 1380.25 -> 1380
    expect(mifflinStJeorBmr({ weightKg: 65, heightCm: 165, age: 28, gender: 'female' })).toBe(1380)
  })

  it('returns 0 when any input is missing or zero', () => {
    expect(mifflinStJeorBmr({ weightKg: 0, heightCm: 180, age: 30, gender: 'male' })).toBe(0)
    expect(mifflinStJeorBmr({ weightKg: 80, heightCm: 0, age: 30, gender: 'male' })).toBe(0)
    expect(mifflinStJeorBmr({ weightKg: 80, heightCm: 180, age: 0, gender: 'male' })).toBe(0)
  })
})

describe('tdee', () => {
  it('multiplies BMR by the activity factor and rounds', () => {
    expect(tdee(1780, 1.55)).toBe(2759) // 2759.0
    expect(tdee(1380, 1.375)).toBe(1898) // 1897.5 -> 1898
  })

  it('is 0 when BMR is 0', () => {
    expect(tdee(0, 1.55)).toBe(0)
  })
})

describe('dailyTarget', () => {
  it('adds the adjustment to TDEE', () => {
    expect(dailyTarget(2500, -500)).toBe(2000)
    expect(dailyTarget(2500, 300)).toBe(2800)
  })

  it('floors the target at 1200 kcal', () => {
    expect(dailyTarget(1300, -500)).toBe(1200) // 800 would be unsafe
  })
})

describe('unit conversions', () => {
  it('kgToLbs rounds to the nearest pound', () => {
    expect(kgToLbs(70)).toBe(154) // 154.35
  })

  it('lbsToKg rounds to one decimal', () => {
    expect(lbsToKg(154)).toBe(69.8) // 69.84...
  })

  it('cmToFtIn splits height correctly', () => {
    expect(cmToFtIn(180)).toEqual({ ft: 5, in: 11 }) // 70.86in -> 5ft 11in
    expect(cmToFtIn(152.4)).toEqual({ ft: 5, in: 0 }) // exactly 5ft
  })

  it('ftInToCm rounds to the nearest cm', () => {
    expect(ftInToCm(5, 11)).toBe(180) // 180.34 -> 180
    expect(ftInToCm(6, 0)).toBe(183) // 182.88 -> 183
  })

  it('round-trips height within a couple cm', () => {
    const { ft, in: inches } = cmToFtIn(175)
    expect(Math.abs(ftInToCm(ft, inches) - 175)).toBeLessThanOrEqual(2)
  })
})
