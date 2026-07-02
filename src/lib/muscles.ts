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
    color: '#4fc3f7',
  },
  lats: {
    frontIds: [],
    backIds: ['lat-left', 'lat-right'],
    label: 'Latissimus Dorsi',
    color: '#29b6f6',
  },
  upper_back: {
    frontIds: [],
    backIds: ['upper-back-left', 'upper-back-right', 'rhomboid-left', 'rhomboid-right'],
    label: 'Upper Back',
    color: '#29b6f6',
  },
  traps: {
    frontIds: ['trap-left-front', 'trap-right-front'],
    backIds: ['trap-left', 'trap-right'],
    label: 'Trapezius',
    color: '#4dd0e1',
  },
  front_delts: {
    frontIds: ['front-delt-left', 'front-delt-right'],
    backIds: [],
    label: 'Front Deltoids',
    color: '#4fc3f7',
  },
  side_delts: {
    frontIds: ['side-delt-left', 'side-delt-right'],
    backIds: ['side-delt-back-left', 'side-delt-back-right'],
    label: 'Side Deltoids',
    color: '#4dd0e1',
  },
  rear_delts: {
    frontIds: [],
    backIds: ['rear-delt-left', 'rear-delt-right'],
    label: 'Rear Deltoids',
    color: '#4fc3f7',
  },
  biceps: {
    frontIds: ['bicep-left', 'bicep-right'],
    backIds: [],
    label: 'Biceps',
    color: '#81d4fa',
  },
  triceps: {
    frontIds: [],
    backIds: ['tricep-left', 'tricep-right'],
    label: 'Triceps',
    color: '#81d4fa',
  },
  forearms: {
    frontIds: ['forearm-left', 'forearm-right'],
    backIds: ['forearm-back-left', 'forearm-back-right'],
    label: 'Forearms',
    color: '#4dd0e1',
  },
  quads: {
    frontIds: ['quad-left', 'quad-right'],
    backIds: [],
    label: 'Quadriceps',
    color: '#29b6f6',
  },
  hamstrings: {
    frontIds: [],
    backIds: ['hamstring-left', 'hamstring-right'],
    label: 'Hamstrings',
    color: '#29b6f6',
  },
  glutes: {
    frontIds: [],
    backIds: ['glute-left', 'glute-right'],
    label: 'Glutes',
    color: '#4fc3f7',
  },
  calves: {
    frontIds: ['calf-left', 'calf-right'],
    backIds: ['calf-back-left', 'calf-back-right'],
    label: 'Calves',
    color: '#4dd0e1',
  },
  abs: {
    frontIds: ['abs-upper', 'abs-lower'],
    backIds: [],
    label: 'Abdominals',
    color: '#4fc3f7',
  },
  core: {
    frontIds: ['oblique-left', 'oblique-right'],
    backIds: ['lower-back-left', 'lower-back-right'],
    label: 'Core',
    color: '#4dd0e1',
  },
  lower_back: {
    frontIds: [],
    backIds: ['lower-back-left', 'lower-back-right'],
    label: 'Lower Back',
    color: '#29b6f6',
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
