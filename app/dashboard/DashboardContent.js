'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PlayerCard from '@/components/PlayerCard';
import { createClient } from '@/lib/supabase/client';
import { 
  LogOut, Star, History, User, 
  Sparkles, Trophy, ExternalLink, Trash2 
} from 'lucide-react';

export default function DashboardContent({ profile, ownCard, savedCards, searchHistory }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleRemoveBookmark = async (cardId, e) => {
    e.preventDefault(); // prevent navigation
    e.stopPropagation();
    try {
      const response = await fetch(`/api/cards/bookmark?cardId=${cardId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        router.refresh(); // reload server props to update list
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          
          {/* Welcome header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-hairline pb-6 mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider">Locker Room</h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage your credentials, view bookmarks, and check your latest stats.
              </p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-bg-surface-2 border border-border-hairline px-4 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-bg-surface-3 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            
            {/* Left Column: Personal Profile & Own Card */}
            <div className="lg:col-span-5 flex flex-col items-center gap-8">
              
              {/* Profile Card Summary */}
              <div className="w-full glass-panel p-6 rounded-2xl flex items-center gap-4">
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-14 h-14 rounded-full border border-border-hairline object-cover"
                />
                <div className="flex flex-col text-left">
                  <span className="text-base font-bold text-text-primary">{profile.full_name}</span>
                  <span className="text-xs text-text-secondary">@{profile.github_username}</span>
                </div>
              </div>

              {/* Own Generated Card */}
              <div className="flex flex-col items-center gap-4 w-full">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary flex items-center gap-1.5 self-start">
                  <User className="w-4 h-4 text-green-core" />
                  My Playing Card
                </h3>
                
                {ownCard ? (
                  <Link href={`/${profile.github_username}`} className="hover:scale-[1.01] transition-transform duration-300">
                    <PlayerCard profile={profile} card={ownCard} />
                  </Link>
                ) : (
                  <div className="w-full h-80 rounded-2xl border-2 border-dashed border-border-hairline flex flex-col items-center justify-center p-6 text-center gap-4 bg-bg-surface-1/25">
                    <Trophy className="w-10 h-10 text-text-tertiary/40" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-text-secondary">No Card Generated Yet</p>
                      <p className="text-xs text-text-tertiary">Scrape your credentials to deploy your custom player card!</p>
                    </div>
                    <Link
                      href={`/${profile.github_username}`}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-green-core px-5 text-xs font-bold text-bg-void hover:bg-green-core/90 transition-all"
                    >
                      Generate My Card
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Bookmarks & History lists */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              
              {/* Saved Cards Grid */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary flex items-center gap-1.5 self-start">
                  <Star className="w-4 h-4 text-blue-core fill-current" />
                  Saved Player Cards
                </h3>

                {savedCards && savedCards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedCards.map((bookmark) => {
                      const gc = bookmark.generated_cards;
                      const cache = gc?.github_profile_cache;
                      if (!gc || !cache) return null;
                      
                      return (
                        <Link 
                          key={bookmark.id}
                          href={`/${cache.github_username}`}
                          className="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-bg-surface-2 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={cache.avatar_url} 
                              alt={cache.name} 
                              className="w-10 h-10 rounded-full border border-border-hairline object-cover"
                            />
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-bold text-text-primary truncate max-w-[120px]">
                                @{cache.github_username}
                              </span>
                              <span className="text-[10px] text-text-tertiary uppercase font-semibold">
                                {gc.player_role}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-black text-green-core">
                              {gc.overall}
                            </span>
                            <button
                              onClick={(e) => handleRemoveBookmark(gc.id, e)}
                              className="p-1.5 rounded hover:bg-bg-surface-3 text-text-tertiary hover:text-error transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center gap-2 border border-dashed border-border-hairline">
                    <Star className="w-6 h-6 text-text-tertiary" />
                    <p className="text-xs font-bold text-text-secondary">No Favorites Bookmarked</p>
                    <p className="text-[11px] text-text-tertiary">Scanned cards will appear here once saved.</p>
                  </div>
                )}
              </div>

              {/* Recent Search history */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary flex items-center gap-1.5 self-start">
                  <History className="w-4 h-4 text-text-tertiary" />
                  Recent Scans
                </h3>

                {searchHistory && searchHistory.length > 0 ? (
                  <div className="glass-panel rounded-2xl overflow-hidden border border-border-hairline divide-y divide-border-hairline text-left">
                    {searchHistory.map((log) => (
                      <Link 
                        key={log.id} 
                        href={`/${log.github_username}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-bg-surface-2 transition-colors group"
                      >
                        <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary">
                          @{log.github_username}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-text-tertiary">
                            {new Date(log.searched_at).toLocaleDateString()}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-text-tertiary group-hover:text-green-core opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center gap-2 border border-dashed border-border-hairline">
                    <History className="w-6 h-6 text-text-tertiary" />
                    <p className="text-xs font-bold text-text-secondary">Search History is Empty</p>
                    <p className="text-[11px] text-text-tertiary">Your search activity logs will display here.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
