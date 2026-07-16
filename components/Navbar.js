'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, User, LogOut, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch active session on mount
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.warn('Navbar check auth session error:', err);
      }
    };
    fetchSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (err) {
      console.error('OAuth trigger error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out trigger error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-border-hairline bg-bg-glass/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold tracking-tight">
          <span className="text-gradient-green-blue">GitCric</span>
          <span className="hidden text-[10px] font-semibold text-text-tertiary sm:inline-block border border-border-hairline px-1.5 py-0.5 rounded">v1.0</span>
        </Link>

        {/* Center: Dynamic Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/leagues" className="text-sm font-medium text-text-secondary hover:text-green-core transition-colors">
            Leagues
          </Link>
          <a href="#explainers" className="text-sm font-medium text-text-secondary hover:text-green-core transition-colors">
            How it Works
          </a>
          <a href="#explainers" className="text-sm font-medium text-text-secondary hover:text-green-core transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-green-core" />
            Modes & Criteria
          </a>
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/shreyashpatel5506/gitcricket"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-border-hairline px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-[#F4D06F] hover:border-[#F4D06F]/40 hover:bg-bg-surface-2 transition-all active:scale-95 cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-[#F4D06F]/20 text-[#F4D06F]" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Avatar / Locker Link */}
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 rounded-lg bg-bg-surface-2 border border-border-hairline px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-all active:scale-95"
              >
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || "profile"} 
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span>Locker Room</span>
              </Link>
              
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-surface-2 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex h-9 items-center justify-center rounded-lg border border-border-hairline px-4 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 transition-all cursor-pointer"
            >
              Connect GitHub
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
