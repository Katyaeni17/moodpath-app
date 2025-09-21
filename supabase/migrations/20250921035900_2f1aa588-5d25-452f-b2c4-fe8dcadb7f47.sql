-- Fix the ambiguous column reference in update_user_streak function
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID DEFAULT NULL, p_session_id TEXT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  last_entry_date DATE;
  calc_current_streak INTEGER := 0;
  calc_longest_streak INTEGER := 0;
  calc_total_check_ins INTEGER := 0;
  profile_exists BOOLEAN := false;
  result JSON;
BEGIN
  -- Check if profile exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles 
    WHERE (p_user_id IS NOT NULL AND user_profiles.user_id = p_user_id) 
       OR (p_session_id IS NOT NULL AND user_profiles.session_id = p_session_id)
  ) INTO profile_exists;

  -- Create profile if it doesn't exist
  IF NOT profile_exists THEN
    INSERT INTO public.user_profiles (user_id, session_id, current_streak, longest_streak, total_check_ins)
    VALUES (p_user_id, p_session_id, 0, 0, 0);
  END IF;

  -- Get the date of the last mood entry
  SELECT DATE(mood_entries.created_at) INTO last_entry_date
  FROM public.mood_entries
  WHERE (p_user_id IS NOT NULL AND mood_entries.user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND mood_entries.session_id = p_session_id)
  ORDER BY mood_entries.created_at DESC
  LIMIT 1;

  -- Calculate current streak
  IF last_entry_date IS NOT NULL THEN
    -- Count consecutive days with entries
    WITH daily_entries AS (
      SELECT DATE(mood_entries.created_at) as entry_date
      FROM public.mood_entries
      WHERE (p_user_id IS NOT NULL AND mood_entries.user_id = p_user_id) 
         OR (p_session_id IS NOT NULL AND mood_entries.session_id = p_session_id)
      GROUP BY DATE(mood_entries.created_at)
      ORDER BY DATE(mood_entries.created_at) DESC
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
    SELECT COALESCE(streak_length, 0) INTO calc_current_streak FROM consecutive_days;
  END IF;

  -- Get total check-ins
  SELECT COUNT(*) INTO calc_total_check_ins
  FROM public.mood_entries
  WHERE (p_user_id IS NOT NULL AND mood_entries.user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND mood_entries.session_id = p_session_id);

  -- Get current longest streak from profile
  SELECT COALESCE(user_profiles.longest_streak, 0) INTO calc_longest_streak
  FROM public.user_profiles
  WHERE (p_user_id IS NOT NULL AND user_profiles.user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND user_profiles.session_id = p_session_id);

  -- Update longest streak if current is longer
  IF calc_current_streak > calc_longest_streak THEN
    calc_longest_streak := calc_current_streak;
  END IF;

  -- Update user profile
  UPDATE public.user_profiles
  SET 
    current_streak = calc_current_streak,
    longest_streak = calc_longest_streak,
    total_check_ins = calc_total_check_ins,
    updated_at = now()
  WHERE (p_user_id IS NOT NULL AND user_profiles.user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND user_profiles.session_id = p_session_id);

  -- Return result
  SELECT json_build_object(
    'current_streak', calc_current_streak,
    'longest_streak', calc_longest_streak,
    'total_check_ins', calc_total_check_ins
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;