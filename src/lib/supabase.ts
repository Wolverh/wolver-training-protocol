import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface WorkoutDay {
  id: string
  day_number: number
  day_name: string
  focus_title: string
  card_type: string
  rest_badge: string | null
  is_rest_day: boolean
}

export interface Exercise {
  id: string
  workout_day_id: string
  name: string
  sets_reps: string
  xp_value: number
  muscle_groups: string[]
  sort_order: number
}

export interface ExerciseCompletion {
  id: string
  user_id: string
  exercise_id: string
  completed_date: string
  xp_earned: number
}

export interface UserProfile {
  id: string
  username: string
  total_xp: number
}
