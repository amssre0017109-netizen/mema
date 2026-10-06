-- =============================================================================
-- MEMA Web Application - Production Database Schema & Security Setup
-- Platform: Supabase (PostgreSQL 15+)
-- Instructions: Run this script in the Supabase SQL Editor of your project.
-- =============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 2. Profiles Table (Extends Supabase auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER DEFAULT 21,
  occupation_type TEXT DEFAULT 'working_professional' CHECK (occupation_type IN ('school_student', 'creator_freelancer', 'working_professional')),
  college TEXT DEFAULT 'Connaught Place, New Delhi',
  degree TEXT DEFAULT 'Student',
  year TEXT DEFAULT '3rd Year',
  location TEXT DEFAULT 'Connaught Place, New Delhi',
  location_zone TEXT DEFAULT 'Connaught Place, New Delhi',
  distance_km NUMERIC DEFAULT 0.5,
  distance_display TEXT DEFAULT 'Nearby (~500m)',
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  cover_image TEXT DEFAULT 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  verified_college BOOLEAN DEFAULT TRUE,
  student_id_verified BOOLEAN DEFAULT TRUE,
  skills TEXT[] DEFAULT ARRAY['Coding', 'Design', 'Music']::TEXT[],
  interests TEXT[] DEFAULT ARRAY['Campus Activities', 'Tech Meetups']::TEXT[],
  activities_completed INTEGER DEFAULT 0,
  requests_posted INTEGER DEFAULT 0,
  bio TEXT DEFAULT 'Passionate learner & collaborator on MEMA',
  online_status TEXT DEFAULT 'active_now',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. Campus Requests / Activity Needs Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.campus_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creator_name TEXT NOT NULL,
  creator_avatar TEXT,
  creator_degree TEXT DEFAULT 'Student',
  creator_year TEXT DEFAULT '3rd Year',
  creator_verified BOOLEAN DEFAULT TRUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  need_type TEXT DEFAULT 'Activity',
  date TEXT DEFAULT 'Today',
  time TEXT DEFAULT '5:00 PM',
  location TEXT NOT NULL,
  college TEXT,
  distance_km NUMERIC DEFAULT 0.5,
  distance_display TEXT DEFAULT 'Nearby',
  people_needed INTEGER DEFAULT 1,
  people_joined INTEGER DEFAULT 0,
  required_skills TEXT[] DEFAULT '{}'::TEXT[],
  description TEXT,
  is_urgent BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. Request Interests / Join Applications
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.request_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.campus_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  user_college TEXT,
  user_skills TEXT[] DEFAULT '{}'::TEXT[],
  note TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (request_id, user_id)
);

-- =============================================================================
-- 5. User Follows Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (follower_id, following_id)
);

-- =============================================================================
-- 6. Conversations & Chat Messages
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. Payment Transactions (Razorpay Integration)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  razorpay_order_id TEXT,
  amount_inr NUMERIC NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  payment_method TEXT DEFAULT 'card',
  status TEXT DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. User Subscriptions Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 9. Automatic Profile Creation on Signup (Trigger)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    college,
    location,
    location_zone,
    occupation_type,
    avatar
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'college', NEW.raw_user_meta_data->>'location', 'Connaught Place, New Delhi'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Connaught Place, New Delhi'),
    COALESCE(NEW.raw_user_meta_data->>'location_zone', NEW.raw_user_meta_data->>'location', 'Connaught Place, New Delhi'),
    COALESCE(NEW.raw_user_meta_data->>'occupation_type', 'school_student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    location = EXCLUDED.location,
    location_zone = EXCLUDED.location_zone,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 10. Row Level Security (RLS) Policies
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view public profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Campus Requests: Viewable by everyone, creators can insert/update/delete
CREATE POLICY "Campus requests viewable by all" ON public.campus_requests
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create requests" ON public.campus_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Creators can update their requests" ON public.campus_requests
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their requests" ON public.campus_requests
  FOR DELETE USING (auth.uid() = creator_id);

-- User Follows: Viewable by everyone, authenticated users can follow/unfollow
CREATE POLICY "Follows are viewable by all" ON public.user_follows
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow" ON public.user_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" ON public.user_follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Conversations & Messages: Participants only
CREATE POLICY "Users can view conversations they participate in" ON public.conversations
  FOR SELECT USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id
      AND auth.uid() = ANY(participant_ids)
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Payments: Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert transactions" ON public.payment_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 11. Storage Buckets (Avatars, Media, Covers)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;
