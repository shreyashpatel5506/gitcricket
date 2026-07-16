-- ==========================================
-- GitCric Scalable Leagues & System Database Schema
-- ==========================================

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
('world-cup', 'ICC World Cup', 'Deep navy and gold theme', false),
('ipl', 'IPL Franchise', 'Vibrant team color gradients', false),
('test', 'Test Cricket', 'Ivory card, classic Lord''s style whites', false),
('t20', 'T20 Blitz', 'Neon magenta and orange lightning styling', false),
('retro', 'Retro Cricket', 'CRT overlay, halftone dot graphics', false),
('cyber', 'Cyber Cricket', 'Electric green trace boards, monospace font', false),
('glass', 'Glass Card', 'Ultra-translucent frosted aesthetic', false),
('minimal', 'Minimal White', 'Stark white layout, premium typography', false),
('legend', 'Legendary Gold', 'High-shine gold foil accents', true),
('dark', 'Dark Stadium', 'Pitch lights spotlight gradient', false),
('light', 'Away Kit', 'Clean stadium white and blue theme', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Profiles Table
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

-- 3. Create User Sync Trigger
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

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_profile_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_cards ENABLE ROW LEVEL SECURITY;

-- 5. Policies
DROP POLICY IF EXISTS "Themes are viewable by everyone" ON public.themes;
CREATE POLICY "Themes are viewable by everyone" ON public.themes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Cached profiles are viewable by everyone" ON public.github_profile_cache;
CREATE POLICY "Cached profiles are viewable by everyone" ON public.github_profile_cache FOR SELECT USING (true);

DROP POLICY IF EXISTS "Generated cards are viewable by everyone" ON public.generated_cards;
CREATE POLICY "Generated cards are viewable by everyone" ON public.generated_cards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert generated cards" ON public.generated_cards;
CREATE POLICY "Anyone can insert generated cards" ON public.generated_cards FOR INSERT WITH CHECK (true);

-- 6. Seed Achievements
INSERT INTO public.achievements (title, description, metric_field, threshold) VALUES
('Century Maker', 'Scraped profile has reached 100+ contributions', 'contribution_count', 100),
('Double Century Maker', 'Scraped profile has reached 200+ contributions', 'contribution_count', 200),
('Streak Starter', 'Active contribution streak reached 5+ days', 'current_streak', 5),
('Streak Legend', 'Longest contribution streak reached 30+ days', 'longest_streak', 30),
('Star Attraction', 'Scraped repositories have earned 15+ stars total', 'total_stars', 15)
ON CONFLICT (title) DO NOTHING;

-- 7. Seed Badges
INSERT INTO public.badges (name, description, icon_svg, criteria_json) VALUES
('JS Captain', 'Primary language is JavaScript', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', '{"primary_language": "JavaScript"}'::jsonb),
('Python Pro', 'Primary language is Python', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', '{"primary_language": "Python"}'::jsonb),
('Rust Ace', 'Primary language is Rust', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', '{"primary_language": "Rust"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 8. Alter Leagues table to add Governing Body grouping parameter (if needed)
ALTER TABLE public.leagues ADD COLUMN IF NOT EXISTS governing_body TEXT DEFAULT 'Other';

-- 9. Create league_enrollments table with nullable team_id
CREATE TABLE IF NOT EXISTS public.league_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
    season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE, -- NULL means player represents their country directly (e.g. ICC World Cup)
    role TEXT NOT NULL CHECK (role IN ('batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'captain')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, season_id)
);

-- Enable RLS for enrollments
ALTER TABLE public.league_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "League enrollments are readable by everyone" ON public.league_enrollments;
CREATE POLICY "League enrollments are readable by everyone" ON public.league_enrollments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own league enrollment" ON public.league_enrollments;
CREATE POLICY "Users can manage their own league enrollment" ON public.league_enrollments FOR ALL USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_enrollment_lookup ON public.league_enrollments (league_id, season_id, team_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_user ON public.league_enrollments (user_id);

-- 10. Re-seed Leagues with governing body associations
TRUNCATE TABLE public.leagues CASCADE;

INSERT INTO public.leagues (name, code, description, governing_body) VALUES
('ICC Cricket World Cup', 'cwc', 'The pinnacle of international cricket. Representative nation matches for coding supremacy.', 'ICC'),
('ICC T20 World Cup', 't20-wc', 'Fast commits and heavy action. Global T20 international championship.', 'ICC'),
('Indian Premier League', 'ipl', 'The premier T20 franchise league in India. High intensity matches, team selections, and star developers.', 'BCCI'),
('Women''s Premier League', 'wpl', 'India''s premier franchise league for women cricketers.', 'BCCI'),
('Big Bash League', 'bbl', 'Australia''s showcase T20 tournament. Hard-hitting action on fast decks.', 'Cricket Australia'),
('The Hundred', 'hundred', 'England''s innovative 100-ball tournament.', 'ECB'),
('Pakistan Super League', 'psl', 'Pakistan''s premier franchise T20 league.', 'PCB')
ON CONFLICT (name) DO UPDATE SET governing_body = EXCLUDED.governing_body, description = EXCLUDED.description;

-- 11. Re-seed seasons
INSERT INTO public.seasons (league_id, name, start_date, end_date, is_active)
SELECT id, 'CWC Season 2027', '2027-10-01 00:00:00+00'::TIMESTAMPTZ, '2027-12-01 00:00:00+00'::TIMESTAMPTZ, true FROM public.leagues WHERE code = 'cwc'
UNION ALL
SELECT id, 'T20 WC 2026', '2026-06-01 00:00:00+00'::TIMESTAMPTZ, '2026-07-01 00:00:00+00'::TIMESTAMPTZ, true FROM public.leagues WHERE code = 't20-wc'
UNION ALL
SELECT id, 'IPL Season 2026', '2026-03-01 00:00:00+00'::TIMESTAMPTZ, '2026-06-01 00:00:00+00'::TIMESTAMPTZ, true FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'BBL Season 2026', '2026-12-01 00:00:00+00'::TIMESTAMPTZ, '2027-02-01 00:00:00+00'::TIMESTAMPTZ, true FROM public.leagues WHERE code = 'bbl'
UNION ALL
SELECT id, 'The Hundred 2026', '2026-07-01 00:00:00+00'::TIMESTAMPTZ, '2026-08-31 00:00:00+00'::TIMESTAMPTZ, true FROM public.leagues WHERE code = 'hundred'
ON CONFLICT DO NOTHING;

-- 12. Re-seed teams (CSK, RCB, MI, KKR for IPL; Renegades, Stars for BBL; etc.)
TRUNCATE TABLE public.teams CASCADE;

-- IPL Teams
INSERT INTO public.teams (league_id, name, short_name)
SELECT id, 'Chennai Super Kings', 'CSK' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Royal Challengers Bengaluru', 'RCB' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Mumbai Indians', 'MI' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Kolkata Knight Riders', 'KKR' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Rajasthan Royals', 'RR' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Sunrisers Hyderabad', 'SRH' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Delhi Capitals', 'DC' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Gujarat Titans', 'GT' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Lucknow Super Giants', 'LSG' FROM public.leagues WHERE code = 'ipl'
UNION ALL
SELECT id, 'Punjab Kings', 'PBKS' FROM public.leagues WHERE code = 'ipl';

-- BBL Teams
INSERT INTO public.teams (league_id, name, short_name)
SELECT id, 'Melbourne Stars', 'MLS' FROM public.leagues WHERE code = 'bbl'
UNION ALL
SELECT id, 'Sydney Sixers', 'SYS' FROM public.leagues WHERE code = 'bbl'
UNION ALL
SELECT id, 'Perth Scorchers', 'PSC' FROM public.leagues WHERE code = 'bbl';
