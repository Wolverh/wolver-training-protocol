'use client'

import { useMemo } from 'react'
import { getActiveSvgVolume, MUSCLE_MAP } from '@/lib/muscles'

interface HypertrophyMapProps {
  activeMuscles: Map<string, number>
}

export default function HypertrophyMap({ activeMuscles }: HypertrophyMapProps) {
  const { frontVolume, backVolume } = useMemo(() => getActiveSvgVolume(activeMuscles), [activeMuscles])

  const activeCount = activeMuscles.size
  const totalMuscles = Object.keys(MUSCLE_MAP).length
  const coveragePercent = Math.round((activeCount / totalMuscles) * 100)

  const findMuscleColor = (id: string): string => {
    for (const [, mapping] of Object.entries(MUSCLE_MAP)) {
      if (mapping.frontIds.includes(id) || mapping.backIds.includes(id)) {
        return mapping.color
      }
    }
    return '#555'
  }

  const getMuscleStyle = (id: string, volume: number) => {
    const isActive = volume > 0
    const color = findMuscleColor(id)
    
    // Mathematical scaling: base opacity 0.3, max 1.0. Increases by 0.15 per exercise hit.
    const opacity = isActive ? Math.min(0.6 + (volume * 0.15), 1.0) : 0.4
    // Glow radius scales with volume
    const glowRadius = isActive ? Math.min(4 + (volume * 2), 12) : 0
    
    return {
      fill: isActive ? color : '#1a1a1a',
      opacity: opacity,
      filter: isActive ? `drop-shadow(0 0 ${glowRadius}px ${color}80)` : 'none',
      transition: 'all 0.5s ease',
      stroke: isActive ? color : '#222',
      strokeWidth: 0.5,
    }
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
              <ellipse cx="100" cy="25" rx="18" ry="22" fill="#111" stroke="#222" strokeWidth="0.5" />
              <rect x="92" y="45" width="16" height="12" fill="#111" stroke="#222" strokeWidth="0.5" />
              <path id="trap-left-front" d="M80,57 Q70,55 65,70 L80,65 Z" style={getMuscleStyle('trap-left-front', frontVolume.get('') || 0)} />
              <path id="trap-right-front" d="M120,57 Q130,55 135,70 L120,65 Z" style={getMuscleStyle('trap-right-front', frontVolume.get('') || 0)} />
              <ellipse id="front-delt-left" cx="62" cy="78" rx="10" ry="14" style={getMuscleStyle('front-delt-left', frontVolume.get('') || 0)} />
              <ellipse id="front-delt-right" cx="138" cy="78" rx="10" ry="14" style={getMuscleStyle('front-delt-right', frontVolume.get('') || 0)} />
              <ellipse id="side-delt-left" cx="52" cy="78" rx="6" ry="12" style={getMuscleStyle('side-delt-left', frontVolume.get('') || 0)} />
              <ellipse id="side-delt-right" cx="148" cy="78" rx="6" ry="12" style={getMuscleStyle('side-delt-right', frontVolume.get('') || 0)} />
              <path id="chest-left" d="M68,68 Q72,62 92,62 L92,105 Q80,108 68,95 Z" style={getMuscleStyle('chest-left', frontVolume.get('') || 0)} />
              <path id="chest-right" d="M132,68 Q128,62 108,62 L108,105 Q120,108 132,95 Z" style={getMuscleStyle('chest-right', frontVolume.get('') || 0)} />
              <ellipse id="bicep-left" cx="55" cy="115" rx="9" ry="22" style={getMuscleStyle('bicep-left', frontVolume.get('') || 0)} />
              <ellipse id="bicep-right" cx="145" cy="115" rx="9" ry="22" style={getMuscleStyle('bicep-right', frontVolume.get('') || 0)} />
              <rect id="abs-upper" x="88" y="105" width="24" height="28" rx="3" style={getMuscleStyle('abs-upper', frontVolume.get('') || 0)} />
              <rect id="abs-lower" x="88" y="136" width="24" height="28" rx="3" style={getMuscleStyle('abs-lower', frontVolume.get('') || 0)} />
              <path id="oblique-left" d="M74,108 L88,108 L88,165 L78,160 Q72,140 74,108 Z" style={getMuscleStyle('oblique-left', frontVolume.get('') || 0)} />
              <path id="oblique-right" d="M126,108 L112,108 L112,165 L122,160 Q128,140 126,108 Z" style={getMuscleStyle('oblique-right', frontVolume.get('') || 0)} />
              <ellipse id="forearm-left" cx="50" cy="160" rx="7" ry="25" style={getMuscleStyle('forearm-left', frontVolume.get('') || 0)} />
              <ellipse id="forearm-right" cx="150" cy="160" rx="7" ry="25" style={getMuscleStyle('forearm-right', frontVolume.get('') || 0)} />
              <ellipse cx="48" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="152" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />
              <path id="quad-left" d="M78,175 Q72,178 70,220 Q68,260 75,280 L95,280 Q98,260 96,220 Q95,185 92,175 Z" style={getMuscleStyle('quad-left', frontVolume.get('') || 0)} />
              <path id="quad-right" d="M122,175 Q128,178 130,220 Q132,260 125,280 L105,280 Q102,260 104,220 Q105,185 108,175 Z" style={getMuscleStyle('quad-right', frontVolume.get('') || 0)} />
              <ellipse cx="82" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="118" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <path id="calf-left" d="M72,298 Q68,320 70,350 Q72,365 78,370 L88,370 Q90,365 90,350 Q90,320 88,298 Z" style={getMuscleStyle('calf-left', frontVolume.get('') || 0)} />
              <path id="calf-right" d="M128,298 Q132,320 130,350 Q128,365 122,370 L112,370 Q110,365 110,350 Q110,320 112,298 Z" style={getMuscleStyle('calf-right', frontVolume.get('') || 0)} />
              <ellipse cx="80" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="120" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Back View */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-text-tertiary uppercase tracking-widest mb-4">Back</span>
            <svg viewBox="0 0 200 420" className="w-32 md:w-40 h-auto">
              <ellipse cx="100" cy="25" rx="18" ry="22" fill="#111" stroke="#222" strokeWidth="0.5" />
              <rect x="92" y="45" width="16" height="12" fill="#111" stroke="#222" strokeWidth="0.5" />
              <path id="trap-left" d="M75,57 Q60,60 55,80 L75,75 Z" style={getMuscleStyle('trap-left', backVolume.get('') || 0)} />
              <path id="trap-right" d="M125,57 Q140,60 145,80 L125,75 Z" style={getMuscleStyle('trap-right', backVolume.get('') || 0)} />
              <ellipse id="rear-delt-left" cx="58" cy="78" rx="10" ry="12" style={getMuscleStyle('rear-delt-left', backVolume.get('') || 0)} />
              <ellipse id="rear-delt-right" cx="142" cy="78" rx="10" ry="12" style={getMuscleStyle('rear-delt-right', backVolume.get('') || 0)} />
              <ellipse id="side-delt-back-left" cx="48" cy="78" rx="6" ry="10" style={getMuscleStyle('side-delt-back-left', backVolume.get('') || 0)} />
              <ellipse id="side-delt-back-right" cx="152" cy="78" rx="6" ry="10" style={getMuscleStyle('side-delt-back-right', backVolume.get('') || 0)} />
              <path id="upper-back-left" d="M70,65 L92,65 L92,95 L70,90 Z" style={getMuscleStyle('upper-back-left', backVolume.get('') || 0)} />
              <path id="upper-back-right" d="M130,65 L108,65 L108,95 L130,90 Z" style={getMuscleStyle('upper-back-right', backVolume.get('') || 0)} />
              <path id="rhomboid-left" d="M82,68 L92,68 L92,100 L82,98 Z" style={getMuscleStyle('rhomboid-left', backVolume.get('') || 0)} />
              <path id="rhomboid-right" d="M118,68 L108,68 L108,100 L118,98 Z" style={getMuscleStyle('rhomboid-right', backVolume.get('') || 0)} />
              <path id="lat-left" d="M68,92 L92,100 L92,155 Q80,160 70,145 Q65,125 68,92 Z" style={getMuscleStyle('lat-left', backVolume.get('') || 0)} />
              <path id="lat-right" d="M132,92 L108,100 L108,155 Q120,160 130,145 Q135,125 132,92 Z" style={getMuscleStyle('lat-right', backVolume.get('') || 0)} />
              <ellipse id="tricep-left" cx="52" cy="115" rx="8" ry="22" style={getMuscleStyle('tricep-left', backVolume.get('') || 0)} />
              <ellipse id="tricep-right" cx="148" cy="115" rx="8" ry="22" style={getMuscleStyle('tricep-right', backVolume.get('') || 0)} />
              <path id="lower-back-left" d="M85,140 L100,140 L100,175 L82,170 Z" style={getMuscleStyle('lower-back-left', backVolume.get('') || 0)} />
              <path id="lower-back-right" d="M115,140 L100,140 L100,175 L118,170 Z" style={getMuscleStyle('lower-back-right', backVolume.get('') || 0)} />
              <ellipse id="forearm-back-left" cx="48" cy="160" rx="6" ry="24" style={getMuscleStyle('forearm-back-left', backVolume.get('') || 0)} />
              <ellipse id="forearm-back-right" cx="152" cy="160" rx="6" ry="24" style={getMuscleStyle('forearm-back-right', backVolume.get('') || 0)} />
              <ellipse cx="46" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="154" cy="195" rx="5" ry="8" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse id="glute-left" cx="84" cy="185" rx="16" ry="14" style={getMuscleStyle('glute-left', backVolume.get('') || 0)} />
              <ellipse id="glute-right" cx="116" cy="185" rx="16" ry="14" style={getMuscleStyle('glute-right', backVolume.get('') || 0)} />
              <path id="hamstring-left" d="M72,202 Q68,230 70,260 Q72,275 80,280 L92,280 Q95,275 95,260 Q95,230 92,202 Z" style={getMuscleStyle('hamstring-left', backVolume.get('') || 0)} />
              <path id="hamstring-right" d="M128,202 Q132,230 130,260 Q128,275 120,280 L108,280 Q105,275 105,260 Q105,230 108,202 Z" style={getMuscleStyle('hamstring-right', backVolume.get('') || 0)} />
              <ellipse cx="82" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="118" cy="290" rx="10" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <path id="calf-back-left" d="M70,298 Q66,320 68,350 Q70,365 76,370 L86,370 Q88,365 88,350 Q88,320 86,298 Z" style={getMuscleStyle('calf-back-left', backVolume.get('') || 0)} />
              <path id="calf-back-right" d="M130,298 Q134,320 132,350 Q130,365 124,370 L114,370 Q112,365 112,350 Q112,320 114,298 Z" style={getMuscleStyle('calf-back-right', backVolume.get('') || 0)} />
              <ellipse cx="78" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
              <ellipse cx="122" cy="385" rx="12" ry="6" fill="#111" stroke="#222" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

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
