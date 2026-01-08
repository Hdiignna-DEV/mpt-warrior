'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CommanderArkaPose } from './ChatUIEnhancers';

interface AIMentorSidebarProps {
  pose?: CommanderArkaPose;
  isActive?: boolean;
  opacity?: number;
  children?: React.ReactNode;
}

/**
 * AIMentorSidebar Component
 * Desktop/tablet sidebar (20% width) with dynamic opacity
 * 
 * Features:
 * - Fixed 20% width sidebar on right/left
 * - Full mascot display
 * - Dynamic opacity (20-30% idle, 100% active/hovering)
 * - Pointer-events: none when idle so clicks pass through to main content
 * - Smooth transitions
 */
export function AIMentorSidebar({
  pose = 'vision',
  isActive = false,
  opacity = 30,
  children
}: AIMentorSidebarProps) {
  const [currentOpacity, setCurrentOpacity] = useState(opacity);
  const [isHovering, setIsHovering] = useState(false);

  // Update opacity based on active state and hovering
  useEffect(() => {
    if (isActive || isHovering) {
      setCurrentOpacity(100);
    } else {
      setCurrentOpacity(opacity);
    }
  }, [isActive, isHovering, opacity]);

  return (
    <aside
      className={`hidden lg:flex fixed right-0 top-0 h-screen w-1/5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-l border-slate-700/50 flex-col items-center justify-center p-4 transition-all duration-300 z-40 ${
        isHovering || isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        opacity: currentOpacity / 100,
        zIndex: 40
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Mascot Display - Half body, scaling dinamis, lazy loading */}
      <div className="flex flex-col items-center gap-6">
        {/* Mascot Image Container */}
        <div className="relative w-28 h-40 flex items-center justify-center">
          <Image
            src={`/images/mascots/commander-arka-${pose}.png`}
            alt="Commander Arka"
            fill
            className="object-contain drop-shadow-xl"
            loading="lazy"
            priority={false}
            style={{ background: 'transparent' }}
          />
        </div>
        {/* Status Indicator */}
        <div className="text-center space-y-2">
          <p className="text-sm font-bold text-blue-400">Warrior Buddy</p>
          <p className="text-xs text-slate-400">⚡ AI Mentor Ready</p>
          {/* Pulse dot when active */}
          {isActive && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          )}
        </div>
        {/* Children content if provided */}
        {children && (
          <div className="w-full mt-4 text-sm text-slate-300">
            {children}
          </div>
        )}
        {/* Hint text */}
        <div className="text-xs text-slate-500 text-center mt-4 italic">
          Hover to interact
        </div>
      </div>
    </aside>
  );
}

/**
 * AIMentorSidebarLeft Component
 * Same as AIMentorSidebar but positioned on the left
 */
export function AIMentorSidebarLeft({
  pose = 'onboarding',
  isActive = false,
  opacity = 30,
  children
}: AIMentorSidebarProps) {
  const [currentOpacity, setCurrentOpacity] = useState(opacity);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isActive || isHovering) {
      setCurrentOpacity(100);
    } else {
      setCurrentOpacity(opacity);
    }
  }, [isActive, isHovering, opacity]);

  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen w-1/5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-700/50 flex-col items-center justify-center p-4 transition-all duration-300 z-30 ${
        isHovering || isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        opacity: `${currentOpacity}%`
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Mascot Display - Full body */}
      <div className="flex flex-col items-center gap-6">
        
        {/* Mascot Image Container */}
        <div className="relative w-32 h-48 flex items-center justify-center">
          <Image
            src={`/images/mascots/commander-arka-${pose}.png`}
            alt="Commander Arka"
            fill
            className="object-contain"
            priority={false}
          />
        </div>

        {/* Status Indicator */}
        <div className="text-center space-y-2">
          <p className="text-sm font-bold text-amber-400">Commander Arka</p>
          <p className="text-xs text-slate-400">🫡 Ready for Battle</p>
          
          {/* Pulse dot when active */}
          {isActive && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          )}
        </div>

        {/* Children content if provided */}
        {children && (
          <div className="w-full mt-4 text-sm text-slate-300">
            {children}
          </div>
        )}

        {/* Hint text */}
        <div className="text-xs text-slate-500 text-center mt-4 italic">
          Hover to interact
        </div>
      </div>
    </aside>
  );
}
