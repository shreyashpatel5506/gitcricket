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

            {/* Open Source / Contributing Section */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-bg-surface-1/50 to-blue-glow/5">
              <div className="flex flex-col gap-2 text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-core">
                  Open Source
                </span>
                <h3 className="text-xl font-bold uppercase tracking-wider">
                  Contribute to GitCric
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-lg">
                  GitCric is a 100% open-source community project. We welcome developer contributions—whether it's adding new player card skins, improving stats mapping, expanding country/city location translations, or fixing bugs!
                </p>
              </div>
              <a 
                href="https://github.com/shreyashpatel5506/gitcricket"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-core hover:bg-blue-core/90 text-xs font-bold text-text-primary transition-colors shrink-0"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Join on GitHub</span>
              </a>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
