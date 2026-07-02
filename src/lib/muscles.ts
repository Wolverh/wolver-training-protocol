// Muscle group to SVG path ID mapping
// Maps exercise muscle_groups to SVG element IDs for the hypertrophy map

export interface MuscleMapping {
  frontIds: string[]
  backIds: string[]
  label: string
  color: string
}

export const MUSCLE_MAP: Record<string, MuscleMapping> = {
  chest: {
    frontIds: ['chest-left', 'chest-right'],
    backIds: [],
    label: 'Chest',
    color: '#00e5ff',
  },
  lats: {
    frontIds: [],
    backIds: ['lat-left', 'lat-right'],
    label: 'Latissimus Dorsi',
    color: '#00e5ff',
  },
  upper_back: {
    frontIds: [],
    backIds: ['upper-back-left', 'upper-back-right', 'rhomboid-left', 'rhomboid-right'],
    label: 'Upper Back',
    color: '#00e5ff',
  },
  traps: {
    frontIds: ['trap-left-front', 'trap-right-front'],
    backIds: ['trap-left', 'trap-right'],
    label: 'Trapezius',
    color: '#b08d57',
  },
  front_delts: {
    frontIds: ['front-delt-left', 'front-delt-right'],
    backIds: [],
    label: 'Front Deltoids',
    color: '#00e5ff',
  },
  side_delts: {
    frontIds: ['side-delt-left', 'side-delt-right'],
    backIds: ['side-delt-back-left', 'side-delt-back-right'],
    label: 'Side Deltoids',
    color: '#d4af37',
  },
  rear_delts: {
    frontIds: [],
    backIds: ['rear-delt-left', 'rear-delt-right'],
    label: 'Rear Deltoids',
    color: '#00e5ff',
  },
  biceps: {
    frontIds: ['bicep-left', 'bicep-right'],
    backIds: [],
    label: 'Biceps',
    color: '#00e5ff',
  },
  triceps: {
    frontIds: [],
    backIds: ['tricep-left', 'tricep-right'],
    label: 'Triceps',
    color: '#00e5ff',
  },
  forearms: {
    frontIds: ['forearm-left', 'forearm-right'],
    backIds: ['forearm-back-left', 'forearm-back-right'],
    label: 'Forearms',
    color: '#b08d57',
  },
  quads: {
    frontIds: ['quad-left', 'quad-right'],
    backIds: [],
    label: 'Quadriceps',
    color: '#b08d57',
  },
  hamstrings: {
    frontIds: [],
    backIds: ['hamstring-left', 'hamstring-right'],
    label: 'Hamstrings',
    color: '#b08d57',
  },
  glutes: {
    frontIds: [],
    backIds: ['glute-left', 'glute-right'],
    label: 'Glutes',
    color: '#b08d57',
  },
  calves: {
    frontIds: ['calf-left', 'calf-right'],
    backIds: ['calf-back-left', 'calf-back-right'],
    label: 'Calves',
    color: '#b08d57',
  },
  abs: {
    frontIds: ['abs-upper', 'abs-lower'],
    backIds: [],
    label: 'Abdominals',
    color: '#d4af37',
  },
  core: {
    frontIds: ['oblique-left', 'oblique-right'],
    backIds: ['lower-back-left', 'lower-back-right'],
    label: 'Core',
    color: '#d4af37',
  },
  lower_back: {
    frontIds: [],
    backIds: ['lower-back-left', 'lower-back-right'],
    label: 'Lower Back',
    color: '#d4af37',
  },
}

export function getActiveMusclesVolume(completedExerciseMuscleGroups: string[][]): Map<string, number> {
  const activeVolume = new Map<string, number>()
  completedExerciseMuscleGroups.forEach(groups => {
    groups.forEach(group => {
      activeVolume.set(group, (activeVolume.get(group) || 0) + 1)
    })
  })
  return activeVolume
}

export function getActiveSvgVolume(activeVolume: Map<string, number>): { frontVolume: Map<string, number>; backVolume: Map<string, number> } {
  const frontVolume = new Map<string, number>()
  const backVolume = new Map<string, number>()

  activeVolume.forEach((count, muscle) => {
    const mapping = MUSCLE_MAP[muscle]
    if (mapping) {
      mapping.frontIds.forEach(id => {
        frontVolume.set(id, (frontVolume.get(id) || 0) + count)
      })
      mapping.backIds.forEach(id => {
        backVolume.set(id, (backVolume.get(id) || 0) + count)
      })
    }
  })

  return { frontVolume, backVolume }
}
