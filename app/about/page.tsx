import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trophy, ShieldCheck, Code2, Sparkles, Heart } from 'lucide-react';

export const metadata = {
  title: "About Us — GitCric",
  description: "Learn about the mission, scoring formula, and developer-first design behind GitCric, the platform that transforms your GitHub metrics into cricket player cards.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="rounded-full bg-green-glow px-3 py-1 text-xs font-semibold text-green-core border border-green-core/20 tracking-wider uppercase">
              Who We Are
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider mt-4 leading-tight">
              About <span className="text-gradient-green-blue">GitCric</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
              Merging the passion of developer metrics with the legacy of cricket scorecards. We turn git logs into visual, interactive player cards.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            
            {/* Mission Section */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col md:flex-row gap-8 items-start">
              <div className="h-12 w-12 rounded-xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold uppercase tracking-wider">Our Mission</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Developers put massive energy into maintaining codebases, reviewing commits, and pushing pull requests daily, yet this effort is often hidden behind standard green squares. GitCric is created to celebrate open-source developers by gamifying active profile stats into custom 3D cricket player cards.
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  We believe coding is a game of strategy, endurance, and teamwork. By translating code habits into runs, wickets, and strike rates, we help you showcase your professional developer persona in a format everyone can understand.
                </p>
              </div>
            </div>

            {/* Core Values / Platform Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-glow border border-blue-core/20 flex items-center justify-center text-blue-core mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider">Safe & Transparent</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  We care deeply about safety. GitCric requests no repository write access. We query only public statistics from the GitHub GraphQL API, ensuring your profile credentials and security remain 100% untouched.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core mb-2">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider">Engineered for Accuracy</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Our stats translation engine calculates values based on hard activity limits (e.g., active streak lengths, PR ratios, stars count, and repository size indexes). No random values, just structured ratings.
                </p>
              </div>

            </div>

            {/* How it Works / Algorithms Breakdown */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-glow border border-blue-core/20 flex items-center justify-center text-blue-core shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Inside the Rating Engine</h2>
              </div>
              
              <div className="h-px bg-border-hairline w-full"></div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-green-core mb-1">Runs & Average</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Mapped directly from your cumulative commits and contributions. A high commit count signifies endurance, translating into career runs.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-core mb-1">Bowling & Control</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Calculated from your issue closures and forks. Managing and closing bugs highlights control, yielding a strong bowling index.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#F4D06F] mb-1">Strike Rate (Batting)</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Represents contribution density over career days. Rapid, continuous project work reflects aggressive batting strength.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-bg-surface-2/45 rounded-xl border border-border-hairline flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-green-core shrink-0" />
                <p className="text-[11px] text-text-secondary">
                  Ready to test your rating index? Navigate back to the homepage, input any GitHub username, and generate your custom card instantly!
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
