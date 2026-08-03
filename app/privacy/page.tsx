import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Globe, Settings2 } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy — GitCric",
  description: "Read the Privacy Policy of GitCric to understand how we collect, cache, use, and protect your public GitHub statistics and cookie usage under AdSense requirements.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="rounded-full bg-green-glow px-3 py-1 text-xs font-semibold text-green-core border border-green-core/20 tracking-wider uppercase">
              Compliance & Safety
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider mt-4 leading-tight">
              Privacy <span className="text-gradient-green-blue">Policy</span>
            </h1>
            <p className="text-sm sm:text-base text-text-secondary mt-4 max-w-2xl mx-auto">
              Last updated: August 3, 2026. GitCric is committed to transparency. Here is how we handle user logs, API cache, and advertising cookies.
            </p>
          </div>

          <div className="flex flex-col gap-10 text-left">
            
            {/* Intro */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Overview</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                GitCric ("we", "our", or "us") provides a visual tool to render GitHub profile statistics as cricket playing cards. This Privacy Policy details how we handle the information collected from you when using our website located at <a href="https://www.gitcric.me" className="text-green-core hover:underline">https://www.gitcric.me</a>.
              </p>
            </div>

            {/* Section 1: Data We Collect */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-glow border border-blue-core/20 flex items-center justify-center text-blue-core shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">1. Sourced Information</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                To build your player card, we query public statistics about your developer account using the official GitHub GraphQL API.
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-2 text-xs text-text-secondary">
                <li>
                  <strong className="text-text-primary">Profile Credentials:</strong> We retrieve your public username, name, avatar picture URL, bio statement, country, and organization company details.
                </li>
                <li>
                  <strong className="text-text-primary">Activity Metrics:</strong> We pull numerical commit totals, pull requests merged, issues closed, streaks, and repository stars count.
                </li>
                <li>
                  <strong className="text-text-primary">OAuth Details:</strong> If you choose to log in using GitHub OAuth, we receive a read-only identity token processed securely via Supabase. We do NOT ask for or store passwords.
                </li>
              </ul>
              <p className="text-xs text-text-secondary italic">
                Note: Profile metrics are cached on our servers for up to 24 hours to reduce rate limits, after which they are refreshed on demand.
              </p>
            </div>

            {/* Section 2: Advertising Cookies & Partners (AdSense Mandated) */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">2. Advertising & Cookies</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                We implement Google AdSense to serve advertisements on our web pages. To serve customized ads, Google and other third-party vendors use technical cookies.
              </p>
              <div className="p-4 bg-bg-surface-2/45 rounded-xl border border-border-hairline flex flex-col gap-3">
                <h4 className="text-xs font-black uppercase text-green-core">Google AdSense Disclosures:</h4>
                <ul className="list-disc pl-5 flex flex-col gap-2 text-xs text-text-secondary leading-relaxed">
                  <li>
                    Third-party vendors, including Google, use cookies to serve ads based on your prior visits to GitCric or other sites on the Internet.
                  </li>
                  <li>
                    Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
                  </li>
                  <li>
                    You can opt out of personalized advertising by visiting your Google <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-core hover:underline font-bold">Ads Settings</a> page.
                  </li>
                  <li>
                    Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-core hover:underline font-bold">aboutads.info</a>.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 3: Web Analytics & Logs */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-glow border border-blue-core/20 flex items-center justify-center text-blue-core shrink-0">
                  <Settings2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">3. Web Analytics</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                We use Google Analytics to analyze website traffic, session durations, and page performance. These analytics tools utilize cookies to log anonymous usage patterns. We do not correlate analytical details with GitHub personal identifiers.
              </p>
            </div>

            {/* Section 4: Data Security & Controls */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">4. Data Deletion & User Choice</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                You have full control over your card information. If you wish to delete your cached player records, saved bookmarks, or account details from GitCric, please send an email to <a href="mailto:support@gitcric.me" className="text-green-core hover:underline">support@gitcric.me</a> with your GitHub username. We will wipe all associated cache history databases from our records within 24 hours.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
