'use client'

import { useState } from 'react'
import { WorkoutDay, Exercise } from '@/lib/supabase'
import ExerciseItem from './ExerciseItem'
import { ChevronDown, CheckCircle2 } from 'lucide-react'

interface DayCardProps {
  day: WorkoutDay
  exercises: Exercise[]
  completedExercises: Set<string>
  onToggleExercise: (exerciseId: string, completed: boolean) => void
}

export default function DayCard({ day, exercises, completedExercises, onToggleExercise }: DayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedCount = exercises.filter(e => completedExercises.has(e.id)).length
  const totalCount = exercises.length
  const isFullyComplete = totalCount > 0 && completedCount === totalCount
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const cardClass = `card-${day.card_type}`

  if (day.is_rest_day) {
    return (
      <article className={`${cardClass} border border-border rounded-md bg-surface opacity-50`}>
        <div className="p-6 md:p-8">
          <span className="text-xs text-text-tertiary uppercase tracking-widest">
            Day {day.day_number} / {day.day_name}
          </span>
          <h2 className="font-display text-xl font-bold text-text-secondary mt-2">{day.focus_title}</h2>
          {day.rest_badge && (
            <span className="inline-block mt-4 px-3 py-1 border border-border rounded-full text-xs text-text-secondary uppercase tracking-wider bg-bg">
              {day.rest_badge}
            </span>
          )}
        </div>
      </article>
    )
  }

  return (
    <article
      className={`${cardClass} border border-border rounded-md bg-surface transition-all duration-400 cursor-pointer ${
        isExpanded
          ? 'border-border-hover shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_25px_var(--card-glow)]'
          : 'hover:border-border-hover hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_25px_var(--card-glow)] hover:-translate-y-0.5'
      } ${
        isExpanded ? '[border-top-color:var(--card-accent)]' : ''
      }`}
      style={isExpanded ? { borderTopColor: 'var(--card-accent)', borderTopWidth: '2px' } : {}}
    >
      {/* Accent line */}
      <div
        className={`h-px bg-gradient-to-r from-transparent via-[var(--card-accent)] to-transparent transition-opacity duration-400 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ opacity: isExpanded ? 0.5 : undefined }}
      />

      <div
        className="p-6 md:p-8 flex items-start justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-text-tertiary uppercase tracking-widest">
              Day {day.day_number} / {day.day_name}
            </span>
            {isFullyComplete && (
              <CheckCircle2 className="w-4 h-4 text-gold-start" />
            )}
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary">{day.focus_title}</h2>

          <div className="flex items-center gap-4 mt-4">
            {day.rest_badge && (
              <span className="inline-block px-3 py-1 border border-border rounded-full text-xs text-text-secondary uppercase tracking-wider bg-bg">
                {day.rest_badge}
              </span>
            )}
            {totalCount > 0 && (
              <span className="text-xs text-text-tertiary font-mono">
                {completedCount}/{totalCount}
              </span>
            )}
          </div>

          {/* Mini progress bar */}
          {totalCount > 0 && (
            <div className="mt-3 h-0.5 w-full max-w-[200px] bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: isFullyComplete
                    ? 'linear-gradient(90deg, var(--accent-gold-start), var(--accent-gold-mid), var(--accent-gold-end))'
                    : 'var(--card-accent, #555)',
                }}
              />
            </div>
          )}
        </div>

        <ChevronDown
          className={`w-5 h-5 text-text-tertiary transition-transform duration-300 flex-shrink-0 mt-1 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Exercise list */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="border-t border-border bg-[#050505]">
          {exercises.map(exercise => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              isCompleted={completedExercises.has(exercise.id)}
              onToggle={onToggleExercise}
            />
          ))}

          {/* Day completion bonus indicator */}
          {isFullyComplete && (
            <div className="px-5 md:px-8 py-4 border-t border-border bg-surface/20">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-start" />
                <span className="text-sm font-bold gold-gradient-text">Day Complete! +50 XP Bonus</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}