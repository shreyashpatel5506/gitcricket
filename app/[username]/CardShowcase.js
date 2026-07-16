'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import PlayerCard from '@/components/PlayerCard';
import StatBar from '@/components/StatBar';
import { toPng } from 'html-to-image';
import { 
  Download, Link2, GitCommit, GitPullRequest, 
  Flame, Award, Trophy, ArrowLeft, Check, Sparkles, Star, Lock
} from 'lucide-react';

// Math recalculations for ODI, T20 and Test formats
function getRecalculatedRatings(baseCard, mode) {
  if (mode === 't20') {
    const batting = Math.min(99, Math.max(30, baseCard.batting + 5));
    const fitness = Math.min(99, Math.max(30, baseCard.fitness + 8));
    const experience = Math.min(99, Math.max(30, baseCard.experience - 10)); // minimized
    const technique = baseCard.technique;
    const overall = Math.round(0.60 * batting + 0.20 * fitness + 0.10 * technique + 0.10 * experience);
    return {
      ...baseCard,
      batting,
      fitness,
      experience,
      overall,
      player_role: 'T20 Blitz Opener'
    };
  }

  if (mode === 'test') {
    const technique = Math.min(99, Math.max(30, baseCard.technique + 6));
    const experience = Math.min(99, Math.max(30, baseCard.experience + 10));
    const batting = Math.max(30, baseCard.batting - 5);
    const fitness = Math.min(99, Math.max(30, baseCard.fitness + 3));
    const overall = Math.round(0.40 * technique + 0.30 * experience + 0.15 * batting + 0.15 * fitness);
    return {
      ...baseCard,
      technique,
      experience,
      batting,
      fitness,
      overall,
      player_role: 'Test Anchor Batsman'
    };
  }

  // Balanced default (ODI)
  return baseCard;
}

export default function CardShowcase({ profile, card, activeEnrollment = null, leagueRank = null }) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Match format selectors
  const [activeMode, setActiveMode] = useState('odi');

  // Bookmark/Favorite states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Eligibility conditions
  const isT20Eligible = (profile.total_stars || 0) >= 15;
  const isTestEligible = (card.experience || 0) >= 75 || (profile.contribution_count || 0) >= 500;

  // Resolve current active rates
  const activeRatings = getRecalculatedRatings(card, activeMode);

  // Check if this card is currently bookmarked
  useEffect(() => {
    async function checkBookmark() {
      try {
        const response = await fetch(`/api/cards/bookmark?cardId=${card.id}`);
        const result = await response.json();
        if (result.success) {
          setIsBookmarked(result.bookmarked);
        }
      } catch (err) {
        console.warn('Bookmark check status error:', err);
      }
    }
    if (card?.id) {
      checkBookmark();
    }
  }, [card?.id]);

  // Toggle Bookmark status
  const handleBookmarkToggle = async () => {
    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        const response = await fetch(`/api/cards/bookmark?cardId=${card.id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          setIsBookmarked(false);
        }
      } else {
        const response = await fetch('/api/cards/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: card.id })
        });
        const result = await response.json();
        if (result.success) {
          setIsBookmarked(true);
        } else if (response.status === 401) {
          alert('Please login to bookmark player cards!');
        }
      }
    } catch (err) {
      console.error('Bookmark toggle request error:', err);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Download Card as PNG Image
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      // Temporarily flatten card tilt transformation to prevent capture skew
      const originalTransform = cardRef.current.style.transform;
      cardRef.current.style.transform = 'none';

      // Brief pause for browser rendering thread to settle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution density
        style: {
          transform: 'none',
          borderRadius: '28px',
        },
      });

      // Restore tilt settings
      cardRef.current.style.transform = originalTransform;

      const link = document.createElement('a');
      link.download = `${profile.github_username.toLowerCase()}-${activeMode}-gitcric.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Halt screenshot capture:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Share on LinkedIn
  const handleShareLinkedIn = () => {
    const shareUrl = window.location.href;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  // Copy Link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-void text-text-primary">
      <Navbar />

      {/* Showcase area */}
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          
          {/* Back Navigation bar */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-green-core transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary">Share public URL:</span>
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded bg-bg-surface-1 border border-border-hairline px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-all active:scale-95"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-core" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            
            {/* Left Column: Player Card Visual & Downloader */}
            <div className="lg:col-span-5 flex flex-col items-center gap-6">
              
              {/* The 3D Foil Player Card */}
              <PlayerCard profile={profile} card={activeRatings} mode={activeMode} innerRef={cardRef} />

              {/* Action Buttons */}
              <div className="w-full max-w-xs flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-green-core text-bg-void text-sm font-bold hover:bg-green-core/90 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isDownloading ? (
                    <>Creating PNG Image...</>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Card PNG
                    </>
                  )}
                </button>
                <button
                  onClick={handleBookmarkToggle}
                  disabled={isBookmarking}
                  className={`w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-border-hairline text-sm font-bold transition-all active:scale-98 cursor-pointer ${
                    isBookmarked ? 'bg-bg-surface-2 text-[#F4D06F] border-[#B9862E]/40' : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-surface-1'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved to Dashboard' : 'Favorite Player Card'}
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-border-hairline text-sm font-bold bg-[#0A66C2]/15 text-[#0A66C2] hover:bg-[#0A66C2]/25 hover:text-white transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  Share on LinkedIn
                </button>
              </div>

            </div>

            {/* Right Column: Dynamic Statistics & Career Board */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Header profile details & rankings */}
              <div className="text-left border-b border-border-hairline pb-6 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black uppercase tracking-wider">{profile.name || profile.github_username}</h1>
                  <span className="rounded-full bg-blue-glow px-2.5 py-0.5 text-[10px] font-bold text-blue-core border border-blue-core/20">
                    OVR {activeRatings.overall}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#F4D06F] font-bold uppercase tracking-wider">
                  <Trophy className="w-4.5 h-4.5 fill-current text-[#F4D06F]" />
                  <span>Rank #{profile.rank} in {profile.country}</span>
                </div>
                <p className="text-sm text-text-secondary mt-2 max-w-xl italic">
                  {profile.bio || "This developer hasn't set a GitHub bio yet, but their metrics do the talking on the field."}
                </p>
              </div>

              {/* Active League Enrollment Badge */}
              {activeEnrollment ? (
                <div className="flex flex-col gap-2.5 p-4.5 rounded-2xl bg-green-glow border border-green-core/20 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4.5 h-4.5 text-green-core" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-green-core">Active Tournament Pro</span>
                    </div>
                    {leagueRank && (
                      <span className="text-xs font-black text-text-primary">
                        Rank #{leagueRank}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-text-primary uppercase tracking-wide">
                        {activeEnrollment.leagueName}
                      </span>
                      <span className="text-[10px] text-text-secondary mt-0.5">
                        Team: {activeEnrollment.teamShort || activeEnrollment.teamName} • Role: <span className="uppercase font-bold text-green-core">{activeEnrollment.role}</span>
                      </span>
                    </div>
                    <Link 
                      href={`/leagues/${activeEnrollment.leagueCode}`}
                      className="px-3.5 py-1.5 bg-green-core hover:bg-green-core/90 text-[10px] font-black text-bg-void rounded-lg transition-colors cursor-pointer"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4.5 rounded-2xl bg-bg-surface-2 border border-border-hairline text-left text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-text-primary">Not Enrolled in Leagues</span>
                    <span className="text-[10px] text-text-tertiary mt-0.5">This player is a free agent and hasn't registered for any active season.</span>
                  </div>
                  <Link 
                    href="/leagues"
                    className="px-4 py-2 bg-bg-surface-1 border border-border-hairline hover:bg-bg-surface-2 font-black rounded-xl text-[10px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Join League
                  </Link>
                </div>
              )}

              {/* Match Mode Tabs Selector */}
              <div className="flex flex-col gap-2 glass-panel p-4 rounded-xl border border-border-hairline text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Select Match Format Mode</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActiveMode('odi')}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeMode === 'odi' ? 'bg-blue-glow text-blue-core border border-blue-core/30' : 'bg-bg-surface-2 text-text-secondary hover:text-text-primary border border-transparent'
                    }`}
                  >
                    <span>ODI</span>
                  </button>

                  <button
                    onClick={() => isT20Eligible && setActiveMode('t20')}
                    disabled={!isT20Eligible}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all relative group cursor-pointer ${
                      !isT20Eligible ? 'opacity-40 cursor-not-allowed bg-bg-surface-1 text-text-tertiary' :
                      activeMode === 't20' ? 'bg-[#FF3D9A]/15 text-[#FF3D9A] border border-[#FF3D9A]/30' : 'bg-bg-surface-2 text-text-secondary hover:text-text-primary border border-transparent'
                    }`}
                  >
                    {!isT20Eligible && <Lock className="w-3.5 h-3.5 text-text-tertiary" />}
                    <span>T20</span>
                    {!isT20Eligible && (
                      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-40 rounded bg-bg-void border border-border-hairline p-2 text-center text-[10px] text-text-secondary shadow-lg z-50">
                        Requires 15+ GitHub Stars
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => isTestEligible && setActiveMode('test')}
                    disabled={!isTestEligible}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all relative group cursor-pointer ${
                      !isTestEligible ? 'opacity-40 cursor-not-allowed bg-bg-surface-1 text-text-tertiary' :
                      activeMode === 'test' ? 'bg-[#F4D06F]/15 text-[#F4D06F] border border-[#F4D06F]/30' : 'bg-bg-surface-2 text-text-secondary hover:text-text-primary border border-transparent'
                    }`}
                  >
                    {!isTestEligible && <Lock className="w-3.5 h-3.5 text-text-tertiary" />}
                    <span>TEST</span>
                    {!isTestEligible && (
                      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 rounded bg-bg-void border border-border-hairline p-2 text-center text-[10px] text-text-secondary shadow-lg z-50">
                        Requires 75+ Exp or 500+ Runs
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-ratings progress bars */}
              <div className="flex flex-col gap-5 glass-panel p-6 rounded-2xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-gradient-green-blue mb-2">Detailed Format Attributes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <StatBar label="Batting (Commits + Stars)" value={activeRatings.batting} />
                  <StatBar label="Bowling (Issues + Forks)" value={activeRatings.bowling} />
                  <StatBar label="Fielding (Reviews)" value={activeRatings.fielding} />
                  <StatBar label="Technique (PR/Commit Ratio)" value={activeRatings.technique} />
                  <StatBar label="Fitness (Streaks)" value={activeRatings.fitness} />
                  <StatBar label="Experience (Account Age)" value={activeRatings.experience} />
                </div>
              </div>

              {/* Stat Translation Dashboard Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Career Runs</span>
                  <p className="text-lg font-black text-text-primary mt-1 font-mono">{profile.contribution_count}</p>
                  <span className="text-[9px] text-text-tertiary uppercase font-medium">total contributions</span>
                </div>

                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Fan Following</span>
                  <p className="text-lg font-black text-[#F4D06F] mt-1 font-mono">{profile.followers}</p>
                  <span className="text-[9px] text-text-tertiary uppercase font-medium">github followers</span>
                </div>

                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Matches</span>
                  <p className="text-lg font-black text-text-primary mt-1 font-mono">{profile.public_repos}</p>
                  <span className="text-[9px] text-text-tertiary uppercase font-medium">repositories</span>
                </div>

                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Favorite Shot</span>
                  <p className="text-sm font-black text-green-core mt-2.5 truncate">{card.favorite_shot}</p>
                  <span className="text-[9px] text-text-tertiary uppercase font-medium">primary syntax</span>
                </div>

              </div>

              {/* Achievements Trophies */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-gradient-green-blue mb-4">Unlocked Innings Badges</h3>
                <div className="flex flex-wrap gap-4">
                  {profile.contribution_count >= 100 && (
                    <div className="flex items-center gap-2 rounded-lg bg-bg-surface-2 border border-border-hairline px-3.5 py-2">
                      <Trophy className="w-4 h-4 text-[#C88B54]" />
                      <span className="text-xs font-bold text-text-secondary">Century (100+ Runs)</span>
                    </div>
                  )}
                  {profile.contribution_count >= 500 && (
                    <div className="flex items-center gap-2 rounded-lg bg-bg-surface-2 border border-border-hairline px-3.5 py-2">
                      <Trophy className="w-4 h-4 text-[#F4D06F]" />
                      <span className="text-xs font-bold text-text-secondary">Half-K (500+ Runs)</span>
                    </div>
                  )}
                  {profile.total_stars >= 50 && (
                    <div className="flex items-center gap-2 rounded-lg bg-bg-surface-2 border border-border-hairline px-3.5 py-2">
                      <Flame className="w-4 h-4 text-[#38E1F2]" />
                      <span className="text-xs font-bold text-text-secondary">Hitman (50+ Stars)</span>
                    </div>
                  )}
                  {profile.current_streak >= 5 && (
                    <div className="flex items-center gap-2 rounded-lg bg-bg-surface-2 border border-border-hairline px-3.5 py-2">
                      <Award className="w-4 h-4 text-[#FF3D9A]" />
                      <span className="text-xs font-bold text-text-secondary">Daily Streak Form</span>
                    </div>
                  )}
                  {profile.contribution_count < 100 && (
                    <span className="text-xs text-text-tertiary italic">Keep coding and contributing to unlock achievements!</span>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
