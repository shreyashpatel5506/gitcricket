'use client';

import React, { useEffect, useState } from 'react';

/**
 * Animated progress bar representing a player's sub-rating.
 */
export default function StatBar({ label, value, tierColor }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Stagger animation on load
    const timer = setTimeout(() => {
      setWidth(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Fallback default gradient if no tierColor is supplied
  const fillBackground = tierColor || 'linear-gradient(135deg, var(--color-green-core), var(--color-blue-core))';

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono font-black" style={{ color: tierColor ? undefined : 'var(--color-green-core)' }}>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-bg-surface-3 overflow-hidden border border-border-hairline">
        <div
          className="h-full rounded-full transition-all duration-[1000ms] ease-out"
          style={{
            width: `${width}%`,
            background: fillBackground
          }}
        />
      </div>
    </div>
  );
}
