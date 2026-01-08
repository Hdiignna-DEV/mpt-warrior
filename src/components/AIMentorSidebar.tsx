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
 * - Fixed 20% width sidebar on right (768px+)
 * - Half-body mascot display with proper scaling
 * - Dynamic opacity: 25% idle, 100% on hover/active
 * - Pointer-events: none when idle so clicks pass through to main content
 * - Smooth opacity transitions with transparent PNG support
 * - Proper z-index layering to not block main content
 */
export function AIMentorSidebar({
  pose = 'vision',
  isActive = false,
  opacity = 25,
  children
}: AIMentorSidebarProps) {
  const [currentOpacity, setCurrentOpacity] = useState(opacity);
  const [isHovering, setIsHovering] = useState(false);

  // Update opacity based on active state and hovering
  // Idle: 25%, Active/Hover: 100%
  useEffect(() => {
    if (isActive || isHovering) {
      setCurrentOpacity(100);
    } else {
      setCurrentOpacity(opacity);
    }
  }, [isActive, isHovering, opacity]);

  return (
    <aside
      className={`hidden lg:flex fixed right-0 top-0 h-screen w-1/5 bg-gradient-to-b from-slate-900/80 via-slate-900/80 to-slate-950/80 border-l border-slate-700/30 flex-col items-center justify-center p-4 transition-all duration-300 z-30 backdrop-blur-sm ${
        isHovering || isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        opacity: currentOpacity / 100,
        willChange: 'opacity'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="complementary"
      aria-label="AI Mentor Assistant"
    >
      {/* Mascot Display - Half body with proper scaling */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Mascot Image Container - Responsive sizing */}
        <div className="relative w-24 h-36 sm:w-28 sm:h-40 flex items-center justify-center">
          <Image
            src={`/images/mascots/commander-arka-${pose}.png`}
            alt="Commander Arka - AI Mentor"
            fill
            className="object-contain drop-shadow-lg"
            loading="lazy"
            priority={false}
            style={{ background: 'transparent' }}
          />
        </div>

        {/* Status Indicator with better styling */}
        <div className="text-center space-y-2">
          <h3 className="text-sm font-bold text-blue-400">Warrior Buddy</h3>
          <p className="text-xs text-slate-400">⚡ AI Mentor</p>
          
          {/* Active indicator with animation */}
          {isActive && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Active</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 my-2" />

        {/* Children content if provided */}
        {children && (
          <div className="w-full mt-2 text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
            {children}
          </div>
        )}

        {/* Interactive hint */}
        {!isHovering && !isActive && (
          <div className="text-xs text-slate-500 text-center mt-auto italic transition-opacity duration-300">
            Hover for more
          </div>
        )}

        {/* Quick action buttons when hovering */}
        {(isHovering || isActive) && (
          <div className="w-full mt-auto pt-4 space-y-2 animate-in fade-in duration-200">
            <button
              className="w-full px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-xs rounded-lg font-semibold transition-all active:scale-95"
              aria-label="Get AI Advice"
            >
              💡 Ask Advice
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

/**
 * AIMentorSidebarLeft Component
 * Left-positioned sidebar variant for split-screen layouts (e.g., Login page)
 * 
 * Same as AIMentorSidebar but:
 * - Positioned on the left instead of right
 * - Full-body mascot display (onboarding pose)
 * - Better for welcoming/onboarding scenarios
 */
export function AIMentorSidebarLeft({
  pose = 'onboarding',
  isActive = false,
  opacity = 25,
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
      className={`hidden lg:flex fixed left-0 top-0 h-screen w-1/5 bg-gradient-to-b from-slate-900/80 via-slate-900/80 to-slate-950/80 border-r border-slate-700/30 flex-col items-center justify-center p-4 transition-all duration-300 z-30 backdrop-blur-sm ${
        isHovering || isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        opacity: currentOpacity / 100,
        willChange: 'opacity'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="complementary"
      aria-label="Commander Arka - Battle Assistant"
    >
      {/* Mascot Display - Full body for onboarding */}
      <div className="flex flex-col items-center gap-4 w-full">
        
        {/* Mascot Image Container - Larger for full body display */}
        <div className="relative w-28 h-48 sm:w-32 sm:h-56 flex items-center justify-center">
          <Image
            src={`/images/mascots/commander-arka-${pose}.png`}
            alt="Commander Arka - Battle Ready"
            fill
            className="object-contain drop-shadow-lg"
            priority={false}
            style={{ background: 'transparent' }}
          />
        </div>

        {/* Status Indicator with military theme */}
        <div className="text-center space-y-2">
          <h3 className="text-sm font-bold text-amber-400">Commander Arka</h3>
          <p className="text-xs text-slate-400">🫡 Ready for Battle</p>
          
          {/* Active indicator */}
          {isActive && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Standby</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 my-2" />

        {/* Children content if provided */}
        {children && (
          <div className="w-full mt-2 text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
            {children}
          </div>
        )}

        {/* Interactive hint */}
        {!isHovering && !isActive && (
          <div className="text-xs text-slate-500 text-center mt-auto italic transition-opacity duration-300">
            Hover for guidance
          </div>
        )}

        {/* Quick action when hovering */}
        {(isHovering || isActive) && (
          <div className="w-full mt-auto pt-4 space-y-2 animate-in fade-in duration-200">
            <button
              className="w-full px-3 py-1.5 bg-amber-600/80 hover:bg-amber-600 text-white text-xs rounded-lg font-semibold transition-all active:scale-95"
              aria-label="Battle Training"
            >
              🎖️ Training
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
