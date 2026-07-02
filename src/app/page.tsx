'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { WorkoutDay, Exercise, ExerciseCompletion, UserProfile } from '@/lib/supabase'
import { getActiveMusclesVolume } from '@/lib/muscles'
import Gatekeeper from '@/components/Gatekeeper'
import XPDisplay from '@/components/XPDisplay'
import DayCard from '@/components/DayCard'
import HypertrophyMap from '@/components/HypertrophyMap'
import Calendar from '@/components/Calendar'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const CAIRO_TZ = 'Africa/Cairo'
const DAY_COMPLETION_BONUS = 50

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [exercises, setExercises] = useState<Record<string, Exercise[]>>({})
  
  // Date State
  const [selectedDate, setSelectedDate] = useState<string>(
    format(toZonedTime(new Date(), CAIRO_TZ), 'yyyy-MM-dd')
  )
  
  // Progress State for Selected Date
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set())
  const [todayXP, setTodayXP] = useState(0)
  
  // Global Progress State
  const [globalCompletedDates, setGlobalCompletedDates] = useState<Set<string>>(new Set())
  
  const [animateXP, setAnimateXP] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'Wolver')
        .single()

      if (userData) setUser(userData)

      const { data: daysData } = await supabase.from('workout_days').select('*').order('day_number')
      if (daysData) setWorkoutDays(daysData)

      const { data: exercisesData } = await supabase.from('exercises').select('*').order('sort_order')
      if (exercisesData) {
        const grouped: Record<string, Exercise[]> = {}
        exercisesData.forEach((ex: Exercise) => {
          if (!grouped[ex.workout_day_id]) grouped[ex.workout_day_id] = []
          grouped[ex.workout_day_id].push(ex)
        })
        setExercises(grouped)
      }

      if (userData) {
        // Fetch specific date exercise completions
        const { data: completionsData } = await supabase
          .from('exercise_completions')
          .select('*')
          .eq('user_id', userData.id)
          .eq('completed_date', selectedDate)

        if (completionsData) {
          const completedIds = new Set(completionsData.map((c: ExerciseCompletion) => c.exercise_id))
          setCompletedExercises(completedIds)
          const xp = completionsData.reduce((sum: number, c: ExerciseCompletion) => sum + c.xp_earned, 0)
          setTodayXP(xp)
        } else {
          setCompletedExercises(new Set())
          setTodayXP(0)
        }

        // Fetch ALL day completions for calendar dots
        const { data: allDayCompletions } = await supabase
          .from('day_completions')
          .select('*')
          .eq('user_id', userData.id)

        if (allDayCompletions) {
          const allDates = new Set(allDayCompletions.map((dc: any) => dc.completed_date))
          setGlobalCompletedDates(allDates)
          
          // Filter for selected date
          const selectedDayCompletions = allDayCompletions.filter((dc: any) => dc.completed_date === selectedDate)
          const completedDayIds = new Set(selectedDayCompletions.map((dc: any) => dc.workout_day_id))
          setCompletedDays(completedDayIds)
          
          const dayBonusXP = selectedDayCompletions.reduce((sum: number, dc: { bonus_xp: number }) => sum + dc.bonus_xp, 0)
          setTodayXP(prev => prev + dayBonusXP)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

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
      newCompleted.add(exerciseId)
      setCompletedExercises(newCompleted)

      await supabase.from('exercise_completions').insert({
        user_id: user.id,
        exercise_id: exerciseId,
        completed_date: selectedDate,
        xp_earned: exercise.xp_value,
      })

      const newTotalXP = (user.total_xp || 0) + exercise.xp_value
      await supabase.from('users').update({ total_xp: newTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
      setUser({ ...user, total_xp: newTotalXP })
      setTodayXP(prev => prev + exercise.xp_value)
      setAnimateXP(true)
      setTimeout(() => setAnimateXP(false), 500)
    } else {
      newCompleted.delete(exerciseId)
      setCompletedExercises(newCompleted)

      await supabase
        .from('exercise_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId)
        .eq('completed_date', selectedDate)

      const newTotalXP = Math.max(0, (user.total_xp || 0) - exercise.xp_value)
      await supabase.from('users').update({ total_xp: newTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
      setUser({ ...user, total_xp: newTotalXP })
      setTodayXP(prev => Math.max(0, prev - exercise.xp_value))
    }
  }

  const handleCommitDay = async (dayId: string) => {
    if (!user || completedDays.has(dayId)) return

    await supabase.from('day_completions').insert({
      user_id: user.id,
      workout_day_id: dayId,
      completed_date: selectedDate,
      bonus_xp: DAY_COMPLETION_BONUS,
    })

    const newTotalXP = (user.total_xp || 0) + DAY_COMPLETION_BONUS
    await supabase.from('users').update({ total_xp: newTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
    setUser({ ...user, total_xp: newTotalXP })
    setTodayXP(prev => prev + DAY_COMPLETION_BONUS)
    
    setCompletedDays(prev => new Set([...prev, dayId]))
    setGlobalCompletedDates(prev => new Set([...prev, selectedDate]))
    
    setAnimateXP(true)
    setTimeout(() => setAnimateXP(false), 500)
  }

  const handleUncommitDay = async (dayId: string) => {
    if (!user || !completedDays.has(dayId)) return

    await supabase
      .from('day_completions')
      .delete()
      .eq('user_id', user.id)
      .eq('workout_day_id', dayId)
      .eq('completed_date', selectedDate)

    const newTotalXP = Math.max(0, (user.total_xp || 0) - DAY_COMPLETION_BONUS)
    await supabase.from('users').update({ total_xp: newTotalXP, updated_at: new Date().toISOString() }).eq('id', user.id)
    setUser({ ...user, total_xp: newTotalXP })
    setTodayXP(prev => Math.max(0, prev - DAY_COMPLETION_BONUS))

    setCompletedDays(prev => {
      const next = new Set(prev)
      next.delete(dayId)
      return next
    })

    // Check if any other day_completions exist for this date
    const { data: remaining } = await supabase
      .from('day_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('completed_date', selectedDate)

    if (!remaining || remaining.length === 0) {
      setGlobalCompletedDates(prev => {
        const next = new Set(prev)
        next.delete(selectedDate)
        return next
      })
    }
  }

  const activeMuscles = useMemo(() => {
    const completedMuscleGroups = Object.values(exercises)
      .flat()
      .filter(e => completedExercises.has(e.id))
      .map(e => e.muscle_groups)
    return getActiveMusclesVolume(completedMuscleGroups)
  }, [exercises, completedExercises])

  if (!isAuthenticated) {
    return <Gatekeeper onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        <header className="text-center py-10 md:py-16 border-b border-border">
          <span className="text-xs text-text-tertiary uppercase tracking-[0.2em] block mb-4">
            Hypertrophy Engine
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-tight">
            <span className="gold-gradient-text">Wolver</span> Workout Split
          </h1>
        </header>

        <XPDisplay
          totalXP={user?.total_xp || 0}
          todayXP={todayXP}
          animateXP={animateXP}
        />

        <Calendar 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
          completedDaysMap={globalCompletedDates} 
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold-start border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workoutDays.map(day => (
                  <DayCard
                    key={day.id}
                    day={day}
                    exercises={exercises[day.id] || []}
                    completedExercises={completedExercises}
                    isDayFinalized={completedDays.has(day.id)}
                    onToggleExercise={handleToggleExercise}
                    onCommitDay={handleCommitDay}
                    onUncommitDay={handleUncommitDay}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <HypertrophyMap activeMuscles={activeMuscles} />
              </div>
            </div>
          </div>
        )}

        {user && <AnalyticsDashboard userId={user.id} />}

        <footer className="text-center py-8 border-t border-border">
          <p className="text-xs text-text-tertiary uppercase tracking-widest">
            Wolver Training Protocol v2.0
          </p>
        </footer>
      </div>
    </div>
  )
}
