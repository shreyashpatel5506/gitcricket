import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scale, ShieldAlert, Cpu, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: "Terms of Service — GitCric",
  description: "Review the Terms of Service for using GitCric, understanding profile card calculations, intellectual property rights, and disclaimer rules.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="rounded-full bg-blue-glow px-3 py-1 text-xs font-semibold text-blue-core border border-blue-core/20 tracking-wider uppercase">
              User Agreement
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider mt-4 leading-tight">
              Terms of <span className="text-gradient-green-blue">Service</span>
            </h1>
            <p className="text-sm sm:text-base text-text-secondary mt-4 max-w-2xl mx-auto">
              Last updated: August 3, 2026. By accessing or using GitCric, you agree to these Terms of Service. Please read them carefully.
            </p>
          </div>

          <div className="flex flex-col gap-10 text-left">
            
            {/* Section 1: Acceptance of Terms */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">1. Agreement to Terms</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                By entering a GitHub username or connecting an account via OAuth on GitCric (at <a href="https://www.gitcric.me" className="text-green-core hover:underline font-semibold">gitcric.me</a>), you verify that you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not access or use our services.
              </p>
            </div>

            {/* Section 2: Intellectual Property */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-glow border border-blue-core/20 flex items-center justify-center text-blue-core shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">2. Intellectual Property</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                The visual templates, card rating algorithm formulas, 3D card layout components, logo, website design, and custom theme layouts are the intellectual property of GitCric. 
              </p>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                You retain ownership of your underlying GitHub contribution data, usernames, and profile details. However, by generating a player card on GitCric, you grant us a worldwide, non-exclusive license to display your generated card publicly on our platform, search indices, and tournament leagues.
              </p>
            </div>

            {/* Section 3: Third Party Disclaimers */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">3. Service Limitations & Sourcing</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                GitCric fetches profile statistics via the public GitHub GraphQL API. Consequently:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-2 text-xs text-text-secondary">
                <li>
                  We do not guarantee the availability or accuracy of GitHub's API metrics.
                </li>
                <li>
                  Ratings and overall indices are calculations compiled for visual gamification and entertainment. They hold no official certification outside the GitCric ecosystem.
                </li>
                <li>
                  We reserve the right to prune or delete profile records and cache files to release system storage or address GitHub username updates.
                </li>
              </ul>
            </div>

            {/* Section 4: Limitation of Liability */}
            <div className="glass-panel p-8 rounded-2xl border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-glow border border-blue-core/20 flex items-center justify-center text-blue-core shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wider">4. Disclaimer of Warranties</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Our site and its contents are provided on an "as is" and "as available" basis without any warranty of any kind. Under no circumstances shall GitCric, its developers, or its contributors be held liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use this platform.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
