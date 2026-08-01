'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import { createClient } from '@/lib/supabase/client';
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
  const [isReadmeCopied, setIsReadmeCopied] = useState(false);
  const [isLinkedInSharing, setIsLinkedInSharing] = useState(false);
  
  // Match format selectors
  const [activeMode, setActiveMode] = useState('odi');

  // Bookmark/Favorite states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Authentication & Login Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
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
          setIsLoginModalOpen(true);
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
  // Share on LinkedIn
  const handleShareLinkedIn = async () => {
    const shareUrl = `${window.location.origin}/${profile.github_username.toLowerCase()}`;
    const shareText = `Check out my GitCric player card! 🏏\n\n` +
      `Overall: ${activeRatings.overall} OVR | Role: ${activeRatings.player_role || card.player_role}\n\n` +
      `Generate your scorecard here: ${shareUrl}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setIsLinkedInSharing(true);
      setTimeout(() => setIsLinkedInSharing(false), 2500);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }

    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  // Share on Twitter / X
  const handleShareTwitter = () => {
    const shareUrl = `${window.location.origin}/${profile.github_username.toLowerCase()}`;
    const shareText = `Check out my GitCric player card! 🏏\n\nOverall: ${activeRatings.overall} OVR | Role: ${activeRatings.player_role || card.player_role}\n`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=gitcric,github,cricket,dev`;
    window.open(twitterUrl, '_blank');
  };

  // Share on WhatsApp
  const handleShareWhatsApp = () => {
    const shareUrl = `${window.location.origin}/${profile.github_username.toLowerCase()}`;
    const shareText = `Check out my GitCric player card! 🏏\n\nOverall: ${activeRatings.overall} OVR | Role: ${activeRatings.player_role || card.player_role}\n\nView my card profile here: ${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Copy GitHub Profile README Badge
  const handleCopyReadme = async () => {
    const siteUrl = window.location.origin;
    const markdownText = `[![GitCric Player Card](${siteUrl}/api/og?username=${profile.github_username.toLowerCase()})](${siteUrl}/${profile.github_username.toLowerCase()})`;
    try {
      await navigator.clipboard.writeText(markdownText);
      setIsReadmeCopied(true);
      setTimeout(() => setIsReadmeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown badge:', err);
    }
  };

  // Copy Link to clipboard
  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/${profile.github_username.toLowerCase()}`;
      const shareText = `Check out my GitCric player card! 🏏\n` +
        `Name: @${profile.github_username}\n` +
        `Overall: ${activeRatings.overall} OVR\n` +
        `Role: ${activeRatings.player_role || card.player_role}\n` +
        `Stats: Batting ${activeRatings.batting} | Bowling ${activeRatings.bowling} | Technique ${activeRatings.technique} | Fitness ${activeRatings.fitness}\n\n` +
        `View profile: ${shareUrl}`;

      await navigator.clipboard.writeText(shareText);
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
                <div className="w-full border-t border-border-hairline pt-4 mt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3 text-center">
                    Share Scorecard
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {/* LinkedIn */}
                    <button
                      onClick={handleShareLinkedIn}
                      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border-hairline text-xs font-bold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 hover:text-white transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                      {isLinkedInSharing ? 'Text Copied!' : 'LinkedIn'}
                    </button>

                    {/* Twitter */}
                    <button
                      onClick={handleShareTwitter}
                      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border-hairline text-xs font-bold bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 hover:text-white transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter / X
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={handleShareWhatsApp}
                      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border-hairline text-xs font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-white transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.77.46 3.42 1.27 4.96L2 22l5.22-1.27c1.47.8 3.12 1.27 4.78 1.27C17.52 22 22 17.52 22 12.004 22 6.48 17.52 2 12.004 2zm0 1.66c4.61 0 8.35 3.74 8.35 8.34a8.35 8.35 0 0 1-8.35 8.34c-1.55 0-3.07-.43-4.39-1.24l-.32-.19-3.26.79.8-3.17-.21-.34A8.34 8.34 0 0 1 3.66 12c0-4.6 3.74-8.34 8.34-8.34zm-1.6 3.26c-.22 0-.46.05-.67.24-.26.24-1.02.99-1.02 2.42 0 1.44 1.05 2.83 1.2 3.03.15.2 2.02 3.08 4.9 4.32.69.29 1.22.47 1.64.6.69.22 1.32.19 1.82.11.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.57-.34l-2.7-1.33c-.3-.15-.52-.08-.7.13l-1.05 1.3c-.15.19-.38.23-.68.08-.3-.15-1.28-.47-2.44-1.51-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53l-.7-1.68c-.28-.68-.53-.55-.7-.56-.16-.01-.35-.01-.56-.01z"/>
                      </svg>
                      WhatsApp
                    </button>

                    {/* GitHub Markdown Badge */}
                    <button
                      onClick={handleCopyReadme}
                      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border-hairline text-xs font-bold bg-[#6e5494]/10 text-[#a28dc4] hover:bg-[#6e5494]/20 hover:text-white transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                      </svg>
                      {isReadmeCopied ? 'Badge Copied!' : 'GitHub Badge'}
                    </button>
                  </div>
                </div>
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
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        message="Please connect your GitHub account to bookmark player cards in your locker room."
      />
    </div>
  );
}
