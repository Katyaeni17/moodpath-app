import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Generate session ID for anonymous users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('mindwell-session-id')
  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`
    localStorage.setItem('mindwell-session-id', sessionId)
  }
  return sessionId
}

// Database types
export interface MoodEntry {
  id: string
  user_id?: string
  session_id?: string
  mood_value: number
  mood_label: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface WellnessAssessment {
  id: string
  user_id?: string
  session_id?: string
  stress_level: number
  sleep_quality: number
  social_connection: number
  academic_pressure: number
  total_score?: number
  recommendations?: string[]
  created_at: string
}

export interface UserProfile {
  id: string
  user_id?: string
  session_id?: string
  current_streak: number
  longest_streak: number
  total_check_ins: number
  preferred_name?: string
  is_anonymous: boolean
  created_at: string
  updated_at: string
}

export interface ResourceInteraction {
  id: string
  user_id?: string
  session_id?: string
  resource_type: string
  resource_id: string
  interaction_type: string
  created_at: string
}

export interface CrisisAlert {
  id: string
  user_id?: string
  session_id?: string
  alert_level: 'low' | 'medium' | 'high' | 'critical'
  trigger_data: any
  is_resolved: boolean
  created_at: string
  resolved_at?: string
}