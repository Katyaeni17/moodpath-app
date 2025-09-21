import { useState } from 'react'
import { supabase, type WellnessAssessment } from '@/lib/supabase'
import { useSupabase } from './useSupabase'
import { toast } from '@/hooks/use-toast'

export const useWellnessAssessment = () => {
  const { user, sessionId } = useSupabase()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitAssessment = async (assessmentData: {
    stress_level: number
    sleep_quality: number
    social_connection: number
    academic_pressure: number
  }) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      // Calculate total score and generate recommendations
      const totalScore = assessmentData.stress_level + 
                        (6 - assessmentData.sleep_quality) + // Invert sleep quality (higher is better)
                        (6 - assessmentData.social_connection) + // Invert social connection
                        assessmentData.academic_pressure

      const recommendations = generateRecommendations(assessmentData, totalScore)

      const wellnessData = {
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        ...assessmentData,
        total_score: totalScore,
        recommendations
      }

      const { error } = await supabase
        .from('wellness_assessments')
        .insert(wellnessData)

      if (error) throw error

      // Check for crisis indicators
      await checkCrisisDetection(assessmentData)

      toast({
        title: "Assessment completed!",
        description: `Wellness score: ${Math.max(0, 40 - totalScore)}/40. Check your recommendations below.`,
      })

      return { 
        success: true, 
        totalScore: Math.max(0, 40 - totalScore), 
        recommendations 
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkCrisisDetection = async (assessmentData: any) => {
    try {
      const response = await supabase.functions.invoke('crisis-detection', {
        body: {
          user_id: user?.id || null,
          session_id: user ? null : sessionId,
          assessment_data: assessmentData
        }
      })

      if (response.data?.requiresIntervention) {
        toast({
          title: "Support Recommended",
          description: "Based on your responses, we recommend connecting with support services.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Crisis detection error:', error)
    }
  }

  const getAssessmentHistory = async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('wellness_assessments')
        .select('*')
        .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching assessment history:', error)
      return []
    }
  }

  const generateRecommendations = (data: any, totalScore: number): string[] => {
    const recommendations: string[] = []

    if (data.stress_level >= 8) {
      recommendations.push("Practice deep breathing exercises and meditation")
      recommendations.push("Consider talking to a counselor about stress management")
    }

    if (data.sleep_quality <= 2) {
      recommendations.push("Establish a regular bedtime routine")
      recommendations.push("Limit screen time before bed")
      recommendations.push("Create a comfortable sleep environment")
    }

    if (data.social_connection <= 2) {
      recommendations.push("Reach out to friends or family members")
      recommendations.push("Join a student club or group activity")
      recommendations.push("Consider peer support groups")
    }

    if (data.academic_pressure >= 8) {
      recommendations.push("Break large tasks into smaller, manageable steps")
      recommendations.push("Use time management techniques like the Pomodoro method")
      recommendations.push("Seek academic support resources on campus")
    }

    if (totalScore >= 25) {
      recommendations.unshift("Consider scheduling an appointment with campus counseling services")
    }

    if (recommendations.length === 0) {
      recommendations.push("Keep up the great work with your wellness practices!")
      recommendations.push("Continue maintaining healthy habits")
    }

    return recommendations
  }

  return {
    isSubmitting,
    submitAssessment,
    getAssessmentHistory
  }
}