'use client';

import React from 'react';
import { Star, ShieldAlert, Sparkles } from 'lucide-react';

export default function PreviewCard() {
  return (
    <div className="relative animate-float select-none">
      {/* Glow Backdrop */}
      <div className="absolute -inset-1.5 rounded-[28px] bg-gradient-to-r from-[#B9862E] via-[#F4D06F] to-[#B9862E] opacity-40 blur-xl group-hover:opacity-75 transition duration-1000"></div>

      {/* Card Body */}
      <div className="relative w-80 h-[480px] rounded-[24px] bg-bg-surface-1 border-2 border-[#B9862E]/70 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
        
        {/* Top Medallion Seam */}
        <div className="flex items-start justify-between">
          {/* Overall Seam Ball Indicator */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-dashed border-[#F4D06F]/50 bg-bg-surface-2 shadow-inner">
            <span className="font-mono text-2xl font-black text-[#F4D06F]">94</span>
          </div>

          {/* Rarity Star badge */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-black tracking-widest text-[#F4D06F] uppercase">GOLD TIER</span>
            <div className="flex gap-0.5 text-[#F4D06F]">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
        </div>

        {/* Player Illustration Avatar Silhouette */}
        <div className="relative flex-1 flex items-center justify-center mt-2">
          {/* Circle background ripple */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#B9862E]/5 to-[#F4D06F]/10 border border-[#F4D06F]/10"></div>
          
          {/* Silhouette Avatar */}
          <div className="relative z-10 w-36 h-36 rounded-full border-2 border-[#F4D06F] bg-bg-surface-2 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-24 h-24 text-text-tertiary/40 mt-6 fill-current">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* Verification Badge */}
          <div className="absolute bottom-2 right-12 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-green-core text-bg-void shadow">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* Player Name and Role */}
        <div className="text-center mt-2">
          <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">@torvalds</h3>
          <p className="text-xs font-semibold text-[#F4D06F] uppercase tracking-widest mt-0.5">Legendary Captain</p>
        </div>

        {/* Divider Seam line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#F4D06F]/30 to-transparent my-3"></div>

        {/* Cricket Metrics Stats Board */}
        <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-center pb-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">BAT</span>
            <span className="font-mono text-sm font-black text-text-primary">96</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">BOWL</span>
            <span className="font-mono text-sm font-black text-text-primary">89</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">FLD</span>
            <span className="font-mono text-sm font-black text-text-primary">92</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">TCH</span>
            <span className="font-mono text-sm font-black text-text-primary">95</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">FTS</span>
            <span className="font-mono text-sm font-black text-text-primary">90</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">EXP</span>
            <span className="font-mono text-sm font-black text-text-primary">98</span>
          </div>
        </div>

      </div>
    </div>
  );
}
