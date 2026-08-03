'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBox from '@/components/SearchBox';
import PreviewCard from '@/components/PreviewCard';
import { 
  GitCommit, GitPullRequest, Star, Flame, ShieldCheck, 
  GitFork, CalendarRange, Code, Sparkles, ArrowRight, Trophy
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative isolate overflow-hidden py-20 lg:py-32">
          {/* Ambient floodlight background effects & Cricket Animation */}
          <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-core/10 blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/3 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-core/5 blur-[100px]"></div>

          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
              
              {/* Left Column: CTA */}
              <div className="flex flex-col gap-6 text-center lg:text-left lg:col-span-7">
                
                {/* Eyebrow */}
                <div className="inline-flex items-center justify-center lg:justify-start gap-1.5">
                  <span className="rounded-full bg-green-glow px-3 py-1 text-xs font-semibold text-green-core border border-green-core/20 tracking-wider uppercase">
                    Your GitHub. Your Innings.
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                  Turn your GitHub Profile into a <span className="text-gradient-green-blue">Cricket Player Card</span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-text-secondary leading-relaxed">
                  GitCric maps your developer activity—commits, issues, pull requests, streaks, and languages—into custom, premium cricket player cards with custom ratings and themes.
                </p>

                {/* Autocomplete Input */}
                <div className="mt-4 flex justify-center lg:justify-start">
                  <SearchBox />
                </div>

                {/* Trusted banner */}
                <p className="text-xs font-semibold text-text-tertiary tracking-wide uppercase mt-4">
                  ⚡ 100% Secure, Read-Only Public API Access
                </p>
              </div>

              {/* Right Column: Rotating Card visual */}
              <div className="flex justify-center lg:col-span-5">
                <PreviewCard />
              </div>

            </div>
          </div>
        </section>

        {/* How It Works horizontal timeline */}
        <section id="explainers" className="py-20 border-y border-border-hairline bg-bg-surface-1/30">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">How the Innings Works</h2>
              <p className="text-text-secondary text-sm sm:text-base mt-2">Generate your ultimate stats card in three simple steps.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 hover:border-green-core/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-glow border border-green-core/20 text-green-core font-mono font-bold">1</div>
                <h3 className="text-lg font-bold">Enter Username</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Type any valid public GitHub username. No signups or token entries required for public cards.</p>
              </div>

              {/* Step 2 */}
              <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 hover:border-blue-core/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-glow border border-blue-core/20 text-blue-core font-mono font-bold">2</div>
                <h3 className="text-lg font-bold">We Scrape & Transform</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Our scraper fetches GraphQL stats. Commits become Runs, Streaks become Form, and Closed Issues become Wickets.</p>
              </div>

              {/* Step 3 */}
              <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 hover:border-green-core/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-glow border border-green-core/20 text-green-core font-mono font-bold">3</div>
                <h3 className="text-lg font-bold">Get Your Card</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Get a generated 3D player card. Switch card skins, view unlockable achievements, and download a PNG to share.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Stats Explainer mapping layout */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">GitHub to Cricket Translation</h2>
              <p className="text-text-secondary text-sm sm:text-base mt-2">See how our rating engine maps your coding profile to cricket statistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              
              {/* Mapping 1 */}
              <div className="glass-panel flex items-center justify-between p-6 rounded-xl hover:bg-bg-surface-2 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-bg-surface-2 rounded-lg text-text-secondary border border-border-hairline">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Commits</span>
                    <span className="text-sm font-bold">Total Activity</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary" />
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-[#F4D06F] font-bold uppercase tracking-wider">Runs</span>
                    <span className="text-sm font-bold text-[#F4D06F]">Batting Power</span>
                  </div>
                  <div className="p-3 bg-bg-surface-2 rounded-lg border border-[#F4D06F]/20 text-[#F4D06F]">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Mapping 2 */}
              <div className="glass-panel flex items-center justify-between p-6 rounded-xl hover:bg-bg-surface-2 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-bg-surface-2 rounded-lg text-text-secondary border border-border-hairline">
                    <GitPullRequest className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">PRs Merged</span>
                    <span className="text-sm font-bold">Code Changes</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary" />
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-green-core font-bold uppercase tracking-wider">Innings</span>
                    <span className="text-sm font-bold text-green-core">Match Winners</span>
                  </div>
                  <div className="p-3 bg-bg-surface-2 rounded-lg border border-green-core/20 text-green-core">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Mapping 3 */}
              <div className="glass-panel flex items-center justify-between p-6 rounded-xl hover:bg-bg-surface-2 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-bg-surface-2 rounded-lg text-text-secondary border border-border-hairline">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Stars Given</span>
                    <span className="text-sm font-bold">Popular Repos</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary" />
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-[#FF3D9A] font-bold uppercase tracking-wider">Sixes</span>
                    <span className="text-sm font-bold text-[#FF3D9A]">Spectator Hits</span>
                  </div>
                  <div className="p-3 bg-bg-surface-2 rounded-lg border border-[#FF3D9A]/20 text-[#FF3D9A]">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Mapping 4 */}
              <div className="glass-panel flex items-center justify-between p-6 rounded-xl hover:bg-bg-surface-2 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-bg-surface-2 rounded-lg text-text-secondary border border-border-hairline">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">Active Streak</span>
                    <span className="text-sm font-bold">Daily Momentum</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary" />
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-blue-core font-bold uppercase tracking-wider">Current Form</span>
                    <span className="text-sm font-bold text-blue-core">Match Fitness</span>
                  </div>
                  <div className="p-3 bg-bg-surface-2 rounded-lg border border-blue-core/20 text-blue-core">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Metric and Format Rules Explanation Section */}
        <section id="rules" className="py-20 border-t border-border-hairline bg-bg-surface-1/10">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="rounded-full bg-blue-glow px-3 py-1 text-xs font-semibold text-blue-core border border-blue-core/20 tracking-wider uppercase">
                THE RULE BOOK
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider mt-4">Understanding the Calculations & Formats</h2>
              <p className="text-text-secondary text-sm sm:text-base mt-2">
                GitCric analyzes commits, PRs, and issues across your entire GitHub career to build your rating index.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
              
              {/* Box 1: Core Rating Index Calculations */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 text-left">
                <h3 className="text-lg font-bold text-[#F4D06F] uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Score Rating Formulas
                </h3>
                <div className="h-px bg-border-hairline w-full my-1"></div>
                <ul className="flex flex-col gap-3 text-xs text-text-secondary leading-relaxed">
                  <li>
                    <strong className="text-text-primary uppercase">Career Runs:</strong> Calculated as the sum of all commits (including private repositories if you sign in), merged pull requests, closed issues, and stars earned.
                  </li>
                  <li>
                    <strong className="text-text-primary uppercase">Strike Rate (BAT):</strong> Determined as `(total_commits / active_age_days) * 100`, representing how frequently you commit to codebase streams.
                  </li>
                  <li>
                    <strong className="text-text-primary uppercase">Bowling Control (BOWL):</strong> Evaluated based on total closed issues and repository forks, mapping code maintenance capabilities.
                  </li>
                  <li>
                    <strong className="text-text-primary uppercase">Fielding Stamina (FLD):</strong> Driven by PR reviews and code review contributions to collaborative repos.
                  </li>
                  <li>
                    <strong className="text-text-primary uppercase">Dynamic Overall (OVR):</strong> Computed as a weighted average of your attributes. The weights scale dynamically depending on your determined player role (e.g. Captain, Anchor, Finisher, All-Rounder).
                  </li>
                </ul>
              </div>

              {/* Box 2: Match Formats & Criteria */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 text-left">
                <h3 className="text-lg font-bold text-green-core uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Match Format Formats & Criteria
                </h3>
                <div className="h-px bg-border-hairline w-full my-1"></div>
                <div className="flex flex-col gap-4 text-xs font-medium">
                  
                  {/* Format A */}
                  <div className="flex flex-col gap-1">
                    <span className="text-text-primary font-bold uppercase tracking-wider text-xs">🏏 ODI Format (Balanced Game)</span>
                    <p className="text-text-secondary leading-relaxed">
                      <strong>Qualification:</strong> Open to all developers. Computes balanced overall averages across all coding attributes. Renders cards in navy-blue World Cup gradients.
                    </p>
                  </div>

                  {/* Format B */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[#FF3D9A] font-bold uppercase tracking-wider text-xs">⚡ T20 Format (Aggressive Power)</span>
                    <p className="text-text-secondary leading-relaxed">
                      <strong>Qualification:</strong> Requires **15+ GitHub Stars**. Focuses heavily on Batting Power (stars) and Fitness (active commit streaks). Renders cards in bright neon-orange glow skins.
                    </p>
                  </div>

                  {/* Format C */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[#F4D06F] font-bold uppercase tracking-wider text-xs">⏳ Test Format (Endurance & Grit)</span>
                    <p className="text-text-secondary leading-relaxed">
                      <strong>Qualification:</strong> Requires **75+ Experience** OR **500+ Career Runs**. Amplifies Technique (PR ratio) and Experience (GitHub career age). Renders cards in Lord's whites and maroon.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
