import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading skeleton component displayed while Next.js streams server rendering.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-void text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        
        {/* Animated Spinners */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-dashed border-green-core/20 animate-spin"></div>
          <Loader2 className="w-8 h-8 text-green-core animate-spin absolute" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-black uppercase tracking-widest text-gradient-green-blue">Polishing Pitch...</h2>
          <p className="text-xs text-text-secondary animate-pulse">
            Scraping GitHub innings, calculating form, and compiling player stats...
          </p>
        </div>

      </div>
    </div>
  );
}
