'use client'

import { useState } from 'react'
import { Exercise } from '@/lib/supabase'

interface ExerciseItemProps {
  exercise: Exercise
  isCompleted: boolean
  onToggle: (exerciseId: string, completed: boolean) => void
}

export default function ExerciseItem({ exercise, isCompleted, onToggle }: ExerciseItemProps) {
  const [showXPPopup, setShowXPPopup] = useState(false)

  const handleChange = () => {
    const newState = !isCompleted
    onToggle(exercise.id, newState)

    if (newState) {
      setShowXPPopup(true)
      setTimeout(() => setShowXPPopup(false), 1000)
    }
  }

  return (
    <div
      className={`flex items-center gap-4 px-5 md:px-8 py-4 border-b border-border last:border-b-0 transition-all duration-300 relative ${
        isCompleted ? 'bg-surface/30' : 'hover:bg-surface/20'
      }`}
    >
      <input
        type="checkbox"
        className="exercise-checkbox"
        checked={isCompleted}
        onChange={handleChange}
        id={`exercise-${exercise.id}`}
      />
      <label
        htmlFor={`exercise-${exercise.id}`}
        className="flex-1 flex items-center justify-between gap-4 cursor-pointer"
      >
        <span
          className={`text-sm font-medium transition-all duration-300 ${
            isCompleted ? 'text-text-tertiary line-through' : 'text-text-primary'
          }`}
        >
          {exercise.name}
        </span>
        <span className="text-xs text-text-secondary whitespace-nowrap font-mono">
          {exercise.sets_reps}
        </span>
      </label>

      {/* XP Popup */}
      {showXPPopup && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 xp-popup">
          <span className="text-sm font-bold gold-gradient-text">+{exercise.xp_value} XP</span>
        </div>
      )}
    </div>
  )
}