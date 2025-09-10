import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { timeframe = '7d', userId = null, sessionId = null } = await req.json()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '3m':
        startDate.setMonth(endDate.getMonth() - 3)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }

    // Build filter conditions
    let moodQuery = supabase
      .from('mood_entries')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    let assessmentQuery = supabase
      .from('wellness_assessments')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (userId) {
      moodQuery = moodQuery.eq('user_id', userId)
      assessmentQuery = assessmentQuery.eq('user_id', userId)
    } else if (sessionId) {
      moodQuery = moodQuery.eq('session_id', sessionId)
      assessmentQuery = assessmentQuery.eq('session_id', sessionId)
    }

    const [moodResult, assessmentResult] = await Promise.all([
      moodQuery,
      assessmentQuery
    ])

    if (moodResult.error) throw moodResult.error
    if (assessmentResult.error) throw assessmentResult.error

    const moodEntries = moodResult.data || []
    const assessments = assessmentResult.data || []

    // Calculate analytics
    const analytics = {
      mood: {
        average: moodEntries.length ? 
          Math.round((moodEntries.reduce((sum, entry) => sum + entry.mood_value, 0) / moodEntries.length) * 10) / 10 : 0,
        trend: calculateTrend(moodEntries.map(e => ({ date: e.created_at, value: e.mood_value }))),
        distribution: calculateDistribution(moodEntries, 'mood_value'),
        totalEntries: moodEntries.length
      },
      wellness: {
        averageStress: assessments.length ?
          Math.round((assessments.reduce((sum, a) => sum + a.stress_level, 0) / assessments.length) * 10) / 10 : 0,
        averageSleep: assessments.length ?
          Math.round((assessments.reduce((sum, a) => sum + a.sleep_quality, 0) / assessments.length) * 10) / 10 : 0,
        averageSocial: assessments.length ?
          Math.round((assessments.reduce((sum, a) => sum + a.social_connection, 0) / assessments.length) * 10) / 10 : 0,
        totalAssessments: assessments.length
      },
      insights: generateInsights(moodEntries, assessments),
      checkInFrequency: calculateCheckInFrequency(moodEntries, startDate, endDate)
    }

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in wellness-analytics:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function calculateTrend(data: { date: string, value: number }[]): 'improving' | 'declining' | 'stable' {
  if (data.length < 2) return 'stable'
  
  const recent = data.slice(-3)
  const earlier = data.slice(0, -3)
  
  if (recent.length === 0 || earlier.length === 0) return 'stable'
  
  const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length
  const earlierAvg = earlier.reduce((sum, d) => sum + d.value, 0) / earlier.length
  
  const difference = recentAvg - earlierAvg
  
  if (difference > 0.3) return 'improving'
  if (difference < -0.3) return 'declining'
  return 'stable'
}

function calculateDistribution(data: any[], field: string): Record<string, number> {
  const distribution: Record<string, number> = {}
  
  data.forEach(item => {
    const value = item[field].toString()
    distribution[value] = (distribution[value] || 0) + 1
  })
  
  return distribution
}

function generateInsights(moodEntries: any[], assessments: any[]): string[] {
  const insights: string[] = []
  
  if (moodEntries.length > 0) {
    const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood_value, 0) / moodEntries.length
    
    if (avgMood >= 4) {
      insights.push("Great job maintaining positive mood levels!")
    } else if (avgMood <= 2) {
      insights.push("Consider reaching out to support resources during challenging times.")
    }
  }
  
  if (assessments.length > 0) {
    const avgStress = assessments.reduce((sum, a) => sum + a.stress_level, 0) / assessments.length
    const avgSleep = assessments.reduce((sum, a) => sum + a.sleep_quality, 0) / assessments.length
    
    if (avgStress > 7) {
      insights.push("High stress levels detected. Try incorporating relaxation techniques.")
    }
    
    if (avgSleep < 2) {
      insights.push("Poor sleep quality may be affecting your wellness. Consider sleep hygiene practices.")
    }
  }
  
  return insights
}

function calculateCheckInFrequency(entries: any[], startDate: Date, endDate: Date): number {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const uniqueDays = new Set(entries.map(entry => new Date(entry.created_at).toDateString())).size
  
  return Math.round((uniqueDays / totalDays) * 100)
}