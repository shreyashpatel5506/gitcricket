export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gitcric.me';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
