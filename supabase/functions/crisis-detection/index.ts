import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      user_id = null, 
      session_id = null, 
      mood_value, 
      assessment_data = null,
      notes = null 
    } = await req.json()
    
    console.log('Crisis detection request:', { user_id, session_id, mood_value, notes })

    let alertLevel = 'low'
    const triggerData: any = {}
    let shouldCreateAlert = false

    // Crisis detection logic
    if (mood_value && mood_value <= 1) {
      alertLevel = 'high'
      triggerData.lowMood = { value: mood_value, timestamp: new Date() }
      shouldCreateAlert = true
    }

    if (assessment_data) {
      const { stress_level, sleep_quality, social_connection, academic_pressure } = assessment_data
      
      // High stress + poor sleep + low social connection = critical
      if (stress_level >= 9 && sleep_quality <= 1 && social_connection <= 1) {
        alertLevel = 'critical'
        triggerData.criticalCombination = { stress_level, sleep_quality, social_connection }
        shouldCreateAlert = true
      }
      // High academic pressure + high stress
      else if (academic_pressure >= 9 && stress_level >= 8) {
        alertLevel = 'high'
        triggerData.highStressAcademic = { academic_pressure, stress_level }
        shouldCreateAlert = true
      }
      // Multiple moderate risk factors
      else if ((stress_level >= 7 && sleep_quality <= 2) || 
               (stress_level >= 8 && social_connection <= 2)) {
        alertLevel = 'medium'
        triggerData.moderateRisk = { stress_level, sleep_quality, social_connection }
        shouldCreateAlert = true
      }
    }

    // Check for crisis keywords in notes
    if (notes) {
      const crisisKeywords = [
        'suicide', 'kill myself', 'end it all', 'no point', 'better off dead',
        'cant go on', 'hopeless', 'worthless', 'nobody cares'
      ]
      
      const lowerNotes = notes.toLowerCase()
      const foundKeywords = crisisKeywords.filter(keyword => lowerNotes.includes(keyword))
      
      if (foundKeywords.length > 0) {
        alertLevel = 'critical'
        triggerData.crisisLanguage = { keywords: foundKeywords, notes }
        shouldCreateAlert = true
      }
    }

    let response = {
      alertLevel,
      requiresIntervention: alertLevel === 'critical',
      recommendedActions: getRecommendedActions(alertLevel),
      resources: getCrisisResources(alertLevel)
    }

    // Create alert record if needed
    if (shouldCreateAlert) {
      const { error: alertError } = await supabase
        .from('crisis_alerts')
        .insert({
          user_id: user_id,
          session_id: session_id,
          alert_level: alertLevel,
          trigger_data: triggerData
        })

      if (alertError) {
        console.error('Error creating crisis alert:', alertError)
      }

      // If critical, also check recent pattern
      if (alertLevel === 'critical') {
        const recentAlerts = await supabase
          .from('crisis_alerts')
          .select('*')
          .or(user_id ? `user_id.eq.${user_id}` : `session_id.eq.${session_id}`)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
          .eq('is_resolved', false)

        if (recentAlerts.data && recentAlerts.data.length > 2) {
          response.requiresIntervention = true
          response.recommendedActions.unshift('Immediate professional support recommended due to repeated alerts')
        }
      }
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in crisis-detection:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function getRecommendedActions(alertLevel: string): string[] {
  switch (alertLevel) {
    case 'critical':
      return [
        'Contact crisis hotline immediately: 988 (Suicide & Crisis Lifeline)',
        'Reach out to a trusted friend, family member, or counselor',
        'Consider visiting your campus counseling center',
        'Remove access to means of self-harm',
        'Stay with someone you trust'
      ]
    case 'high':
      return [
        'Schedule appointment with campus counseling services',
        'Practice grounding techniques and deep breathing',
        'Reach out to support network',
        'Consider stress management resources',
        'Monitor mood closely over next few days'
      ]
    case 'medium':
      return [
        'Try relaxation and mindfulness exercises',
        'Maintain regular sleep schedule',
        'Engage in physical activity',
        'Connect with friends or support groups',
        'Consider counseling if symptoms persist'
      ]
    default:
      return [
        'Continue healthy habits',
        'Practice self-care',
        'Stay connected with support network'
      ]
  }
}

function getCrisisResources(alertLevel: string): Array<{name: string, contact: string, description: string}> {
  const resources = [
    {
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: '24/7 crisis support via text message'
    },
    {
      name: 'Suicide & Crisis Lifeline',
      contact: 'Call or text 988',
      description: '24/7 free and confidential support'
    },
    {
      name: 'Campus Counseling Center',
      contact: 'Contact your school\'s counseling services',
      description: 'Professional support tailored for students'
    }
  ]

  if (alertLevel === 'critical' || alertLevel === 'high') {
    resources.unshift({
      name: 'Emergency Services',
      contact: 'Call 911',
      description: 'For immediate life-threatening situations'
    })
  }

  return resources
}