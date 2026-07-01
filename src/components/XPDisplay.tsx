'use client'

import { useState, useEffect } from 'react'
import { formatXP, getXPLevel } from '@/lib/xp'
import { Trophy, Zap, TrendingUp } from 'lucide-react'

interface XPDisplayProps {
  totalXP: number
  todayXP: number
  animateXP?: boolean
}

export default function XPDisplay({ totalXP, todayXP, animateXP }: XPDisplayProps) {
  const [displayXP, setDisplayXP] = useState(totalXP)
  const level = getXPLevel(totalXP)

  useEffect(() => {
    if (animateXP) {
      const timer = setTimeout(() => setDisplayXP(totalXP), 50)
      return () => clearTimeout(timer)
    } else {
      setDisplayXP(totalXP)
    }
  }, [totalXP, animateXP])

  return (
    <div className="w-full border border-border rounded-md bg-surface/50 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md border border-border bg-bg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-gold-start" />
            </div>
            <div>
              <div className="text-xs text-text-tertiary uppercase tracking-widest mb-1">Total XP</div>
              <div className={`font-display text-3xl font-bold gold-gradient-text ${animateXP ? 'animate-xp-pop' : ''}`}>
                {formatXP(displayXP)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold-mid" />
              <div>
                <div className="text-xs text-text-tertiary uppercase tracking-widest">Today</div>
                <div className="text-lg font-bold text-text-primary">+{todayXP}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-card-upper" />
              <div>
                <div className="text-xs text-text-tertiary uppercase tracking-widest">Rank</div>
                <div className="text-lg font-bold text-text-primary">{level.title}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-tertiary font-mono">LEVEL {level.level}</span>
            <span className="text-xs text-text-tertiary font-mono">{formatXP(totalXP)} / {formatXP(level.nextLevelXP)} XP</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="level-progress-bar h-full rounded-full"
              style={{ width: `${level.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
