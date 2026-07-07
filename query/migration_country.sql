-- ========================================================
-- GitCric Extended Features Migration SQL
-- ========================================================
-- Execute this script in your Supabase SQL Editor to add
-- support for country-based classifications and rankings.

-- 1. Add country column to cache table (default to 'India')
ALTER TABLE public.github_profile_cache 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';

-- 2. Create index for fast country-based OVR rankings
CREATE INDEX IF NOT EXISTS idx_github_profile_cache_country ON public.github_profile_cache (country);
