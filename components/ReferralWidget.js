'use client';

import React, { useState, useEffect } from 'react';
import { Gift, X, Server, Cloud, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ReferralWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [isHidden, setIsHidden] = useState(true); // Default true for server-side render safety

  useEffect(() => {
    // Check if the user previously dismissed the deals widget in this session
    const isClosed = sessionStorage.getItem('gitcric_referrals_closed');
    if (!isClosed) {
      setIsHidden(false);
    }
  }, []);

  const handleClosePermanently = (e) => {
    e.stopPropagation();
    setIsHidden(true);
    sessionStorage.setItem('gitcric_referrals_closed', 'true');
  };

  if (isHidden) return null;

  const deals = [
    {
      name: 'Hostinger',
      description: 'High-Performance Web Hosting',
      offer: 'Up to 20% Off Hosting Plans',
      link: 'https://www.hostinger.com/in?REFERRALCODE=HC1SHREYA4Q3',
      gradient: 'from-purple-500/10 to-indigo-600/10 hover:border-purple-500/40',
      iconColor: 'text-purple-400',
      icon: Server,
    },
    {
      name: 'Cloudinary',
      description: 'Image & Video Optimization API',
      offer: 'Free Image Delivery Credit',
      link: 'https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/ilobhroegklfkxr4zqnr?t=default',
      gradient: 'from-blue-500/10 to-cyan-600/10 hover:border-blue-400/40',
      iconColor: 'text-blue-400',
      icon: Cloud,
    },
    {
      name: 'Railway',
      description: 'Instant Cloud Backend Deployments',
      offer: 'Free Monthly Run Credit',
      link: 'https://railway.com?referralCode=iIzHPY',
      gradient: 'from-pink-500/10 to-rose-600/10 hover:border-rose-500/40',
      iconColor: 'text-rose-400',
      icon: Cpu,
    },
    {
      name: 'geektastic',
      description: 'Get your code reviewed by experts',
      offer: 'Evaluate candidates with expert-reviewed multiple choice and take-home code challenges.',
      link: 'https://app.geektastic.com/register?utm_source=devref&utm_campaign=UYMv-ppbdL3NynvqcEariA&utm_medium=site#hirer',
      gradient: 'from-green-500/10 to-lime-600/10 hover:border-green-400/40',
      iconColor: 'text-green-400',
      icon: CheckCircle2,
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {!isOpen ? (
        // Collapsed Floating Button
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 rounded-full bg-bg-surface-2 hover:bg-bg-surface-3 border border-border-hairline hover:border-green-core/30 px-4 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Subtle Ping/Notification Light */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-core opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-core"></span>
          </span>
          
          <Gift className="w-4 h-4 text-green-core group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-[11px] font-bold tracking-wider text-text-primary uppercase">Dev Deals</span>
          
          {/* Inline dismiss button */}
          <span
            onClick={handleClosePermanently}
            className="ml-1 p-0.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-white/10 transition-colors"
            title="Hide for this session"
          >
            <X className="w-3 h-3" />
          </span>
        </button>
      ) : (
        // Expanded Glassmorphic Panel
        <div className="w-80 rounded-2xl glass-panel bg-bg-surface-1/95 border border-border-hairline p-4 shadow-2xl animate-fade-in-up transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-hairline">
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-green-core" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                Developer Vouchers
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Intro description */}
          <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
            Unlock professional credits and hosting discounts via these verified developer referrals:
          </p>

          {/* List of Referral Links */}
          <div className="flex flex-col gap-2.5">
            {deals.map((deal) => {
              const Icon = deal.icon;
              return (
                <a
                  key={deal.name}
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex items-center justify-between p-3 rounded-xl border border-border-hairline bg-gradient-to-r ${deal.gradient} transition-all duration-300 hover:translate-x-1.5 shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-bg-void border border-white/5 ${deal.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-text-primary group-hover:text-green-core transition-colors">
                        {deal.name}
                      </span>
                      <span className="text-[10px] text-text-tertiary leading-none">
                        {deal.description}
                      </span>
                      <span className="inline-flex text-[9px] font-bold text-green-core bg-green-glow px-1.5 py-0.5 rounded border border-green-core/10 mt-1 w-max">
                        {deal.offer}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              );
            })}
          </div>

          {/* Footer controls */}
          <div className="mt-4 pt-3 border-t border-border-hairline flex items-center justify-between text-[9px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-core/60" /> Official Vouchers
            </span>
            <button
              onClick={handleClosePermanently}
              className="hover:text-text-secondary underline transition-colors cursor-pointer"
            >
              Hide all session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
