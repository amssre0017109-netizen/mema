-- =========================================================================
-- MEMA — Find Your Mood: Supabase PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- =========================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- 1. PROFILES TABLE (Members & Students)
create table if not exists public.profiles (
  id text primary key,
  name text not null,
  age integer default 21,
  occupation_type text default 'working_professional', -- 'school_student', 'creator_freelancer', 'working_professional'
  college text default 'Delhi Technological University (DTU)',
  degree text default 'Student',
  year text default '3rd Year',
  location text default 'Nearby Area',
  location_zone text default 'Nearby Area',
  distance_km numeric default 0.8,
  distance_display text default '~Within 1 km',
  avatar text not null,
  cover_image text,
  verified_college boolean default true,
  student_id_verified boolean default true,
  skills text[] default '{}',
  interests text[] default '{}',
  activities_completed integer default 0,
  requests_posted integer default 0,
  bio text default '',
  online_status text default 'active_now', -- 'active_now', 'active_today', 'away'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CAMPUS REQUESTS & ACTIVITIES TABLE
create table if not exists public.campus_requests (
  id text primary key,
  title text not null,
  category text not null,
  need_type text default 'Activity', -- 'Person', 'Team', 'Activity', 'Equipment'
  date text default 'Today',
  time text default '5:00 PM',
  location text not null,
  college text default 'Delhi Technological University (DTU)',
  distance_km numeric default 0.5,
  distance_display text default 'Nearby (~500m)',
  people_needed integer default 1,
  people_joined integer default 0,
  required_skills text[] default '{}',
  description text not null,
  creator_id text references public.profiles(id) on delete cascade,
  creator_name text not null,
  creator_avatar text not null,
  creator_degree text,
  creator_year text,
  creator_verified boolean default true,
  is_urgent boolean default false,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

-- 3. REQUEST INTERESTS (RSVP & Applications)
create table if not exists public.request_interests (
  id uuid primary key default gen_random_uuid(),
  request_id text references public.campus_requests(id) on delete cascade,
  user_id text references public.profiles(id) on delete cascade,
  user_name text not null,
  user_avatar text not null,
  user_college text,
  user_skills text[] default '{}',
  note text,
  status text default 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED'
  created_at timestamptz default now()
);

-- 4. CONVERSATIONS TABLE
create table if not exists public.conversations (
  id text primary key,
  user1_id text references public.profiles(id) on delete cascade,
  user2_id text references public.profiles(id) on delete cascade,
  last_message text,
  last_message_time text default 'Just now',
  activity_title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. MESSAGES TABLE
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text references public.conversations(id) on delete cascade,
  sender_id text references public.profiles(id) on delete cascade,
  text text not null,
  is_icebreaker boolean default false,
  safe_meetup_location text,
  safe_meetup_time text,
  safe_meetup_status text, -- 'proposed', 'accepted'
  created_at timestamptz default now()
);

-- 6. RAZORPAY PAYMENT TRANSACTIONS TABLE
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade,
  razorpay_payment_id text not null,
  razorpay_order_id text,
  amount_inr numeric not null,
  plan_id text not null,
  plan_name text not null,
  payment_method text default 'RAZORPAY',
  status text default 'SUCCESS',
  created_at timestamptz default now()
);

-- 7. USER SUBSCRIPTIONS TABLE (VIP Premium)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade unique,
  plan_id text not null,
  plan_name text not null,
  status text default 'ACTIVE', -- 'ACTIVE', 'TRIAL', 'EXPIRED', 'CANCELLED'
  auto_renew boolean default true,
  expires_at timestamptz default (now() + interval '90 days'),
  created_at timestamptz default now()
);

-- =========================================================================
-- SEED INITIAL MEMA PROFILES
-- =========================================================================
insert into public.profiles (id, name, age, occupation_type, college, degree, year, location, distance_km, distance_display, avatar, verified_college, student_id_verified, skills, interests, bio)
values
  ('stu_7', 'Tanya Sharma', 20, 'school_student', 'Delhi Public School', 'Badminton Doubles Champion', 'Class 12th', 'North Delhi Area', 0.8, '~Within 1 km', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', true, true, array['Badminton', 'Fitness', 'Running', 'Athletics'], array['Badminton Sparring', 'State Tournaments', 'Morning Drills'], 'Competitive badminton player looking for daily morning sparring partners on campus courts.'),
  ('stu_8', 'Aarav Malhotra', 21, 'creator_freelancer', 'Fitness & Calisthenics Lab', 'Calisthenics Athlete & Trainer', 'Trainer', 'North Delhi Area', 0.9, '~Within 1 km', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', true, true, array['Calisthenics', 'Gym Training', 'Bodyweight Fitness', 'Weight Training'], array['Street Workout', 'Mobility', 'Muscle-up Clinics'], 'Calisthenics athlete and strength trainer. Open for group bodyweight workouts and muscle-up technique sessions.'),
  ('stu_1', 'Aman Preet', 21, 'school_student', 'Delhi Public School', 'Folk Choreography & Bhangra', 'Class 12th', 'North Campus Area', 0.5, '~Within 1 km', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', true, true, array['Bhangra', 'Dance', 'Fitness', 'Gym Training'], array['Folk Dance Competitions', 'Zonal Fests', 'Gym Workout'], 'Lead dancer and choreographer. Organizing folk choreography practice for upcoming inter-college cultural fest.'),
  ('stu_3', 'Rohan Gupta', 22, 'working_professional', 'Sports Club Delhi', 'Football Striker & Athlete', 'Club Captain', 'North-West Delhi Area', 0.7, '~Within 1 km', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', true, true, array['Football', 'Striker', 'FIFA', 'Running'], array['Football Tournaments', 'FPL', 'Turf Games'], 'Captain for football squad. Organizing casual 7v7 evening matches and weekend turf bookings.'),
  ('stu_4', 'Ananya Roy', 21, 'creator_freelancer', 'Design Sprint Studio', 'Product Designer & Frontend', 'UI/UX Creator', 'West Delhi Area', 1.8, '~1-2 km away', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', true, true, array['React / Web Dev', 'UI/UX Design', 'Figma', 'AI / ML', 'Hackathons'], array['Hackathons', 'Tech Startups', 'Open Source'], 'Frontend dev & product designer. Building smart web apps. Need backend and AI builders for hackathons.')
on conflict (id) do nothing;

-- =========================================================================
-- SEED INITIAL CAMPUS REQUESTS
-- =========================================================================
insert into public.campus_requests (id, title, category, need_type, date, time, location, college, distance_km, distance_display, people_needed, people_joined, required_skills, description, creator_id, creator_name, creator_avatar, is_urgent, likes_count)
values
  ('req_1', '⚽ Football Partner / Players Needed', 'Sports', 'Activity', 'Today', '6:00 PM', 'Campus Sports Ground', 'Delhi Technological University (DTU)', 0.4, 'Campus Grounds • Nearby (~500m)', 2, 4, array['Football', 'Active Running'], 'We have 10 players for a 6v6 friendly match on the main turf. Need 2 more players (any position welcome). Boots recommended, bibs provided!', 'stu_3', 'Rohan Gupta', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', true, 14),
  ('req_4', '💻 React & Tailwind Dev for Smart India Hackathon', 'Coding', 'Team', 'This Weekend', '10:00 AM', 'Tech Commons / Online Discord', 'NSUT Delhi', 3.2, 'West Delhi Area • ~3-4 km away', 1, 3, array['React / Web Dev', 'UI/UX Design', 'API Integration'], 'We have our backend (FastAPI + Postgres) and ML model ready for our AI campus navigation problem statement. Need 1 solid frontend builder in React to build clean dashboards.', 'stu_4', 'Ananya Roy', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', true, 35)
on conflict (id) do nothing;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.campus_requests enable row level security;
alter table public.request_interests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.subscriptions enable row level security;

-- Allow public reads for student directory and feeds
create policy "Allow public read for profiles" on public.profiles for select using (true);
create policy "Allow public read for campus_requests" on public.campus_requests for select using (true);
create policy "Allow public read for request_interests" on public.request_interests for select using (true);
create policy "Allow public read for conversations" on public.conversations for select using (true);
create policy "Allow public read for messages" on public.messages for select using (true);

-- Allow public insert/updates for active app usage
create policy "Allow insert for profiles" on public.profiles for insert with check (true);
create policy "Allow update for profiles" on public.profiles for update using (true);
create policy "Allow insert for campus_requests" on public.campus_requests for insert with check (true);
create policy "Allow insert for request_interests" on public.request_interests for insert with check (true);
create policy "Allow insert for messages" on public.messages for insert with check (true);
create policy "Allow insert for payment_transactions" on public.payment_transactions for insert with check (true);

-- =========================================================================
-- ENABLE REALTIME ON MESSAGES & REQUESTS
-- =========================================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.campus_requests;
alter publication supabase_realtime add table public.request_interests;

-- =========================================================================
-- AUTOMATIC PROFILE CREATION ON SUPABASE AUTH SIGN-UP
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    name,
    college,
    degree,
    year,
    occupation_type,
    avatar,
    skills,
    interests,
    bio
  )
  values (
    new.id::text,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'college', 'Delhi Technological University (DTU)'),
    coalesce(new.raw_user_meta_data->>'degree', 'Student'),
    coalesce(new.raw_user_meta_data->>'year', '3rd Year'),
    coalesce(new.raw_user_meta_data->>'occupation_type', 'school_student'),
    coalesce(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    array['Campus Activities', 'Meetups'],
    array['Meetups', 'Activities'],
    'Active student and campus member'
  )
  on conflict (id) do update set
    name = coalesce(excluded.name, profiles.name),
    avatar = coalesce(excluded.avatar, profiles.avatar);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

