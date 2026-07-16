'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
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
}

interface Season {
  id: string;
  league_id: string;
  name: string;
  is_active: boolean;
}

interface Team {
  id: string;
  name: string;
  short_name: string;
}

export default function LeaguesPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [enrollments, setEnrollments] = useState<string[]>([]); // active seasons enrolled
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Enrollment Funnel States
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [enrollStep, setEnrollStep] = useState<number>(1); // 1 = Team Selection, 2 = Role Selection, 3 = Submitting
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 1. Fetch user session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // 2. Fetch leagues
        const { data: leaguesData } = await supabase.from('leagues').select('*');
        setLeagues(leaguesData || []);

        // 3. Fetch seasons
        const { data: seasonsData } = await supabase.from('seasons').select('*');
        setSeasons(seasonsData || []);

        // 4. Fetch teams
        const { data: teamsData } = await supabase.from('teams').select('*');
        setTeams(teamsData || []);

        // 5. Fetch user's enrollments if logged in
        if (session?.user) {
          const { data: enrollmentsData } = await supabase
            .from('league_enrollments')
            .select('season_id')
            .eq('user_id', session.user.id);
          
          setEnrollments(enrollmentsData?.map(e => e.season_id) || []);
        }
      } catch (err) {
        console.error('Failed to load leagues data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleJoinClick = (league: League) => {
    if (!user) {
      // Prompt user to sign in via Navbar click or direct signin
      alert('Please log in using the "Connect GitHub" button in the navigation header to join a league!');
      return;
    }
    setSelectedLeague(league);
    setEnrollStep(1);
    setSelectedTeamId('');
    setSelectedRole('');
    setError('');
    setSuccess(false);
  };

  const submitEnrollment = async () => {
    if (!selectedLeague || !selectedTeamId || !selectedRole) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/leagues/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leagueId: selectedLeague.id,
          teamId: selectedTeamId,
          role: selectedRole
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Add season to local enrollments state
        const activeSeason = seasons.find(s => s.league_id === selectedLeague.id && s.is_active);
        if (activeSeason) {
          setEnrollments(prev => [...prev, activeSeason.id]);
        }
        setTimeout(() => {
          setSelectedLeague(null);
        }, 1800);
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

  // Filter leagues by active category tab and search query
  const filteredLeagues = leagues.filter(league => {
    const matchesSearch = league.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          league.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'ipl') return matchesSearch && league.code === 'ipl';
    if (activeTab === 'icc') return matchesSearch && league.code === 'cwc';
    if (activeTab === 'bbl') return matchesSearch && league.code === 'bbl';
    
    return matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-bg-void text-text-primary">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          
          {/* Header banner */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="rounded-full bg-green-glow px-3 py-1 text-xs font-semibold text-green-core border border-green-core/20 tracking-wider uppercase">
              GitCric Tournaments
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider mt-4">
              Competitive Leagues
            </h1>
            <p className="text-sm sm:text-base text-text-secondary mt-2">
              Enroll in professional cricket leagues, choose your franchise, choose your role, and compete on dynamic rating leaderboards.
            </p>
          </div>

          {/* Search & Categories Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border-hairline">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-text-tertiary" />
              </span>
              <input
                type="text"
                placeholder="Search leagues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-bg-surface-1 border border-border-hairline outline-none focus:border-green-core/40 transition-colors"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {['all', 'ipl', 'icc', 'bbl'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-green-glow text-green-core border border-green-core/20' 
                      : 'bg-bg-surface-1 border border-border-hairline text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab === 'all' ? 'All Leagues' : tab.toUpperCase()}
                </button>
              ))}
            </div>

          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-green-core animate-spin" />
              <p className="text-xs text-text-tertiary">Loading leagues directory...</p>
            </div>
          ) : (
            /* Leagues Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLeagues.map((league) => {
                const activeSeason = seasons.find(s => s.league_id === league.id && s.is_active);
                const isUserEnrolled = activeSeason ? enrollments.includes(activeSeason.id) : false;
                
                return (
                  <div 
                    key={league.id} 
                    className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-green-core/20 transition-all hover:scale-[1.01] duration-300"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Logo and Name header */}
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-bg-surface-2 border border-border-hairline flex items-center justify-center text-green-core">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col text-left">
                          <h3 className="text-sm font-black uppercase tracking-wide text-text-primary">
                            {league.name}
                          </h3>
                          <span className="text-[10px] text-text-tertiary font-bold tracking-wider uppercase mt-0.5">
                            {league.code.toUpperCase()} • {activeSeason?.name || 'Off-season'}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-text-secondary leading-relaxed min-h-[60px]">
                        {league.description}
                      </p>
                    </div>

                    {/* Footer Info and Actions */}
                    <div className="mt-6 pt-4 border-t border-border-hairline flex flex-col gap-4">
                      <div className="flex items-center justify-between text-[11px] text-text-tertiary font-semibold">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Enrolled: Active
                        </span>
                        <span className="text-green-core bg-green-glow px-2 py-0.5 rounded border border-green-core/10">
                          {isUserEnrolled ? 'Enrolled' : 'Open'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUserEnrolled ? (
                          <button
                            disabled
                            className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-bg-surface-2 border border-border-hairline text-xs font-bold text-text-tertiary"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-core" />
                            Registered
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinClick(league)}
                            className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-green-core hover:bg-green-core/90 text-xs font-bold text-bg-void transition-colors cursor-pointer"
                          >
                            Join League
                          </button>
                        )}
                        
                        <button className="h-10 px-3 rounded-xl border border-border-hairline text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 transition-colors cursor-pointer" title="View Rankings">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredLeagues.length === 0 && (
                <div className="col-span-full py-16 text-center text-xs text-text-tertiary">
                  No leagues found matching selection rules.
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Enrollment Funnel Modal */}
      {selectedLeague && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-void/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass-panel bg-bg-surface-1/95 border border-border-hairline p-6 shadow-2xl relative">
            
            {/* Close button */}
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

            {/* Error messaging */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-xs font-semibold text-error">
                {error}
              </div>
            )}

            {/* STEP 1: Franchise Team Selection */}
            {enrollStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-base font-black uppercase tracking-wider">Select Franchise Team</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Choose the franchise you want to represent in this season.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 my-2">
                  {teams.filter(t => t.name !== '').map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        selectedTeamId === team.id
                          ? 'bg-green-glow border-green-core text-text-primary shadow-[0_0_15px_rgba(23,232,143,0.08)]'
                          : 'bg-bg-surface-2 border-border-hairline text-text-secondary hover:text-text-primary hover:border-white/10'
                      }`}
                    >
                      <Shield className={`w-6 h-6 ${selectedTeamId === team.id ? 'text-green-core' : 'text-text-tertiary'}`} />
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-extrabold uppercase">{team.short_name}</span>
                        <span className="text-[9px] text-text-tertiary text-center leading-none mt-1 truncate max-w-[120px]">
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
                  <h3 className="text-base font-black uppercase tracking-wider">Select Player Role</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Your role determines presentation, badges, and leaderboard divisions.
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
                        <span className="text-xs font-bold uppercase">{roleOption.label}</span>
                        <span className="text-[9px] text-text-tertiary leading-none">{roleOption.desc}</span>
                      </div>
                      <User className={`w-4 h-4 ${selectedRole === roleOption.id ? 'text-green-core' : 'text-text-tertiary'}`} />
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEnrollStep(1)}
                    className="flex-1 flex h-10 items-center justify-center rounded-xl border border-border-hairline text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 transition-colors cursor-pointer"
                  >
                    Back
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
                      'Lock in Choice'
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
                  <h3 className="text-lg font-black uppercase tracking-wider text-green-core">Enrollment Confirmed</h3>
                  <p className="text-xs text-text-secondary">
                    Welcome to the {selectedLeague.name}. Your playing credentials are locked in!
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
