'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import { 
  Trophy, Shield, Users, Award, Star, User, Flame, 
  MapPin, Globe, BookOpen, Loader2, ArrowLeft, ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface League {
  id: string;
  name: string;
  code: string;
  description: string;
  governing_body: string;
}

interface Season {
  id: string;
  name: string;
  is_active: boolean;
}

interface Team {
  id: string;
  name: string;
  short_name: string;
}

interface Card {
  id: string;
  overall: number;
  player_role: string;
  github_profile_cache: {
    github_username: string;
    name: string;
    avatar_url: string;
    country: string;
    city: string;
    primary_language: string;
  };
  teams: {
    id: string;
    name: string;
    short_name: string;
  } | null;
}

export default function LeagueDashboard() {
  const { code } = useParams();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [league, setLeague] = useState<League | null>(null);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  
  // Ranks tab and filtering states
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'teams' | 'awards'>('overview');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);

        // 1. Resolve League by code
        const { data: leagueData } = await supabase
          .from('leagues')
          .select('*')
          .eq('code', code)
          .maybeSingle();

        if (!leagueData) return;
        setLeague(leagueData);

        // 2. Fetch active season for this league
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('*')
          .eq('league_id', leagueData.id)
          .eq('is_active', true)
          .maybeSingle();

        if (!seasonData) return;
        setActiveSeason(seasonData);

        // 3. Fetch teams
        const { data: teamsData } = await supabase
          .from('teams')
          .select('*')
          .eq('league_id', leagueData.id);
        setTeams(teamsData || []);

        // 4. Fetch enrolled cards linked to active season
        const { data: cardsData } = await supabase
          .from('generated_cards')
          .select(`
            id,
            overall,
            player_role,
            github_profile_cache (
              github_username,
              name,
              avatar_url,
              country,
              city,
              primary_language
            ),
            teams (
              id,
              name,
              short_name
            )
          `)
          .eq('season_id', seasonData.id)
          .order('overall', { ascending: false });

        // Map and validate structure
        const formattedCards = (cardsData || []).map((c: any) => ({
          id: c.id,
          overall: c.overall,
          player_role: c.player_role,
          github_profile_cache: c.github_profile_cache,
          teams: c.teams
        })) as Card[];

        setCards(formattedCards);

      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (code) {
      loadDashboardData();
    }
  }, [code]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-green-core animate-spin" />
          <p className="text-xs text-text-tertiary">Loading tournament dashboard...</p>
        </div>
      </div>
    );
  }

  if (!league || !activeSeason) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Trophy className="w-16 h-16 text-text-tertiary" />
          <h2 className="text-lg font-black uppercase tracking-wider">Tournament Not Active</h2>
          <Link href="/leagues" className="px-4 py-2 bg-bg-surface-2 border border-border-hairline rounded-lg text-xs font-bold hover:bg-bg-surface-1 transition-colors">
            Back to Leagues
          </Link>
        </div>
      </div>
    );
  }

  // Filter cards based on user selections
  const filteredCards = cards.filter(card => {
    const matchesTeam = selectedTeamFilter === 'all' || card.teams?.id === selectedTeamFilter;
    const matchesRole = selectedRoleFilter === 'all' || card.player_role.toLowerCase() === selectedRoleFilter.toLowerCase();
    return matchesTeam && matchesRole;
  });

  const topThree = filteredCards.slice(0, 3);

  const hasFranchiseTeams = teams.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      <Navbar />

      {/* Hero Header */}
      <header className="border-b border-border-hairline py-8 bg-bg-surface-1/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Link href="/leagues" className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black uppercase tracking-wider">{league.name}</h1>
                <p className="text-xs text-text-secondary mt-1">
                  Governing Body: <span className="font-bold text-text-primary">{league.governing_body}</span> • Season: <span className="text-green-core font-bold">{activeSeason.name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="px-4 py-2.5 rounded-xl bg-bg-surface-2 border border-border-hairline flex flex-col gap-0.5">
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Players</span>
                <span className="text-sm font-black">{cards.length}</span>
              </div>
              {hasFranchiseTeams && (
                <div className="px-4 py-2.5 rounded-xl bg-bg-surface-2 border border-border-hairline flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Franchises</span>
                  <span className="text-sm font-black">{teams.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <nav className="border-b border-border-hairline bg-bg-void">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center gap-6">
          {(['overview', 'leaderboard', hasFranchiseTeams ? 'teams' : null, 'awards'].filter(Boolean) as string[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'border-green-core text-green-core' 
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content grid */}
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {/* Description Panel */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-3">About the Tournament</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {league.description}
                  </p>
                </div>

                {/* Top 3 Podium Renders */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-green-core animate-pulse" /> Tournament Podium
                  </h3>
                  
                  {topThree.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 items-end pt-6">
                      {/* 2nd place */}
                      {topThree[1] && (
                        <div className="flex flex-col items-center gap-2">
                          <img src={topThree[1].github_profile_cache?.avatar_url} alt="2nd" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-white/10" />
                          <span className="text-[10px] font-bold text-text-secondary truncate max-w-[80px]">{topThree[1].github_profile_cache?.name}</span>
                          <div className="w-full bg-white/5 border border-white/5 rounded-t-lg h-20 flex flex-col items-center justify-center text-xs font-bold text-text-tertiary">
                            <span>2nd</span>
                            <span className="text-[10px] text-green-core mt-1">{topThree[1].overall} OVR</span>
                          </div>
                        </div>
                      )}

                      {/* 1st place */}
                      {topThree[0] && (
                        <div className="flex flex-col items-center gap-2">
                          <img src={topThree[0].github_profile_cache?.avatar_url} alt="1st" className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border-2 border-green-core/55 shadow-[0_0_15px_rgba(23,232,143,0.15)]" />
                          <span className="text-[10px] font-extrabold text-text-primary truncate max-w-[80px]">{topThree[0].github_profile_cache?.name}</span>
                          <div className="w-full bg-green-glow border border-green-core/20 rounded-t-lg h-28 flex flex-col items-center justify-center text-xs font-black text-green-core">
                            <Award className="w-4 h-4 mb-1" />
                            <span>1st</span>
                            <span className="text-[10px] mt-1">{topThree[0].overall} OVR</span>
                          </div>
                        </div>
                      )}

                      {/* 3rd place */}
                      {topThree[2] && (
                        <div className="flex flex-col items-center gap-2">
                          <img src={topThree[2].github_profile_cache?.avatar_url} alt="3rd" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-white/10" />
                          <span className="text-[10px] font-bold text-text-secondary truncate max-w-[80px]">{topThree[2].github_profile_cache?.name}</span>
                          <div className="w-full bg-white/5 border border-white/5 rounded-t-lg h-14 flex flex-col items-center justify-center text-xs font-bold text-text-tertiary">
                            <span>3rd</span>
                            <span className="text-[10px] text-green-core mt-1">{topThree[2].overall} OVR</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-text-tertiary">No cards enrolled yet.</div>
                  )}
                </div>
              </div>

              {/* Side rules details */}
              <div className="flex flex-col gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-4">Ecosystem Rules</h3>
                  <ul className="text-xs text-text-secondary flex flex-col gap-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-core shrink-0 mt-0.5" />
                      <span>One active team selection per user per season.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-core shrink-0 mt-0.5" />
                      <span>Statistics are calculated directly from active commits, stars, and review logs.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="flex flex-col gap-6 text-left">
              
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-4 py-4 border-b border-border-hairline">
                {hasFranchiseTeams && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-text-tertiary font-bold uppercase tracking-wider">Franchise Filter</span>
                    <select
                      value={selectedTeamFilter}
                      onChange={(e) => setSelectedTeamFilter(e.target.value)}
                      className="bg-bg-surface-2 border border-border-hairline px-3 py-1.5 text-xs rounded-lg outline-none focus:border-green-core/30 text-text-secondary"
                    >
                      <option value="all">All Teams</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.short_name} - {t.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-text-tertiary font-bold uppercase tracking-wider">Role Division</span>
                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    className="bg-bg-surface-2 border border-border-hairline px-3 py-1.5 text-xs rounded-lg outline-none focus:border-green-core/30 text-text-secondary"
                  >
                    <option value="all">All Roles</option>
                    <option value="batsman">Batsmen</option>
                    <option value="bowler">Bowlers</option>
                    <option value="all-rounder">All Rounders</option>
                    <option value="wicket-keeper">Wicket Keepers</option>
                    <option value="captain">Captains</option>
                  </select>
                </div>
              </div>

              {/* Ranks List Table */}
              <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-hairline bg-white/2 text-[10px] text-text-tertiary uppercase tracking-wider font-black">
                      <th className="py-3 px-4 text-center">Rank</th>
                      <th className="py-3 px-4">Player</th>
                      <th className="py-3 px-4">Role</th>
                      {hasFranchiseTeams ? <th className="py-3 px-4">Team</th> : <th className="py-3 px-4">Country</th>}
                      <th className="py-3 px-4 text-center">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCards.map((card, idx) => {
                      const profile = card.github_profile_cache;
                      return (
                        <tr 
                          key={card.id} 
                          className="border-b border-border-hairline hover:bg-white/2 transition-colors text-xs text-text-secondary"
                        >
                          <td className="py-3.5 px-4 text-center font-black text-text-primary">
                            #{idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={profile?.avatar_url} alt="" className="h-8 w-8 rounded-lg border border-white/5" />
                              <div className="flex flex-col">
                                <span className="font-bold text-text-primary">{profile?.name || profile?.github_username}</span>
                                <span className="text-[10px] text-text-tertiary">@{profile?.github_username}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold uppercase text-[10px] tracking-wider text-green-core">
                            {card.player_role}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-text-primary">
                            {hasFranchiseTeams 
                              ? card.teams?.short_name || 'Free Agent' 
                              : profile?.country || 'Global'}
                          </td>
                          <td className="py-3.5 px-4 text-center font-black text-green-core text-sm">
                            {card.overall}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredCards.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-text-tertiary">
                          No players match the filter selection rules.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: TEAMS (If applicable) */}
          {activeTab === 'teams' && hasFranchiseTeams && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {teams.map((team) => {
                const teamMembers = cards.filter(c => c.teams?.id === team.id);
                const averageOVR = teamMembers.length > 0 
                  ? Math.round(teamMembers.reduce((acc, c) => acc + c.overall, 0) / teamMembers.length)
                  : 0;

                return (
                  <div key={team.id} className="glass-panel p-5 rounded-2xl border border-border-hairline flex flex-col justify-between">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-bg-surface-2 border border-border-hairline flex items-center justify-center text-green-core">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase text-text-primary">{team.short_name}</span>
                          <span className="text-[10px] text-text-tertiary font-bold tracking-wider uppercase leading-none mt-0.5">{team.name}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-white/2 p-3 rounded-xl border border-border-hairline">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] text-text-tertiary uppercase tracking-wider">Roster Size</span>
                          <span className="text-xs font-black text-text-primary">{teamMembers.length} Devs</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] text-text-terled tracking-wider uppercase">Team OVR</span>
                          <span className="text-xs font-black text-green-core">{averageOVR} OVR</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedTeamFilter(team.id);
                        setActiveTab('leaderboard');
                      }}
                      className="mt-6 w-full h-8 rounded-lg bg-bg-surface-2 border border-border-hairline flex items-center justify-center gap-1 text-[10px] font-bold text-text-secondary hover:text-text-primary hover:bg-bg-surface-1 transition-colors cursor-pointer"
                    >
                      View Roster <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: AWARDS */}
          {activeTab === 'awards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {/* Orange Cap */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#ff9800] bg-[#ff9800]/10 border border-[#ff9800]/25 px-2 py-0.5 rounded uppercase tracking-wider font-black">
                      Orange Cap
                    </span>
                    <Award className="w-5 h-5 text-[#ff9800]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-black uppercase text-text-primary">Tournament MVP</h4>
                    <p className="text-[10px] text-text-secondary">Assigned to the highest OVR rated developer inside the league standings.</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-hairline flex items-center gap-3">
                  {cards[0] ? (
                    <>
                      <img src={cards[0].github_profile_cache?.avatar_url} alt="" className="h-8 w-8 rounded-lg border border-white/5" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-text-primary">{cards[0].github_profile_cache?.name}</span>
                        <span className="text-[10px] text-green-core font-bold">{cards[0].overall} OVR</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-text-tertiary">No leader determined.</span>
                  )}
                </div>
              </div>

              {/* Purple Cap */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#9c27b0] bg-[#9c27b0]/10 border border-[#9c27b0]/25 px-2 py-0.5 rounded uppercase tracking-wider font-black">
                      Purple Cap
                    </span>
                    <Award className="w-5 h-5 text-[#9c27b0]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-black uppercase text-text-primary">Best Bowler</h4>
                    <p className="text-[10px] text-text-secondary">Assigned to the highest rated player classified under the Bowler division.</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-hairline flex items-center gap-3">
                  {cards.find(c => c.player_role.toLowerCase() === 'bowler') ? (
                    (() => {
                      const bowler = cards.find(c => c.player_role.toLowerCase() === 'bowler')!;
                      return (
                        <>
                          <img src={bowler.github_profile_cache?.avatar_url} alt="" className="h-8 w-8 rounded-lg border border-white/5" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-text-primary">{bowler.github_profile_cache?.name}</span>
                            <span className="text-[10px] text-green-core font-bold">{bowler.overall} OVR</span>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <span className="text-xs text-text-tertiary">No leader determined.</span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
