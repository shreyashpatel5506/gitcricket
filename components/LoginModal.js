'use client';

import React from 'react';
import { X, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginModal({ isOpen, onClose, message }) {
  const supabase = createClient();

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (err) {
      console.error('OAuth trigger error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-void/80 backdrop-blur-sm p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="w-full max-w-sm rounded-2xl glass-panel bg-bg-surface-1/95 border border-border-hairline p-6 shadow-2xl relative z-10 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mt-2">
          <div className="h-12 w-12 rounded-full bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core">
            <Lock className="w-5 h-5" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
              Authentication Required
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-[280px]">
              {message || 'Please connect your GitHub account to proceed.'}
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="mt-4 w-full flex h-10 items-center justify-center gap-2.5 rounded-xl bg-green-core text-xs font-bold text-bg-void hover:bg-green-core/90 transition-all shadow-lg shadow-green-core/15 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-4 h-4 fill-bg-void" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            Connect GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
