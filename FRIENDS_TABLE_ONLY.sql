-- Friends System - Add Only the Friendships Table
-- Run this if you already have the main schema set up

-- Friends/Relationships table
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
    requested_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON public.friendships(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friendships table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can create friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can update own friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can delete own friendships" ON public.friendships;

-- Users can view friendships they're part of
CREATE POLICY "Users can view own friendships"
    ON public.friendships FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can create friend requests
CREATE POLICY "Users can create friendships"
    ON public.friendships FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can update friendships they're part of
CREATE POLICY "Users can update own friendships"
    ON public.friendships FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can delete friendships they're part of
CREATE POLICY "Users can delete own friendships"
    ON public.friendships FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

