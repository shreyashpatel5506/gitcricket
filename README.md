# 🏏 GitCric — Turn Your GitHub Profile into a Cricket Player Card

[![Next.js Version](https://img.shields.io/badge/next.js-v16.2.10-blue?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/react-v19.2.4-blue?logo=react&logoColor=white)](https://react.dev/)
[![TailwindCSS Version](https://img.shields.io/badge/tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase Database](https://img.shields.io/badge/supabase-postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Transform your boring GitHub contribution grid into high-performance, shareable **Cricket Player Cards**! GitCric maps your developer activity (commits, pull requests, issues, streaks, and languages) into dynamic cricket ratings, custom specialties, and career statistics.

👉 **Try it Live**: [https://www.gitcric.me](https://www.gitcric.me)

---

## 🚀 Key Features

* **3D Foil Player Cards**: Beautifully animated cards featuring hover tilt highlights and shiny metallic foil gradients based on your player tier (Bronze, Silver, Gold, Diamond, or Legend).
* **GitHub Stats Mapping**:
  * **Commits** ➡️ Career Runs & Batting Rating
  * **Pull Requests** ➡️ Wickets taken & Bowling Rating
  * **Streaks** ➡️ Form & Technical Rating
  * **Stars & Followers** ➡️ Overall Player Rating (OVR)
* **Match Formats**: Recalculate your player ratings dynamically for **ODI**, **T20 Blitz**, and **Test Match** formats.
* **Developer Tournaments**: Join competitive leagues (e.g., ICC World Cup, BCCI League) and climb the global leaderboards to win MVP titles.
* **Social Sharing**: Share your scorecards instantly on **LinkedIn**, **Twitter/X**, and **WhatsApp**.
* **GitHub Profile README Badge**: One-click copy a markdown badge that displays your live dynamic player card directly on your GitHub profile.
* **Dynamic OpenGraph Previews**: Generates custom social preview cards on-the-fly via `/api/og` so that sharing your link shows your exact player rating card.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TailwindCSS v4
* **Animations**: Framer Motion, Lucide React Icons
* **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
* **Image Generation**: HTML-to-Image (client-side card downloads) & `@vercel/og` / `next/og` (server-side social preview cards)

---

## 📦 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/shreyashpatel5506/gitcricket.git
cd gitcricket
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and populate it with your keys:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# GitHub Personal Access Token (for rate-limit safety during profile scans)
GITHUB_TOKEN=ghp_...

# Public URLs
NEXT_PUBLIC_SITE_URL=https://www.gitcric.me

# Analytics & Ads IDs (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 📈 SEO & Performance Optimization

* **Dynamic Sitemap (`/sitemap.xml`)**: Configured at `app/sitemap.js` to dynamically pull cached player records from Supabase and automatically submit all user profiles to Google for indexing.
* **Robots Configuration (`/robots.txt`)**: Custom directives preventing search engines from crawling backend `/api/` endpoints while indexing static routes and sitemaps.
* **Metadata & OG Integration**: High-SEO layouts featuring dynamic title generation, static keywords, and dynamic `next/og` scorecard graphics.

## 🤝 Contributing

Contributions are welcome! If you are a first-time contributor looking to get started, you can help us expand our **Location Mapping** list:

- **Easiest Task:** Help map missing cities, states, or country abbreviations in [transformer.js](features/scanner/utils/transformer.js).
- Look for the `location-mapping` labeled issues on our repository, or simply add missing locations for your home country!
- ⚠️ **Note:** If you submit a pull request, **please consider starring the repository** to support the project and speed up the review/merge approval process! 🚀

### ✨ Contributors

Thanks to these wonderful people for contributing to GitCric:

[![Contributors Grid](https://contrib.rocks/image?repo=shreyashpatel5506/gitcricket)](https://github.com/shreyashpatel5506/gitcricket/graphs/contributors)

Made with [contrib.rocks](https://contrib.rocks).

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
