-- ==========================================
-- GitCric Database Enhancements Reference SQL
-- ==========================================
-- This script contains SQL queries to create the themes table, 
-- set up row-level security (RLS) policies, and define triggers.
-- Paste this script into the SQL Editor of your Supabase dashboard.

-- 1. Create Themes Table
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Themes
INSERT INTO public.themes (id, name, description, is_premium) VALUES
('world-cup', 'ICC World Cup', 'Deep navy and gold engraved theme', false),
('ipl', 'IPL Franchise', 'Vibrant team color gradients', false),
('test', 'Test Cricket', 'Ivory card, classic Lord''s style whites', false),
('t20', 'T20 Blitz', 'Neon magenta and orange lightning styling', false),
('retro', 'Retro Cricket', 'CRT overlay, halftone dot graphics', false),
('cyber', 'Cyber Cricket', 'Electric green trace boards, monospace font', false),
('glass', 'Glass Card', 'Ultra-translucent frosted aesthetic', false),
('minimal', 'Minimal White', 'Stark white layout, premium typography', false),
('legend', 'Legendary Gold', 'High-shine gold foil accents', true),
('dark', 'Dark Stadium', 'Pitch lights spotlight gradient', false),
('light', 'Away Kit', 'Clean, modern white and blue stadium theme', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    github_username TEXT,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create User Profiles Sync Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, github_username, full_name, email, avatar_url, provider)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'user_name',
        new.raw_user_meta_data->>'full_name',
        new.email,
        new.raw_user_meta_data->>'avatar_url',
        new.raw_app_meta_data->>'provider'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        github_username = EXCLUDED.github_username,
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        avatar_url = EXCLUDED.avatar_url,
        provider = EXCLUDED.provider,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row-Level Security (RLS) on all tables
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_profile_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_cards ENABLE ROW LEVEL SECURITY;

-- 5. Set RLS Policies
-- Themes Policies
CREATE POLICY "Themes are viewable by everyone" ON public.themes
    FOR SELECT USING (true);

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Cache Policies
CREATE POLICY "Cached profiles are viewable by everyone" ON public.github_profile_cache
    FOR SELECT USING (true);

-- Generated Cards Policies
CREATE POLICY "Generated cards are viewable by everyone" ON public.generated_cards
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert generated cards" ON public.generated_cards
    FOR INSERT WITH CHECK (true);

-- GitHub OAuth Accounts Policies
CREATE POLICY "Users can view and edit their own credentials" ON public.github_accounts
    FOR ALL USING (auth.uid() = user_id);

-- Saved Cards Policies
CREATE POLICY "Saved cards are readable by everyone" ON public.user_saved_cards
    FOR SELECT USING (true);

CREATE POLICY "Users can edit their own saved cards" ON public.user_saved_cards
    FOR ALL USING (auth.uid() = user_id);

-- Search History Policies
CREATE POLICY "Users can manage their own search history" ON public.user_search_history
    FOR ALL USING (auth.uid() = user_id);

-- 5. Indexes for Performance Optimization
CREATE INDEX IF NOT EXISTS idx_github_profile_cache_username ON public.github_profile_cache (github_username);
CREATE INDEX IF NOT EXISTS idx_generated_cards_profile_id ON public.generated_cards (github_profile_id);

-- 6. Seed Achievements Definitions
INSERT INTO public.achievements (title, description, metric_field, threshold) VALUES
('Century Maker', 'Scraped profile has reached 100+ contributions', 'contribution_count', 100),
('Double Century Maker', 'Scraped profile has reached 200+ contributions', 'contribution_count', 200),
('Streak Starter', 'Active contribution streak reached 5+ days', 'current_streak', 5),
('Streak Legend', 'Longest contribution streak reached 30+ days', 'longest_streak', 30),
('Star Attraction', 'Scraped repositories have earned 15+ stars total', 'total_stars', 15)
ON CONFLICT (title) DO NOTHING;

-- 7. Seed Badges Definitions
INSERT INTO public.badges (name, description, icon_svg, criteria_json) VALUES
('JS Captain', 'Primary language is JavaScript', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', '{"primary_language": "JavaScript"}'::jsonb),
('Python Pro', 'Primary language is Python', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', '{"primary_language": "Python"}'::jsonb),
('Rust Ace', 'Primary language is Rust', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', '{"primary_language": "Rust"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 8. Create league_enrollments table
CREATE TABLE IF NOT EXISTS public.league_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
    season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'captain')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, season_id)
);

-- Enable Row-Level Security
ALTER TABLE public.league_enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "League enrollments are readable by everyone" ON public.league_enrollments;
DROP POLICY IF EXISTS "Users can manage their own league enrollment" ON public.league_enrollments;

-- RLS Policies
CREATE POLICY "League enrollments are readable by everyone" 
ON public.league_enrollments FOR SELECT USING (true);

CREATE POLICY "Users can manage their own league enrollment" 
ON public.league_enrollments FOR ALL USING (auth.uid() = user_id);

-- Fast Query Indexes
CREATE INDEX IF NOT EXISTS idx_enrollment_lookup 
ON public.league_enrollments (league_id, season_id, team_id);

-- 9. Seed Leagues
INSERT INTO public.leagues (name, code, description) VALUES
('Indian Premier League', 'ipl', 'The premier T20 franchise league in India. High intensity matches, star developers, and fierce corporate rivalries.'),
('ICC Cricket World Cup', 'cwc', 'The pinnacle of international cricket. Developers representing their nations on the global stage for absolute coding glory.'),
('Big Bash League', 'bbl', 'Australia''s showcase T20 tournament. Fast decks, boundary clearing power commits, and active community participation.')
ON CONFLICT (name) DO NOTHING;

-- 10. Seed Seasons (Linked to seeded leagues)
INSERT INTO public.seasons (league_id, name, start_date, end_date, is_active)
SELECT id, 'IPL Season 2026', '2026-03-01 00:00:00+00', '2026-06-01 00:00:00+00', true FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'World Cup 2027', '2027-10-01 00:00:00+00', '2027-12-01 00:00:00+00', true FROM public.leagues WHERE code = 'cwc'
UNION ALL
SELECT id, 'BBL Season 2026', '2026-12-01 00:00:00+00', '2027-02-01 00:00:00+00', true FROM public.leagues WHERE code = 'bbl'
ON CONFLICT DO NOTHING;

-- 11. Seed Teams
INSERT INTO public.teams (league_id, name, short_name)
SELECT id, 'Chennai Super Kings', 'CSK' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Royal Challengers Bengaluru', 'RCB' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Mumbai Indians', 'MI' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Kolkata Knight Riders', 'KKR' FROM public.leagues WHERE code = 'ipl'
ON CONFLICT DO NOTHING;
