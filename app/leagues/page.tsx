'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Trophy, Search, Users, ChevronRight, CheckCircle2, 
  X, Sparkles, Shield, User, Loader2, ArrowRight
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
  league_id: string;
  name: string;
  is_active: boolean;
}

interface Team {
  id: string;
  league_id: string;
  name: string;
  short_name: string;
}

export default function LeaguesPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Enrollment Funnel States
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [enrollStep, setEnrollStep] = useState<number>(1); // 1 = Team Selection, 2 = Role Selection, 3 = Submitting
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        const { data: leaguesData } = await supabase.from('leagues').select('*');
        setLeagues(leaguesData || []);

        const { data: seasonsData } = await supabase.from('seasons').select('*');
        setSeasons(seasonsData || []);

        const { data: teamsData } = await supabase.from('teams').select('*');
        setTeams(teamsData || []);

        if (session?.user) {
          const { data: enrollmentsData } = await supabase
            .from('league_enrollments')
            .select('season_id')
            .eq('user_id', session.user.id);
          
          setEnrollments(enrollmentsData?.map(e => e.season_id) || []);
        }
      } catch (err) {
        console.error('Failed to load leagues:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleJoinClick = (league: League) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    
    const leagueTeams = teams.filter(t => t.league_id === league.id);
    setSelectedLeague(league);
    setError('');
    setSuccess(false);
    setSelectedTeamId('');
    setSelectedRole('');

    if (leagueTeams.length > 0) {
      setEnrollStep(1); // Needs team selection first
    } else {
      setEnrollStep(2); // Skip team selection (international/ICC tournament)
    }
  };

  const submitEnrollment = async () => {
    if (!selectedLeague || !selectedRole) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/leagues/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leagueId: selectedLeague.id,
          teamId: selectedTeamId || null,
          role: selectedRole
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        const activeSeason = seasons.find(s => s.league_id === selectedLeague.id && s.is_active);
        if (activeSeason) {
          setEnrollments(prev => [...prev, activeSeason.id]);
        }
        setTimeout(() => {
          setSelectedLeague(null);
        }, 1500);
      } else {
        setError(result.error || 'Failed to enroll');
      }
    } catch (err) {
      console.error('Error during enrollment:', err);
      setError('Internal server connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group leagues by governing body
  const governingBodies = ['ICC', 'BCCI', 'Cricket Australia', 'ECB', 'PCB'];

  const getLeaguesByBody = (body: string) => {
    return filteredLeagues.filter(l => l.governing_body === body);
  };

  const filteredLeagues = leagues.filter(league => {
    return league.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           league.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="rounded-full bg-green-glow px-3 py-1 text-xs font-semibold text-green-core border border-green-core/20 tracking-wider uppercase">
              GitCric Ecosystem
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider mt-4">
              Tournaments & Leagues
            </h1>
            <p className="text-sm sm:text-base text-text-secondary mt-2">
              Explore independent leagues grouped by governing bodies. Choose your cricket role and compete for dynamic regional rankings.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-12">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-text-tertiary" />
            </span>
            <input
              type="text"
              placeholder="Search tournaments by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-bg-surface-1 border border-border-hairline outline-none focus:border-green-core/40 transition-colors shadow-sm"
            />
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-green-core animate-spin" />
              <p className="text-xs text-text-tertiary">Loading tournament directory...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {governingBodies.map((body) => {
                const bodyLeagues = getLeaguesByBody(body);
                if (bodyLeagues.length === 0) return null;

                return (
                  <div key={body} className="flex flex-col gap-6">
                    {/* Governing Body Header */}
                    <div className="flex items-center gap-2 border-b border-border-hairline pb-3">
                      <div className="h-2 w-2 rounded-full bg-green-core" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-text-secondary">
                        {body} Tournaments
                      </h2>
                    </div>

                    {/* Leagues Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {bodyLeagues.map((league) => {
                        const activeSeason = seasons.find(s => s.league_id === league.id && s.is_active);
                        const isUserEnrolled = activeSeason ? enrollments.includes(activeSeason.id) : false;
                        
                        return (
                          <div 
                            key={league.id} 
                            className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-green-core/20 transition-all hover:scale-[1.01] duration-300"
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-xl bg-bg-surface-2 border border-border-hairline flex items-center justify-center text-green-core shadow-inner">
                                  <Trophy className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                  <h3 className="text-xs font-black uppercase tracking-wide text-text-primary">
                                    {league.name}
                                  </h3>
                                  <span className="text-[9px] text-text-tertiary font-bold tracking-wider uppercase mt-0.5">
                                    {activeSeason?.name || 'Off-season'}
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-text-secondary leading-relaxed min-h-[60px]">
                                {league.description}
                              </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border-hairline flex flex-col gap-4">
                              <div className="flex items-center gap-2">
                                {isUserEnrolled ? (
                                  <button
                                    disabled
                                    className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-bg-surface-2 border border-border-hairline text-[11px] font-bold text-text-tertiary"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-green-core" />
                                    Registered
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleJoinClick(league)}
                                    className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-green-core hover:bg-green-core/90 text-[11px] font-bold text-bg-void transition-colors cursor-pointer"
                                  >
                                    Join League
                                  </button>
                                )}
                                
                                <Link 
                                  href={`/leagues/${league.code}`}
                                  className="h-10 px-3.5 rounded-xl border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 transition-colors cursor-pointer text-xs" 
                                  title="League Dashboard"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Enrollment Funnel Modal */}
      {selectedLeague && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-void/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass-panel bg-bg-surface-1/97 border border-border-hairline p-6 shadow-2xl relative">
            
            <button 
              onClick={() => setSelectedLeague(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Steps Indicator */}
            <div className="flex items-center gap-1.5 mb-6 text-[10px] font-black uppercase tracking-wider text-text-tertiary">
              <span className={enrollStep >= 1 ? 'text-green-core' : ''}>1. Team</span>
              <ChevronRight className="w-3 h-3" />
              <span className={enrollStep >= 2 ? 'text-green-core' : ''}>2. Role</span>
              <ChevronRight className="w-3 h-3" />
              <span>3. Confirm</span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-xs font-semibold text-error">
                {error}
              </div>
            )}

            {/* STEP 1: Franchise Team Selection */}
            {enrollStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider">Select Franchise Team</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Represent a professional team inside the {selectedLeague.name}.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 my-2">
                  {teams.filter(t => t.league_id === selectedLeague.id).map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        selectedTeamId === team.id
                          ? 'bg-green-glow border-green-core text-text-primary shadow-[0_0_15px_rgba(23,232,143,0.08)]'
                          : 'bg-bg-surface-2 border-border-hairline text-text-secondary hover:text-text-primary hover:border-white/10'
                      }`}
                    >
                      <Shield className={`w-5 h-5 ${selectedTeamId === team.id ? 'text-green-core' : 'text-text-tertiary'}`} />
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase">{team.short_name}</span>
                        <span className="text-[8px] text-text-tertiary text-center leading-none mt-1 truncate max-w-[120px]">
                          {team.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selectedTeamId}
                  onClick={() => setEnrollStep(2)}
                  className={`w-full flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-bg-void transition-colors cursor-pointer ${
                    selectedTeamId ? 'bg-green-core hover:bg-green-core/90' : 'bg-text-tertiary/20 text-text-tertiary/50 cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Cricket Role Selection */}
            {enrollStep === 2 && (
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider">Select Player Role</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Choose your classification inside the league rosters.
                  </p>
                </div>

                <div className="flex flex-col gap-2 my-2">
                  {[
                    { id: 'batsman', label: 'Batsman', desc: 'Focuses on run counts and boundary sizes' },
                    { id: 'bowler', label: 'Bowler', desc: 'Evaluates code maintenance and issue closes' },
                    { id: 'all-rounder', label: 'All Rounder', desc: 'Balanced scores across batting and bowling' },
                    { id: 'wicket-keeper', label: 'Wicket Keeper', desc: 'Focuses on PR reviews and fielding checks' },
                    { id: 'captain', label: 'Captain', desc: 'High contributions, org sizes, and leadership' }
                  ].map((roleOption) => (
                    <button
                      key={roleOption.id}
                      onClick={() => setSelectedRole(roleOption.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        selectedRole === roleOption.id
                          ? 'bg-green-glow border-green-core text-text-primary'
                          : 'bg-bg-surface-2 border-border-hairline text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-black uppercase">{roleOption.label}</span>
                        <span className="text-[8px] text-text-tertiary leading-none">{roleOption.desc}</span>
                      </div>
                      <User className={`w-4 h-4 ${selectedRole === roleOption.id ? 'text-green-core' : 'text-text-tertiary'}`} />
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  {/* Back button logic skips back to Step 1 only if the league has teams */}
                  <button
                    onClick={() => {
                      const leagueTeams = teams.filter(t => t.league_id === selectedLeague.id);
                      if (leagueTeams.length > 0) {
                        setEnrollStep(1);
                      } else {
                        setSelectedLeague(null);
                      }
                    }}
                    className="flex-1 flex h-10 items-center justify-center rounded-xl border border-border-hairline text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedRole || isSubmitting}
                    onClick={submitEnrollment}
                    className={`flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-bg-void transition-colors cursor-pointer ${
                      selectedRole ? 'bg-green-core hover:bg-green-core/90' : 'bg-text-tertiary/20 text-text-tertiary/50 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : success ? (
                      'Success!'
                    ) : (
                      'Submit Entry'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS ANIMATION */}
            {success && (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4 animate-scale-in">
                <CheckCircle2 className="w-16 h-16 text-green-core animate-bounce" />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-black uppercase tracking-wider text-green-core">Enrollment Confirmed</h3>
                  <p className="text-xs text-text-secondary">
                    Welcome to the {selectedLeague.name}. Your active card stats are now connected!
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
      <Footer />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        message="Please connect your GitHub account to join a tournament league and compete with other developers."
      />
    </div>
  );
}
