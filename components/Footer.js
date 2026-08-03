'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border-hairline bg-bg-surface-1/40 py-12 text-xs text-text-tertiary mt-auto">
      <div className="mx-auto max-w-7xl px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left: Brand Logo & Mission */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight text-text-primary hover:opacity-90 transition-opacity">
            <span className="text-gradient-green-blue">GitCric</span>
          </Link>
          <p className="text-center md:text-left max-w-sm text-text-secondary">
            Convert your GitHub contributions, commit streaks, and repositories into custom, interactive cricket player cards.
          </p>
        </div>

        {/* Center: Essential Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-medium text-text-secondary">
          <Link href="/about" className="hover:text-green-core transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-green-core transition-colors">
            Contact Us
          </Link>
          <Link href="/privacy" className="hover:text-green-core transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-green-core transition-colors">
            Terms of Service
          </Link>
          <Link href="/leagues" className="hover:text-green-core transition-colors">
            Leagues
          </Link>
        </nav>

        {/* Right: Copyright Information */}
        <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right">
          <p>© {new Date().getFullYear()} GitCric. All rights reserved.</p>
          <p className="text-text-tertiary">
            Data parsed securely from GitHub GraphQL API.
          </p>
        </div>

      </div>
    </footer>
  );
}
