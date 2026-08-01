import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase/connect';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.trim().toLowerCase();

    if (!username) {
      return new Response('Missing username', { status: 400 });
    }

    // Fetch user profile cache
    const { data: profile } = await supabase
      .from('github_profile_cache')
      .select('*')
      .eq('github_username', username)
      .maybeSingle();

    if (!profile) {
      return new Response('Profile not cached yet', { status: 404 });
    }

    // Fetch corresponding generated card details
    const { data: card } = await supabase
      .from('generated_cards')
      .select('*')
      .eq('github_profile_id', profile.id)
      .eq('theme', 'dark')
      .maybeSingle();

    if (!card) {
      return new Response('Card details not found', { status: 404 });
    }

    const { overall, batting, bowling, fielding, fitness, technique, experience, player_role } = card;

    // Define tier specifications matching getRarityConfig in PlayerCard.js
    let tierName = 'GOLD';
    let accentColor = '#F4D06F';
    let starsCount = 3;
    let bgCircleGradient = 'radial-gradient(circle, rgba(185,134,46,0.15) 0%, rgba(244,208,111,0.02) 70%)';
    let borderColor = 'rgba(185, 134, 46, 0.8)';

    if (overall < 60) {
      tierName = 'BRONZE';
      accentColor = '#C88B54';
      starsCount = 1;
      bgCircleGradient = 'radial-gradient(circle, rgba(140,90,52,0.15) 0%, rgba(200,139,84,0.02) 70%)';
      borderColor = 'rgba(140, 90, 52, 0.8)';
    } else if (overall < 73) {
      tierName = 'SILVER';
      accentColor = '#E4E9F0';
      starsCount = 2;
      bgCircleGradient = 'radial-gradient(circle, rgba(138,148,166,0.15) 0%, rgba(228,233,240,0.02) 70%)';
      borderColor = 'rgba(138, 148, 166, 0.8)';
    } else if (overall < 85) {
      tierName = 'GOLD';
      accentColor = '#F4D06F';
      starsCount = 3;
      bgCircleGradient = 'radial-gradient(circle, rgba(185,134,46,0.15) 0%, rgba(244,208,111,0.02) 70%)';
      borderColor = 'rgba(185, 134, 46, 0.8)';
    } else if (overall < 95) {
      tierName = 'DIAMOND';
      accentColor = '#B8F3FF';
      starsCount = 4;
      bgCircleGradient = 'radial-gradient(circle, rgba(56,225,242,0.2) 0%, rgba(184,243,255,0.02) 70%)';
      borderColor = 'rgba(56, 225, 242, 0.8)';
    } else {
      tierName = 'LEGEND';
      accentColor = '#FFB3DA';
      starsCount = 5;
      bgCircleGradient = 'radial-gradient(circle, rgba(255,61,154,0.2) 0%, rgba(255,179,218,0.02) 70%)';
      borderColor = 'rgba(255, 61, 154, 0.8)';
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#04060a',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #0d1527 0%, #04060a 100%)',
            padding: '40px 80px',
          }}
        >
          {/* Left Side: Branding */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '560px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '36px', marginRight: '12px' }}>🏏</span>
              <span style={{ fontSize: '40px', fontWeight: '900', color: '#10B981', letterSpacing: '2px' }}>
                GITCRIC
              </span>
            </div>

            <h1
              style={{
                fontSize: '56px',
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: '1.2',
                marginBottom: '16px',
                textTransform: 'uppercase',
              }}
            >
              {profile.name || profile.github_username}
            </h1>

            <p style={{ fontSize: '20px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '32px' }}>
              Gamifying developer metrics! Check out my cricket ratings, form streaks, and specialty stats from my GitHub profile.
            </p>

            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {overall} OVR • {player_role}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Player Card Design */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '320px',
              height: '480px',
              backgroundColor: '#0c0f17',
              borderRadius: '28px',
              border: `2px solid ${borderColor}`,
              padding: '24px',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {/* Top Row: OVR & Tier */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: `2px dashed ${accentColor}`,
                  backgroundColor: '#161b26',
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: '900', color: accentColor }}>
                  {overall}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '9px', fontWeight: '950', color: accentColor, letterSpacing: '2px', marginBottom: '4px' }}>
                  {tierName} TIER
                </span>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {Array.from({ length: starsCount }).map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      style={{ width: '14px', height: '14px', fill: accentColor, marginRight: '2px' }}
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Avatar Section */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  backgroundImage: bgCircleGradient,
                }}
              />
              <img
                src={profile.avatar_url}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: `2px solid ${accentColor}`,
                  objectFit: 'cover',
                  zIndex: 5,
                  backgroundColor: '#161b26',
                }}
              />
            </div>

            {/* Username & Role */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                @{profile.github_username}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: accentColor, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {player_role}
              </span>
            </div>

            {/* Card seam divider */}
            <div
              style={{
                height: '1px',
                backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
                margin: '10px 0',
              }}
            />

            {/* Stats Panel */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: '6px' }}>
              {[
                { label: 'BAT', val: batting },
                { label: 'BOWL', val: bowling },
                { label: 'FLD', val: fielding },
                { label: 'TCH', val: technique },
                { label: 'FTS', val: fitness },
                { label: 'EXP', val: experience },
              ].map((stat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '30%', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '9px', fontWeight: '750', color: '#9ca3af', letterSpacing: '1px' }}>
                    {stat.label}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error('OG Image Generation Error:', err);
    return new Response('Failed to generate image', { status: 500 });
  }
}
