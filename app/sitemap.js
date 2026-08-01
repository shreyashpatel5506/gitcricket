import { supabase } from '@/lib/supabase/connect';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gitcric.me';

  // Static routes
  const routes = [
    '',
    '/leagues',
    '/dashboard',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Fetch cached profile paths from database to dynamically list in sitemap
    const { data: profiles } = await supabase
      .from('github_profile_cache')
      .select('github_username, cached_at')
      .limit(5000); // Index up to 5000 profiles dynamically

    if (profiles) {
      const profileRoutes = profiles.map((p) => ({
        url: `${baseUrl}/${p.github_username.toLowerCase()}`,
        lastModified: new Date(p.cached_at).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
      return [...routes, ...profileRoutes];
    }
  } catch (err) {
    console.error('Failed to generate sitemap profile routes:', err);
  }

  return routes;
}
