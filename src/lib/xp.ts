// XP calculation utilities

export const BASE_EXERCISE_XP = 10
export const HARD_EXERCISE_XP = 15
export const DAY_COMPLETION_MULTIPLIER = 1.5
export const DAY_COMPLETION_BONUS = 50

export function calculateDayBonus(exerciseCount: number): number {
  return Math.round(DAY_COMPLETION_BONUS + (exerciseCount * BASE_EXERCISE_XP * (DAY_COMPLETION_MULTIPLIER - 1)))
}

export function formatXP(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

export function getXPLevel(xp: number): { level: number; title: string; progress: number; nextLevelXP: number } {
  const levels = [
    { threshold: 0, title: 'Initiate' },
    { threshold: 200, title: 'Recruit' },
    { threshold: 500, title: 'Operator' },
    { threshold: 1000, title: 'Specialist' },
    { threshold: 2000, title: 'Veteran' },
    { threshold: 4000, title: 'Elite' },
    { threshold: 7000, title: 'Apex Predator' },
    { threshold: 12000, title: 'Wolver' },
  ]

  let currentLevel = 0
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].threshold) {
      currentLevel = i
      break
    }
  }

  const currentThreshold = levels[currentLevel].threshold
  const nextThreshold = currentLevel < levels.length - 1 ? levels[currentLevel + 1].threshold : levels[currentLevel].threshold * 2
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100

  return {
    level: currentLevel + 1,
    title: levels[currentLevel].title,
    progress: Math.min(progress, 100),
    nextLevelXP: nextThreshold,
  }
}
