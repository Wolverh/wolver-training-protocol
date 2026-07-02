'use client'

import { useState } from 'react'
import { WorkoutDay, Exercise } from '@/lib/supabase'
import ExerciseItem from './ExerciseItem'
import { ChevronDown, CheckCircle2, Undo2 } from 'lucide-react'

interface DayCardProps {
  day: WorkoutDay
  exercises: Exercise[]
  completedExercises: Set<string>
  isDayFinalized: boolean
  onToggleExercise: (exerciseId: string, completed: boolean) => void
  onCommitDay: (dayId: string) => void
  onUncommitDay: (dayId: string) => void
}

export default function DayCard({ day, exercises, completedExercises, isDayFinalized, onToggleExercise, onCommitDay, onUncommitDay }: DayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedCount = exercises.filter(e => completedExercises.has(e.id)).length
  const totalCount = exercises.length
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
            {isDayFinalized && (
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
                  background: isDayFinalized
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
          isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'
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

          {/* Day completion commit indicator & button */}
          <div className="px-5 md:px-8 py-6 border-t border-border bg-surface/20 flex flex-col items-center justify-center gap-4">
            {isDayFinalized ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-start" />
                  <span className="text-base font-bold gold-gradient-text">Day Completed & Logged</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onUncommitDay(day.id)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Undo Day Completion
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCommitDay(day.id)
                }}
                className="w-full max-w-[300px] py-3 px-6 rounded-md bg-gold-start/10 border border-gold-start/30 text-gold-mid font-display font-bold uppercase tracking-wider hover:bg-gold-start/20 hover:border-gold-start/50 transition-all duration-300 shadow-[0_0_15px_rgba(191,149,63,0.1)] hover:shadow-[0_0_20px_rgba(191,149,63,0.3)]"
              >
                We&apos;re done / I checked the day
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}