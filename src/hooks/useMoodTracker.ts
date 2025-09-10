import { useState, useEffect } from 'react'
import { supabase, getSessionId, type MoodEntry, type UserProfile } from '@/lib/supabase'
import { useSupabase } from './useSupabase'
import { toast } from '@/hooks/use-toast'

export const useMoodTracker = () => {
  const { user, sessionId } = useSupabase()
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalCheckIns, setTotalCheckIns] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load user profile data
  useEffect(() => {
    loadUserProfile()
  }, [user, sessionId])

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error)
        return
      }

      if (data) {
        setCurrentStreak(data.current_streak || 0)
        setTotalCheckIns(data.total_check_ins || 0)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const submitMoodEntry = async (moodValue: number, moodLabel: string, notes?: string) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      // Insert mood entry
      const moodData = {
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        mood_value: moodValue,
        mood_label: moodLabel,
        notes: notes || null
      }

      const { error: moodError } = await supabase
        .from('mood_entries')
        .insert(moodData)

      if (moodError) throw moodError

      // Update streak using the database function
      const { data: streakData, error: streakError } = await supabase
        .rpc('update_user_streak', {
          p_user_id: user?.id || null,
          p_session_id: user ? null : sessionId
        })

      if (streakError) {
        console.error('Error updating streak:', streakError)
      } else if (streakData) {
        setCurrentStreak(streakData)
      }

      // Check for crisis indicators
      await checkCrisisDetection(moodValue, notes)

      // Reload profile to get updated stats
      await loadUserProfile()

      toast({
        title: "Mood recorded!",
        description: `Feeling ${moodLabel.toLowerCase()}. Current streak: ${streakData || currentStreak} days`,
      })

      return { success: true }
    } catch (error) {
      console.error('Error submitting mood entry:', error)
      toast({
        title: "Error",
        description: "Failed to record mood. Please try again.",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkCrisisDetection = async (moodValue: number, notes?: string) => {
    try {
      const response = await supabase.functions.invoke('crisis-detection', {
        body: {
          userId: user?.id || null,
          sessionId: user ? null : sessionId,
          moodValue,
          notes
        }
      })

      if (response.data?.requiresIntervention) {
        toast({
          title: "Support Available",
          description: "We notice you might be going through a tough time. Support resources are available.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Crisis detection error:', error)
    }
  }

  const getMoodHistory = async (limit = 30) => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching mood history:', error)
      return []
    }
  }

  return {
    currentStreak,
    totalCheckIns,
    isSubmitting,
    submitMoodEntry,
    getMoodHistory,
    loadUserProfile
  }
}