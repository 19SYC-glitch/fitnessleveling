-- Add Profile Visibility Column
-- Run this in Supabase SQL Editor to add profile visibility settings

-- Add profile_visibility column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'profile_visibility') THEN
        ALTER TABLE public.users ADD COLUMN profile_visibility TEXT DEFAULT 'public';
    END IF;
END $$;

-- Update existing users to have public visibility by default
UPDATE public.users
SET profile_visibility = 'public'
WHERE profile_visibility IS NULL;

