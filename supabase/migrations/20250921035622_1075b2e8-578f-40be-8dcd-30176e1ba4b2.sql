-- Enable RLS
ALTER TABLE IF EXISTS public.mood_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wellness_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resource_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.crisis_alerts DISABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.crisis_alerts;
DROP TABLE IF EXISTS public.resource_interactions;
DROP TABLE IF EXISTS public.wellness_assessments;
DROP TABLE IF EXISTS public.mood_entries;
DROP TABLE IF EXISTS public.user_profiles;

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_check_ins INTEGER NOT NULL DEFAULT 0,
  preferred_name TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create mood_entries table
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 10),
  mood_label TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT mood_entries_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create wellness_assessments table
CREATE TABLE public.wellness_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  social_connection INTEGER NOT NULL CHECK (social_connection >= 1 AND social_connection <= 10),
  academic_pressure INTEGER NOT NULL CHECK (academic_pressure >= 1 AND academic_pressure <= 10),
  total_score INTEGER,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT wellness_assessments_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create resource_interactions table
CREATE TABLE public.resource_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT resource_interactions_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create crisis_alerts table
CREATE TABLE public.crisis_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  alert_level TEXT NOT NULL CHECK (alert_level IN ('low', 'medium', 'high', 'critical')),
  trigger_data JSONB,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT crisis_alerts_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (
  auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
);

CREATE POLICY "Users can create their own profile" ON public.user_profiles FOR INSERT WITH CHECK (
  auth.uid() = user_id OR session_id IS NOT NULL
);

CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (
  auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
);

-- Create RLS policies for mood_entries
CREATE POLICY "Users can view their own mood entries" ON public.mood_entries FOR SELECT USING (
  auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
);

CREATE POLICY "Users can create their own mood entries" ON public.mood_entries FOR INSERT WITH CHECK (
  auth.uid() = user_id OR session_id IS NOT NULL
);

-- Create RLS policies for wellness_assessments
CREATE POLICY "Users can view their own assessments" ON public.wellness_assessments FOR SELECT USING (
  auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
);

CREATE POLICY "Users can create their own assessments" ON public.wellness_assessments FOR INSERT WITH CHECK (
  auth.uid() = user_id OR session_id IS NOT NULL
);

-- Create RLS policies for resource_interactions
CREATE POLICY "Users can view their own interactions" ON public.resource_interactions FOR SELECT USING (
  auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
);

CREATE POLICY "Users can create their own interactions" ON public.resource_interactions FOR INSERT WITH CHECK (
  auth.uid() = user_id OR session_id IS NOT NULL
);

-- Create RLS policies for crisis_alerts
CREATE POLICY "Users can view their own alerts" ON public.crisis_alerts FOR SELECT USING (
  auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
);

CREATE POLICY "Users can create their own alerts" ON public.crisis_alerts FOR INSERT WITH CHECK (
  auth.uid() = user_id OR session_id IS NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_mood_entries_session_id ON public.mood_entries(session_id);
CREATE INDEX idx_mood_entries_created_at ON public.mood_entries(created_at);

CREATE INDEX idx_wellness_assessments_user_id ON public.wellness_assessments(user_id);
CREATE INDEX idx_wellness_assessments_session_id ON public.wellness_assessments(session_id);
CREATE INDEX idx_wellness_assessments_created_at ON public.wellness_assessments(created_at);

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_session_id ON public.user_profiles(session_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mood_entries_updated_at
  BEFORE UPDATE ON public.mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update user streak
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID DEFAULT NULL, p_session_id TEXT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  last_entry_date DATE;
  current_streak INTEGER := 0;
  longest_streak INTEGER := 0;
  total_check_ins INTEGER := 0;
  profile_exists BOOLEAN := false;
  result JSON;
BEGIN
  -- Check if profile exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles 
    WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
       OR (p_session_id IS NOT NULL AND session_id = p_session_id)
  ) INTO profile_exists;

  -- Create profile if it doesn't exist
  IF NOT profile_exists THEN
    INSERT INTO public.user_profiles (user_id, session_id, current_streak, longest_streak, total_check_ins)
    VALUES (p_user_id, p_session_id, 0, 0, 0);
  END IF;

  -- Get the date of the last mood entry
  SELECT DATE(created_at) INTO last_entry_date
  FROM public.mood_entries
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id)
  ORDER BY created_at DESC
  LIMIT 1;

  -- Calculate current streak
  IF last_entry_date IS NOT NULL THEN
    -- Count consecutive days with entries
    WITH daily_entries AS (
      SELECT DATE(created_at) as entry_date
      FROM public.mood_entries
      WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
         OR (p_session_id IS NOT NULL AND session_id = p_session_id)
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) DESC
    ),
    streak_calculation AS (
      SELECT entry_date,
             ROW_NUMBER() OVER (ORDER BY entry_date DESC) as rn,
             entry_date + INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY entry_date DESC) as expected_date
      FROM daily_entries
    ),
    consecutive_days AS (
      SELECT COUNT(*) as streak_length
      FROM streak_calculation
      WHERE expected_date = CURRENT_DATE + INTERVAL '1 day' * rn
    )
    SELECT COALESCE(streak_length, 0) INTO current_streak FROM consecutive_days;
  END IF;

  -- Get total check-ins
  SELECT COUNT(*) INTO total_check_ins
  FROM public.mood_entries
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);

  -- Get current longest streak from profile
  SELECT COALESCE(user_profiles.longest_streak, 0) INTO longest_streak
  FROM public.user_profiles
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);

  -- Update longest streak if current is longer
  IF current_streak > longest_streak THEN
    longest_streak := current_streak;
  END IF;

  -- Update user profile
  UPDATE public.user_profiles
  SET 
    current_streak = current_streak,
    longest_streak = longest_streak,
    total_check_ins = total_check_ins,
    updated_at = now()
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);

  -- Return result
  SELECT json_build_object(
    'current_streak', current_streak,
    'longest_streak', longest_streak,
    'total_check_ins', total_check_ins
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;