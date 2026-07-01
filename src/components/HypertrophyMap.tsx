'use client'

import { useMemo } from 'react'
import { getActiveSvgIds, MUSCLE_MAP } from '@/lib/muscles'

interface HypertrophyMapProps {
  activeMuscles: Set<string>
}

export default function HypertrophyMap({ activeMuscles }: HypertrophyMapProps) {
  const { frontIds, backIds } = useMemo(() => getActiveSvgIds(activeMuscles), [activeMuscles])

  const activeCount = activeMuscles.size
  const totalMuscles = Object.keys(MUSCLE_MAP).length
  const coveragePercent = Math.round((activeCount / totalMuscles) * 100)

  const getMuscleStyle = (id: string, isActive: boolean, color: string) => ({
    fill: isActive ? color : '#1a1a1a',
    opacity: isActive ? 0.85 : 0.4,
    filter: isActive ? `drop-shadow(0 0 8px ${color}60)` : 'none',
    transition: 'all 0.5s ease',
    stroke: isActive ? color : '#222',
    strokeWidth: 0.5,
  })

  const findMuscleColor = (id: string): string => {
    for (const [, mapping] of Object.entries(MUSCLE_MAP)) {
      if (mapping.frontIds.includes(id) || mapping.backIds.includes(id)) {
        return mapping.color
      }
    }
    return '#555'
  }

  return (
    <div className="w-full border border-border rounded-md bg-surface/50 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-text-tertiary uppercase tracking-widest mb-1">Hypertrophy Map</div>
            <div className="font-display text-lg font-bold text-text-primary">Muscle Activation</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-tertiary uppercase tracking-widest mb-1">Coverage</div>
            <div className={`font-display text-2xl font-bold ${coveragePercent > 50 ? 'gold-gradient-text' : 'text-text-secondary'}`}>
              {coveragePercent}%
            </div>
          </div>
        </div>

        <div className="flex items-start justify-center gap-6 md:gap-10">
          {/* Front View */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-text-tertiary uppercase tracking-widest mb-4">Front</span>
            <svg viewBox="0 0 200 420" className="w-32 md:w-40 h-auto">
              {/* Head */}
              <ellipse cx="100" cy="25" rx="18" ry="22" fill="#111" stroke="#222" strokeWidth="0.5" />
              {/* Neck */}
              <rect x="92" y="45" width="16" height="12" fill="#111" stroke="#222" strokeWidth="0.5" />
              
              {/* Traps */}
              <path id="trap-left-front" d="M80,57 Q70,55 65,70 L80,65 Z" style={getMuscleStyle('trap-left-front', frontIds.has('trap-left-front'), findMuscleColor('trap-left-front'))} />
              <path id="trap-right-front" d="M120,57 Q130,55 135,70 L120,65 Z" style={getMuscleStyle('trap-right-front', frontIds.has('trap-right-front'), findMuscleColor('trap-right-front'))} />

              {/* Front Delts */}
              <ellipse id="front-delt-left" cx="62" cy="78" rx="10" ry="14" style={getMuscleStyle('front-delt-left', frontIds.has('front-delt-left'), findMuscleColor('front-delt-left'))} />
              <ellipse id="front-delt-right" cx="138" cy="78" rx="10" ry="14" style={getMuscleStyle('front-delt-right', frontIds.has('front-delt-right'), findMuscleColor('front-delt-right'))} />

              {/* Side Delts */}
              <ellipse id="side-delt-left" cx="52" cy="78" rx="6" ry="12" style={getMuscleStyle('side-delt-left', frontIds.has('side-delt-left'), findMuscleColor('side-delt-left'))} />
              <ellipse id="side-delt-right" cx="148" cy="78" rx="6" ry="12" style={getMuscleStyle('side-delt-right', frontIds.has('side-delt-right'), findMuscleColor('side-delt-right'))} />

              {/* Chest */}
              <path id="chest-left" d="M68,68 Q72,62 92,62 L92,105 Q80,108 68,95 Z" style={getMuscleStyle('chest-left', frontIds.has('chest-left'), findMuscleColor('chest-left'))} />
              <path id="chest-right" d="M132,68 Q128,62 108,62 L108,105 Q120,108 132,95 Z" style={getMuscleStyle('chest-right', frontIds.has('chest-right'), findMuscleColor('chest-right'))} />

              {/* Biceps */}
              <ellipse id="bicep-left" cx="55" cy="115" rx="9" ry="22" style={getMuscleStyle('bicep-left', frontIds.has('bicep-left'), findMuscleColor('bicep-left'))} />
              <ellipse id="bicep-right" cx="145" cy="115" rx="9" ry="22" style={getMuscleStyle('bicep-right', frontIds.has('bicep-right'), findMuscleColor('bicep-right'))} />

              {/* Abs */}
              <rect id="abs-upper" x="88" y="105" width="24" height="28" rx="3" style={getMuscleStyle('abs-upper', frontIds.has('abs-upper'), findMuscleColor('abs-upper'))} />
              <rect id="abs-lower" x="88" y="136" width="24" height="28" rx="3" style={getMuscleStyle('abs-lower', frontIds.has('abs-lower'), findMuscleColor('abs-lower'))} />

              {/* Obliques */}
              <path id="oblique-left" d="M74,108 L88,108 L88,165 L78,160 Q72,140 74,108 Z" style={getMuscleStyle('oblique-left', frontIds.has('oblique-left'), findMuscleColor('oblique-left'))} />
              <path id="oblique-right" d="M126,108 L112,108 L112,165 L122,160 Q128,140 126,108 Z" style={getMuscleStyle('oblique-right', frontIds.has('oblique-right'), findMuscleColor('oblique-right'))} />

              {/* Forearms */}
              <ellipse id="forearm-left" cx="50" cy="160" rx="7" ry="25" style={getMuscleStyle('forearm-left', frontIds.has('forearm-left'), findMuscleColor('forearm-left'))} />
              <ellipse id="forearm-right" cx="150" cy="160" rx="7" ry="25" style={getMuscleStyle('forearm-right', frontIds.has('forearm-right'), findMuscleColor('forearm-right'))} />

              {/* Hands */}
              <ellipse cx="48" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="152" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />

              {/* Quads */}
              <path id="quad-left" d="M78,175 Q72,178 70,220 Q68,260 75,280 L95,280 Q98,260 96,220 Q95,185 92,175 Z" style={getMuscleStyle('quad-left', frontIds.has('quad-left'), findMuscleColor('quad-left'))} />
              <path id="quad-right" d="M122,175 Q128,178 130,220 Q132,260 125,280 L105,280 Q102,260 104,220 Q105,185 108,175 Z" style={getMuscleStyle('quad-right', frontIds.has('quad-right'), findMuscleColor('quad-right'))} />

              {/* Knees */}
              <ellipse cx="82" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="118" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />

              {/* Calves front */}
              <path id="calf-left" d="M72,298 Q68,320 70,350 Q72,365 78,370 L88,370 Q90,365 90,350 Q90,320 88,298 Z" style={getMuscleStyle('calf-left', frontIds.has('calf-left'), findMuscleColor('calf-left'))} />
              <path id="calf-right" d="M128,298 Q132,320 130,350 Q128,365 122,370 L112,370 Q110,365 110,350 Q110,320 112,298 Z" style={getMuscleStyle('calf-right', frontIds.has('calf-right'), findMuscleColor('calf-right'))} />

              {/* Feet */}
              <ellipse cx="80" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="120" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Back View */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-text-tertiary uppercase tracking-widest mb-4">Back</span>
            <svg viewBox="0 0 200 420" className="w-32 md:w-40 h-auto">
              {/* Head */}
              <ellipse cx="100" cy="25" rx="18" ry="22" fill="#111" stroke="#222" strokeWidth="0.5" />
              {/* Neck */}
              <rect x="92" y="45" width="16" height="12" fill="#111" stroke="#222" strokeWidth="0.5" />

              {/* Traps */}
              <path id="trap-left" d="M75,57 Q60,60 55,80 L75,75 Z" style={getMuscleStyle('trap-left', backIds.has('trap-left'), findMuscleColor('trap-left'))} />
              <path id="trap-right" d="M125,57 Q140,60 145,80 L125,75 Z" style={getMuscleStyle('trap-right', backIds.has('trap-right'), findMuscleColor('trap-right'))} />

              {/* Rear Delts */}
              <ellipse id="rear-delt-left" cx="58" cy="78" rx="10" ry="12" style={getMuscleStyle('rear-delt-left', backIds.has('rear-delt-left'), findMuscleColor('rear-delt-left'))} />
              <ellipse id="rear-delt-right" cx="142" cy="78" rx="10" ry="12" style={getMuscleStyle('rear-delt-right', backIds.has('rear-delt-right'), findMuscleColor('rear-delt-right'))} />

              {/* Side Delts Back */}
              <ellipse id="side-delt-back-left" cx="48" cy="78" rx="6" ry="10" style={getMuscleStyle('side-delt-back-left', backIds.has('side-delt-back-left'), findMuscleColor('side-delt-back-left'))} />
              <ellipse id="side-delt-back-right" cx="152" cy="78" rx="6" ry="10" style={getMuscleStyle('side-delt-back-right', backIds.has('side-delt-back-right'), findMuscleColor('side-delt-back-right'))} />

              {/* Upper Back / Rhomboids */}
              <path id="upper-back-left" d="M70,65 L92,65 L92,95 L70,90 Z" style={getMuscleStyle('upper-back-left', backIds.has('upper-back-left'), findMuscleColor('upper-back-left'))} />
              <path id="upper-back-right" d="M130,65 L108,65 L108,95 L130,90 Z" style={getMuscleStyle('upper-back-right', backIds.has('upper-back-right'), findMuscleColor('upper-back-right'))} />
              <path id="rhomboid-left" d="M82,68 L92,68 L92,100 L82,98 Z" style={getMuscleStyle('rhomboid-left', backIds.has('rhomboid-left'), findMuscleColor('rhomboid-left'))} />
              <path id="rhomboid-right" d="M118,68 L108,68 L108,100 L118,98 Z" style={getMuscleStyle('rhomboid-right', backIds.has('rhomboid-right'), findMuscleColor('rhomboid-right'))} />

              {/* Lats */}
              <path id="lat-left" d="M68,92 L92,100 L92,155 Q80,160 70,145 Q65,125 68,92 Z" style={getMuscleStyle('lat-left', backIds.has('lat-left'), findMuscleColor('lat-left'))} />
              <path id="lat-right" d="M132,92 L108,100 L108,155 Q120,160 130,145 Q135,125 132,92 Z" style={getMuscleStyle('lat-right', backIds.has('lat-right'), findMuscleColor('lat-right'))} />

              {/* Triceps */}
              <ellipse id="tricep-left" cx="52" cy="115" rx="8" ry="22" style={getMuscleStyle('tricep-left', backIds.has('tricep-left'), findMuscleColor('tricep-left'))} />
              <ellipse id="tricep-right" cx="148" cy="115" rx="8" ry="22" style={getMuscleStyle('tricep-right', backIds.has('tricep-right'), findMuscleColor('tricep-right'))} />

              {/* Lower Back */}
              <path id="lower-back-left" d="M85,140 L100,140 L100,175 L82,170 Z" style={getMuscleStyle('lower-back-left', backIds.has('lower-back-left'), findMuscleColor('lower-back-left'))} />
              <path id="lower-back-right" d="M115,140 L100,140 L100,175 L118,170 Z" style={getMuscleStyle('lower-back-right', backIds.has('lower-back-right'), findMuscleColor('lower-back-right'))} />

              {/* Forearms back */}
              <ellipse id="forearm-back-left" cx="48" cy="160" rx="6" ry="24" style={getMuscleStyle('forearm-back-left', backIds.has('forearm-back-left'), findMuscleColor('forearm-back-left'))} />
              <ellipse id="forearm-back-right" cx="152" cy="160" rx="6" ry="24" style={getMuscleStyle('forearm-back-right', backIds.has('forearm-back-right'), findMuscleColor('forearm-back-right'))} />

              {/* Hands */}
              <ellipse cx="46" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="154" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />

              {/* Glutes */}
              <ellipse id="glute-left" cx="84" cy="185" rx="16" ry="14" style={getMuscleStyle('glute-left', backIds.has('glute-left'), findMuscleColor('glute-left'))} />
              <ellipse id="glute-right" cx="116" cy="185" rx="16" ry="14" style={getMuscleStyle('glute-right', backIds.has('glute-right'), findMuscleColor('glute-right'))} />

              {/* Hamstrings */}
              <path id="hamstring-left" d="M72,202 Q68,230 70,260 Q72,275 80,280 L92,280 Q95,275 95,260 Q95,230 92,202 Z" style={getMuscleStyle('hamstring-left', backIds.has('hamstring-left'), findMuscleColor('hamstring-left'))} />
              <path id="hamstring-right" d="M128,202 Q132,230 130,260 Q128,275 120,280 L108,280 Q105,275 105,260 Q105,230 108,202 Z" style={getMuscleStyle('hamstring-right', backIds.has('hamstring-right'), findMuscleColor('hamstring-right'))} />

              {/* Knees */}
              <ellipse cx="82" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="118" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />

              {/* Calves back */}
              <path id="calf-back-left" d="M70,298 Q66,320 68,350 Q70,365 76,370 L86,370 Q88,365 88,350 Q88,320 86,298 Z" style={getMuscleStyle('calf-back-left', backIds.has('calf-back-left'), findMuscleColor('calf-back-left'))} />
              <path id="calf-back-right" d="M130,298 Q134,320 132,350 Q130,365 124,370 L114,370 Q112,365 112,350 Q112,320 114,298 Z" style={getMuscleStyle('calf-back-right', backIds.has('calf-back-right'), findMuscleColor('calf-back-right'))} />

              {/* Feet */}
              <ellipse cx="78" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="122" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* Active muscles legend */}
        {activeMuscles.size > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-xs text-text-tertiary uppercase tracking-widest mb-3">Active Muscles</div>
            <div className="flex flex-wrap gap-2">
              {Array.from(activeMuscles).map(muscle => {
                const mapping = MUSCLE_MAP[muscle]
                if (!mapping) return null
                return (
                  <span
                    key={muscle}
                    className="px-2 py-1 rounded text-xs font-medium border"
                    style={{
                      borderColor: mapping.color + '40',
                      color: mapping.color,
                      backgroundColor: mapping.color + '10',
                    }}
                  >
                    {mapping.label}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
