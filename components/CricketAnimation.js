'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function CricketAnimation() {
  const ballControls = useAnimation();
  const batControls = useAnimation();
  const textControls = useAnimation();
  const [showSparks, setShowSparks] = useState(false);
  const [cycle, setCycle] = useState('six'); // 'six' or 'four'
  const cycleRef = useRef('six');

  useEffect(() => {
    let active = true;
    const timeoutIds = new Set();
    const pendingResolves = new Set();

    const scheduleTimeout = (callback, delay) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId);
        callback();
      }, delay);
      timeoutIds.add(timeoutId);
      return timeoutId;
    };

    const wait = (delay) =>
      new Promise((resolve) => {
        pendingResolves.add(resolve);
        scheduleTimeout(() => {
          pendingResolves.delete(resolve);
          resolve();
        }, delay);
      });

    const runSequence = async () => {
      if (!active) return;

      // Reset states
      setShowSparks(false);
      textControls.set({ opacity: 0, scale: 0.5, y: 0 });
      
      // Position ball at start (relative to the collision point at 45% left, 55% top)
      ballControls.set({ x: '35vw', y: '-35vh', scale: 0.4, opacity: 1 });
      
      // Position bat at start (cocked back to the left / behind)
      batControls.set({ rotate: -60, opacity: 1 });

      // Randomly choose a shot trajectory:
      // 0 = Six Right, 1 = Six Left, 2 = Four Right, 3 = Four Left
      const shotType = Math.floor(Math.random() * 4);
      const isSix = shotType === 0 || shotType === 1;
      const currentLabel = isSix ? 'six' : 'four';
      
      cycleRef.current = currentLabel;
      setCycle(currentLabel);

      // 1. Bowler delivers: ball travels down to the static collision point (0, 0)
      await Promise.all([
        ballControls.start({
          x: 0,
          y: 0,
          scale: 0.9,
          transition: { duration: 1.1, ease: 'easeIn' }
        }),
        // Bat swings forward (left to right) to meet the ball
        wait(750).then(() => {
          if (active) {
            batControls.start({
              rotate: 15,
              transition: { duration: 0.35, ease: 'easeOut' }
            });
          }
        })
      ]);

      if (!active) return;

      // 2. Impact point reached
      setShowSparks(true);
      
      // Trigger "SIX!" or "FOUR!" text pop-up
      textControls.start({
        opacity: [0, 1, 1, 0],
        scale: [0.6, 1.3, 1.3, 1],
        y: -80,
        transition: { duration: 1.0, ease: 'easeOut' }
      });

      // 3. Ball flies off based on the randomized shot selection
      let targetX = '45vw';
      let targetY = '-65vh';
      let scaleKeyframes = [0.9, 1.8, 1.2, 0.4];

      if (shotType === 0) {
        // Six Right (High)
        targetX = '45vw';
        targetY = '-65vh';
      } else if (shotType === 1) {
        // Six Left (High)
        targetX = '-45vw';
        targetY = '-65vh';
      } else if (shotType === 2) {
        // Four Right (Low)
        targetX = '45vw';
        targetY = '15vh';
        scaleKeyframes = [0.9, 0.7, 0.6, 0.3];
      } else {
        // Four Left (Low)
        targetX = '-45vw';
        targetY = '20vh';
        scaleKeyframes = [0.9, 0.7, 0.6, 0.3];
      }

      await Promise.all([
        ballControls.start({
          x: targetX,
          y: targetY,
          scale: scaleKeyframes,
          opacity: [1, 1, 1, 0],
          transition: { duration: 0.9, ease: 'easeOut' }
        }),
        batControls.start({
          rotate: 80,
          transition: { duration: 0.35, ease: 'easeOut' }
        })
      ]);

      if (!active) return;

      // Fade elements out quickly for fast loop reset
      await Promise.all([
        batControls.start({ opacity: 0, transition: { duration: 0.3 } }),
        ballControls.start({ opacity: 0, transition: { duration: 0.3 } })
      ]);

      if (!active) return;

      // Reduced rest time to 1.5 seconds so animation stays active and visible
      await wait(1500);

      if (active) {
        runSequence();
      }
    };

    // Begin sequence after initial render delay
    scheduleTimeout(() => {
      runSequence();
    }, 800);

    return () => {
      active = false;
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.clear();
      pendingResolves.forEach((resolve) => resolve());
      pendingResolves.clear();
      ballControls.stop();
      batControls.stop();
      textControls.stop();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-20 opacity-15 select-none">
      {/* Dynamic Glowing Text (statically positioned above the crease) */}
      <motion.div
        animate={textControls}
        style={{ left: '42%', top: '35%' }}
        className="absolute font-black text-4xl text-gradient-green-blue uppercase tracking-widest pointer-events-none"
      >
        {cycle === 'six' ? 'Six! ⚡' : 'Four! 🏏'}
      </motion.div>

      {/* Cricket Ball (statically centered at the collision zone) */}
      <motion.div
        animate={ballControls}
        style={{ left: '45%', top: '55%' }}
        className="absolute w-8 h-8 rounded-full bg-[#10B981] border border-white/20 shadow-[0_0_20px_#10B981] flex items-center justify-center pointer-events-none"
      >
        {/* Ball Seam */}
        <div className="w-full h-0.5 bg-white/40 rotate-45"></div>
      </motion.div>

      {/* Cricket Bat (statically placed to swing through the crease) */}
      <motion.div
        animate={batControls}
        style={{ 
          left: '38%', 
          top: '38%', 
          originX: 0.5, 
          originY: 0.1 
        }} 
        className="absolute w-12 h-36 flex flex-col items-center pointer-events-none"
      >
        {/* Bat Grip */}
        <div className="w-2.5 h-12 rounded-t-full bg-gradient-to-b from-[#38E1F2] to-[#1E293B] border border-white/10 shadow-lg"></div>
        {/* Bat Body */}
        <div className="w-5 h-24 rounded-b-md bg-gradient-to-b from-[#8B5A2B] to-[#CD853F] border border-white/5 shadow-2xl flex flex-col justify-between p-1">
          <div className="w-full h-1 bg-[#10B981]/40 rounded-full"></div>
          <div className="w-full h-1 bg-[#10B981]/40 rounded-full"></div>
        </div>
      </motion.div>

      {/* Impact Sparks Burst (centered at the collision point) */}
      {showSparks && (
        <div className="absolute left-[45%] top-[55%] flex items-center justify-center pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const distance = 50 + Math.random() * 30;
            const radians = (angle * Math.PI) / 180;
            const targetX = Math.cos(radians) * distance;
            const targetY = Math.sin(radians) * distance;

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  scale: 0.2,
                  opacity: 0
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full bg-[#38E1F2] shadow-[0_0_10px_#38E1F2]"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
