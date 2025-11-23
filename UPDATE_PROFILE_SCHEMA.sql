-- Update existing users table to add profile columns
-- Run this in Supabase SQL Editor if you already have the users table

-- Add profile columns if they don't exist
DO $$ 
BEGIN
    -- Add age column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'age') THEN
        ALTER TABLE public.users ADD COLUMN age INTEGER;
    END IF;

    -- Add height column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'height') THEN
        ALTER TABLE public.users ADD COLUMN height DECIMAL(5,2);
    END IF;

    -- Add weight column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'weight') THEN
        ALTER TABLE public.users ADD COLUMN weight DECIMAL(5,2);
    END IF;

    -- Add fitness_goal column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'fitness_goal') THEN
        ALTER TABLE public.users ADD COLUMN fitness_goal TEXT;
    END IF;

    -- Add bio column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'bio') THEN
        ALTER TABLE public.users ADD COLUMN bio TEXT;
    END IF;
END $$;

-- Migrate existing profile data from JSONB to columns (if any exists)
UPDATE public.users
SET 
    age = (profile->>'age')::INTEGER,
    height = (profile->>'height')::DECIMAL,
    weight = (profile->>'weight')::DECIMAL,
    fitness_goal = profile->>'fitness_goal',
    bio = profile->>'bio'
WHERE profile IS NOT NULL 
  AND profile != '{}'::jsonb
  AND (
    profile ? 'age' OR 
    profile ? 'height' OR 
    profile ? 'weight' OR 
    profile ? 'fitness_goal' OR 
    profile ? 'bio'
  );

