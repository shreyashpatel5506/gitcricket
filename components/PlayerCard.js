'use client';

import React, { useRef } from 'react';
import { Star, Sparkles } from 'lucide-react';

/**
 * Computes Rarity Tier style configs based on the player's overall rating.
 */
function getRarityConfig(ovr) {
  if (ovr < 60) {
    return {
      tierName: 'BRONZE',
      borderClass: 'border-[#8C5A34]/80',
      textClass: 'text-[#C88B54]',
      accentColor: '#C88B54',
      glowStyle: 'shadow-[0_0_30px_rgba(140,90,52,0.15)]',
      gradient: 'linear-gradient(135deg, #8C5A34, #C88B54)',
      bgGradient: 'from-[#8C5A34]/5 to-[#C88B54]/10',
      stars: 1
    };
  }
  if (ovr < 73) {
    return {
      tierName: 'SILVER',
      borderClass: 'border-[#8A94A6]/80',
      textClass: 'text-[#E4E9F0]',
      accentColor: '#E4E9F0',
      glowStyle: 'shadow-[0_0_30px_rgba(138,148,166,0.15)]',
      gradient: 'linear-gradient(135deg, #8A94A6, #E4E9F0)',
      bgGradient: 'from-[#8A94A6]/5 to-[#E4E9F0]/10',
      stars: 2
    };
  }
  if (ovr < 85) {
    return {
      tierName: 'GOLD',
      borderClass: 'border-[#B9862E]/80',
      textClass: 'text-[#F4D06F]',
      accentColor: '#F4D06F',
      glowStyle: 'shadow-[0_0_35px_rgba(185,134,46,0.25)]',
      gradient: 'linear-gradient(135deg, #B9862E, #F4D06F)',
      bgGradient: 'from-[#B9862E]/5 to-[#F4D06F]/10',
      stars: 3
    };
  }
  if (ovr < 95) {
    return {
      tierName: 'DIAMOND',
      borderClass: 'border-[#38E1F2]/80',
      textClass: 'text-[#B8F3FF]',
      accentColor: '#B8F3FF',
      glowStyle: 'shadow-[0_0_40px_rgba(56,225,242,0.3)]',
      gradient: 'linear-gradient(135deg, #38E1F2, #B8F3FF)',
      bgGradient: 'from-[#38E1F2]/5 to-[#B8F3FF]/10',
      stars: 4
    };
  }
  return {
    tierName: 'LEGEND',
    borderClass: 'border-[#FF3D9A]/80',
    textClass: 'text-[#FFB3DA]',
    accentColor: '#FFB3DA',
    glowStyle: 'shadow-[0_0_50px_rgba(255,61,154,0.4)]',
    gradient: 'linear-gradient(135deg, #FF3D9A, #FFB3DA)',
    bgGradient: 'from-[#FF3D9A]/5 to-[#FFB3DA]/10',
    stars: 5
  };
}

export default function PlayerCard({ profile, card, mode = 'odi', innerRef }) {
  const cardRef = useRef(null);

  const { overall, batting, bowling, fielding, fitness, technique, experience, player_role } = card;
  let config = getRarityConfig(overall);

  // Apply format mode theme overrides
  if (mode === 't20') {
    config = {
      tierName: 'T20 BLITZ',
      borderClass: 'border-[#FF3D9A]/80',
      textClass: 'text-[#FF3D9A]',
      accentColor: '#FF3D9A',
      glowStyle: 'shadow-[0_0_40px_rgba(255,61,154,0.35)]',
      gradient: 'linear-gradient(135deg, #FF3D9A, #FFB3DA)',
      bgGradient: 'from-[#FF3D9A]/5 to-[#FF3D9A]/15',
      stars: 4
    };
  } else if (mode === 'test') {
    config = {
      tierName: 'TEST MATCH',
      borderClass: 'border-[#8A1538]/80',
      textClass: 'text-[#8A1538]',
      accentColor: '#8A1538',
      glowStyle: 'shadow-[0_0_30px_rgba(138,21,56,0.18)]',
      gradient: 'linear-gradient(135deg, #8A1538, #C5A1A8)',
      bgGradient: 'from-[#F4EBE1]/15 to-[#8A1538]/5',
      stars: 5
    };
  }

  // 3D Perspective Tilt calculations
  const handleMouseMove = (e) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const box = cardEl.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;

    // Limit rotation to maximum 10 degrees for smooth UX
    const rotateX = y * -20;
    const rotateY = x * 20;

    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Set relative coordinates for hover gloss shine
    cardEl.style.setProperty('--shine-x', `${(x + 0.5) * 100}%`);
    cardEl.style.setProperty('--shine-y', `${(y + 0.5) * 100}%`);
  };

  const handleMouseLeave = () => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    cardEl.style.setProperty('--shine-x', '50%');
    cardEl.style.setProperty('--shine-y', '50%');
  };

  return (
    <div
      ref={(el) => {
        cardRef.current = el;
        if (innerRef) innerRef.current = el;
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative w-80 h-[480px] rounded-[28px] bg-bg-surface-1 border-2 ${config.borderClass} ${config.glowStyle} transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between p-6 select-none`}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }}
    >
      {/* Specular light sweep foil effect overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 65%)`
        }}
      ></div>

      {/* Top Medallion Section */}
      <div className="flex items-start justify-between z-10" style={{ transform: 'translateZ(30px)' }}>
        {/* Overall Score Circle Ball Seam */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-dashed bg-bg-surface-2 shadow-inner"
             style={{ borderColor: config.accentColor }}>
          <span className="font-mono text-2xl font-black text-text-primary" style={{ color: config.accentColor }}>
            {overall}
          </span>
        </div>

        {/* Rarity Stars */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: config.accentColor }}>
            {config.tierName} TIER
          </span>
          <div className="flex gap-0.5" style={{ color: config.accentColor }}>
            {Array.from({ length: config.stars }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
        </div>
      </div>

      {/* Player Avatar Central Placement */}
      <div className="relative flex-1 flex items-center justify-center mt-2 z-10" style={{ transform: 'translateZ(40px)' }}>
        {/* Decorative background radial halo */}
        <div className={`absolute w-44 h-44 rounded-full bg-gradient-to-tr ${config.bgGradient} border border-white/5`}></div>

        <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 bg-bg-surface-2 flex items-center justify-center"
             style={{ borderColor: config.accentColor }}>
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Verification Tick Badge */}
        <div className="absolute bottom-2 right-12 flex h-6 w-6 items-center justify-center rounded-full bg-green-core text-bg-void shadow">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>

      {/* Player Identity Information */}
      <div className="text-center mt-2 z-10" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="text-lg font-black text-text-primary uppercase tracking-wider">
          @{profile.github_username}
        </h3>
        <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: config.accentColor }}>
          {player_role}
        </p>
      </div>

      {/* Grid Divider seam */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3 z-10"></div>

      {/* Sub-Ratings Cricket Stats Panel */}
      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-center pb-2 z-10" style={{ transform: 'translateZ(25px)' }}>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">BAT</span>
          <span className="font-mono text-sm font-black text-text-primary">{batting}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">BOWL</span>
          <span className="font-mono text-sm font-black text-text-primary">{bowling}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">FLD</span>
          <span className="font-mono text-sm font-black text-text-primary">{fielding}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">TCH</span>
          <span className="font-mono text-sm font-black text-text-primary">{technique}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">FTS</span>
          <span className="font-mono text-sm font-black text-text-primary">{fitness}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">EXP</span>
          <span className="font-mono text-sm font-black text-text-primary">{experience}</span>
        </div>
      </div>

    </div>
  );
}
