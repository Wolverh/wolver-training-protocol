'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, WorkoutDay, Exercise, ExerciseCompletion, UserProfile } from '@/lib/supabase'
import { calculateDayBonus } from '@/lib/xp'
import { getActiveMuscles } from '@/lib/muscles'
import Gatekeeper from '@/components/Gatekeeper'
import XPDisplay from '@/components/XPDisplay'
import DayCard from '@/components/DayCard'
import HypertrophyMap from '@/components/HypertrophyMap'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [exercises, setExercises] = useState<Record<string, Exercise[]>>({})
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [todayXP, setTodayXP] = useState(0)
  const [animateXP, setAnimateXP] = useState(false)
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set())

  const today = new Date().toISOString().split('T')[0]

  const loadData = useCallback(async () => {
    try {
      // Load user
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'Wolver')
        .single()

      if (userData) setUser(userData)

      // Load workout days
      const { data: daysData } = await supabase
        .from('workout_days')
        .select('*')
        .order('day_number')

      if (daysData) setWorkoutDays(daysData)

      // Load all exercises grouped by day
      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*')
        .order('sort_order')

      if (exercisesData) {
        const grouped: Record<string, Exercise[]> = {}
        exercisesData.forEach(ex => {
          if (!grouped[ex.workout_day_id]) grouped[ex.workout_day_id] = []
          grouped[ex.workout_day_id].push(ex)
        })
        setExercises(grouped)
      }

      // Load today's completions
      if (userData) {
        const { data: completionsData } = await supabase
          .from('exercise_completions')
          .select('*')
          .eq('user_id', userData.id)
          .eq('completed_date', today)

        if (completionsData) {
          const completedIds = new Set(completionsData.map((c: ExerciseCompletion) => c.exercise_id))
          setCompletedExercises(completedIds)
          const xp = completionsData.reduce((sum: number, c: ExerciseCompletion) => sum + c.xp_earned, 0)
          setTodayXP(xp)
        }

        // Load today's day completions
        const { data: dayCompletionsData } = await supabase
          .from('day_completions')
          .select('*')
          .eq('user_id', userData.id)
          .eq('completed_date', today)

        if (dayCompletionsData) {
          const completedDayIds = new Set(dayCompletionsData.map((dc: { workout_day_id: string }) => dc.workout_day_id))
          setCompletedDays(completedDayIds)
          const dayBonusXP = dayCompletionsData.reduce((sum: number, dc: { bonus_xp: number }) => sum + dc.bonus_xp, 0)
          setTodayXP(prev => prev + dayBonusXP)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, loadData])

  const handleToggleExercise = async (exerciseId: string, completed: boolean) => {
    if (!user) return

    const exercise = Object.values(exercises)
      .flat()
      .find(e => e.id === exerciseId)
    if (!exercise) return

    const newCompleted = new Set(completedExercises)

    if (completed) {
      // Add completion
      newCompleted.add(exerciseId)
      setCompletedExercises(newCompleted)

      await supabase.from('exercise_completions').insert({
        user_id: user.id,
        exercise_id: exerciseId,
        completed_date: today,
        xp_earned: exercise.xp_value,
      })

      // Update user XP
      const newTotalXP = (user.total_xp || 0) + exercise.xp_value
      await supabase.from('users').update({ total_xp: newTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
      setUser({ ...user, total_xp: newTotalXP })
      setTodayXP(prev => prev + exercise.xp_value)
      setAnimateXP(true)
      setTimeout(() => setAnimateXP(false), 500)

      // Check if day is complete
      const dayExercises = exercises[exercise.workout_day_id] || []
      const allComplete = dayExercises.every(e => newCompleted.has(e.id))

      if (allComplete && !completedDays.has(exercise.workout_day_id)) {
        const bonus = calculateDayBonus(dayExercises.length)

        await supabase.from('day_completions').insert({
          user_id: user.id,
          workout_day_id: exercise.workout_day_id,
          completed_date: today,
          bonus_xp: bonus,
        })

        const bonusTotalXP = newTotalXP + bonus
        await supabase.from('users').update({ total_xp: bonusTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
        setUser({ ...user, total_xp: bonusTotalXP })
        setTodayXP(prev => prev + bonus)
        setCompletedDays(prev => new Set([...prev, exercise.workout_day_id]))
      }
    } else {
      // Remove completion
      newCompleted.delete(exerciseId)
      setCompletedExercises(newCompleted)

      await supabase
        .from('exercise_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId)
        .eq('completed_date', today)

      // Update user XP
      const newTotalXP = Math.max(0, (user.total_xp || 0) - exercise.xp_value)
      await supabase.from('users').update({ total_xp: newTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
      setUser({ ...user, total_xp: newTotalXP })
      setTodayXP(prev => Math.max(0, prev - exercise.xp_value))

      // Check if day was previously complete and remove bonus
      if (completedDays.has(exercise.workout_day_id)) {
        const dayExercises = exercises[exercise.workout_day_id] || []
        const bonus = calculateDayBonus(dayExercises.length)

        await supabase
          .from('day_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('workout_day_id', exercise.workout_day_id)
          .eq('completed_date', today)

        const bonusTotalXP = Math.max(0, newTotalXP - bonus)
        await supabase.from('users').update({ total_xp: bonusTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
        setUser({ ...user, total_xp: bonusTotalXP })
        setTodayXP(prev => Math.max(0, prev - bonus))
        setCompletedDays(prev => {
          const next = new Set(prev)
          next.delete(exercise.workout_day_id)
          return next
        })
      }
    }
  }

  // Calculate active muscles from completed exercises
  const activeMuscles = useMemo(() => {
    const completedMuscleGroups = Object.values(exercises)
      .flat()
      .filter(e => completedExercises.has(e.id))
      .map(e => e.muscle_groups)
    return getActiveMuscles(completedMuscleGroups)
  }, [exercises, completedExercises])

  if (!isAuthenticated) {
    return <Gatekeeper onAuthenticated={() => setIsAuthenticated(true)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-start border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-tertiary uppercase tracking-widest">Initializing Protocol</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        {/* Header */}
        <header className="text-center py-10 md:py-16 border-b border-border">
          <span className="text-xs text-text-tertiary uppercase tracking-[0.2em] block mb-4">
            Hypertrophy Engine
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-tight">
            <span className="gold-gradient-text">Wolver</span> Workout Split
          </h1>
        </header>

        {/* XP Display */}
        <XPDisplay
          totalXP={user?.total_xp || 0}
          todayXP={todayXP}
          animateXP={animateXP}
        />

        {/* Main Content: Workout Cards + Hypertrophy Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workoutDays.map(day => (
                <DayCard
                  key={day.id}
                  day={day}
                  exercises={exercises[day.id] || []}
                  completedExercises={completedExercises}
                  onToggleExercise={handleToggleExercise}
                />
              ))}
            </div>
          </div>

          {/* Hypertrophy Map */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <HypertrophyMap activeMuscles={activeMuscles} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-xs text-text-tertiary uppercase tracking-widest">
            Wolver Training Protocol v1.0
          </p>
        </footer>
      </div>
    </div>
  )
}
