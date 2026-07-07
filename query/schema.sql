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

-- 2. Create User Profiles Sync Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, github_username, full_name, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'user_name',
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        github_username = EXCLUDED.github_username,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Enable Row-Level Security (RLS) on all tables
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_profile_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_cards ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies
-- Themes Policies
CREATE POLICY "Themes are viewable by everyone" ON public.themes
    FOR SELECT USING (true);

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

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
