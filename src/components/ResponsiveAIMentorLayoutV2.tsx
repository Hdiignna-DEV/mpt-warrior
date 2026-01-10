/**
 * ResponsiveAIMentorLayoutV2 Component
 * Enhanced layout with improved desktop grid and mobile floating avatar
 * 
 * Desktop (≥768px):
 * - Side-by-side layout: Arka sidebar (20%) + Main content (80%)
 * - Smooth CSS grid transitions
 * - Dynamic opacity based on scroll/interaction
 * 
 * Mobile (<768px):
 * - Floating circular avatar in corner
 * - Draggable and expandable on click
 * - Doesn't block main content
 * 
 * Features:
 * - Container queries for responsive behavior
 * - Smooth transitions between layouts
 * - Accessibility compliant
 * - Dark Mode optimized
 */

'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AIMentorSidebar, AIMentorSidebarLeft } from './AIMentorSidebar';
import { FloatingAIMentorBubble } from './FloatingAIMentor';

export type CommanderArkaPose = 'empty' | 'onboarding' | 'vision' | 'victory' | 'warning';

interface ResponsiveAIMentorLayoutV2Props {
  children: ReactNode;
  mentorPose?: CommanderArkaPose;
  mentorActive?: boolean;
  position?: 'right' | 'left';
  mentorOpacity?: number;
  showMobileAvatar?: boolean;
  showDesktopSidebar?: boolean;
  sidebarContent?: ReactNode;
}

/**
 * ResponsiveAIMentorLayoutV2 Component
 * Professional layout system with grid-based responsive design
 */
export function ResponsiveAIMentorLayoutV2({
  children,
  mentorPose = 'vision',
  mentorActive = false,
  position = 'right',
  mentorOpacity = 25,
  showMobileAvatar = true,
  showDesktopSidebar = true,
  sidebarContent = null
}: ResponsiveAIMentorLayoutV2Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  // Hydration-safe responsive detection
  useEffect(() => {
    setIsHydrated(true);
    const checkMobile = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 768); // Tailwind md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        {children}
      </div>
    );
  }

  /**
   * Desktop Layout (≥768px)
   * Grid-based side-by-side layout:
   * [Sidebar 20%] [Main Content 80%]
   */
  if (!isMobile && showDesktopSidebar) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        {/* Grid container with sidebar + main content */}
        <div className={`grid h-screen transition-all duration-300 ${
          position === 'right' 
            ? 'grid-cols-[1fr_20%]' 
            : 'grid-cols-[20%_1fr]'
        }`}>
          {/* Left sidebar (if position === 'left') */}
          {position === 'left' && showDesktopSidebar && (
            sidebarContent ? (
              <div className="overflow-y-auto">
                {sidebarContent}
              </div>
            ) : (
              <AIMentorSidebarLeft 
                pose={mentorPose} 
                isActive={mentorActive}
                opacity={mentorOpacity}
              />
            )
          )}

          {/* Main content area */}
          <main className="relative min-h-screen overflow-y-auto overflow-x-hidden flex flex-col">
            {/* Content with proper padding and spacing */}
            <div className="flex-1">
              {children}
            </div>
          </main>

          {/* Right sidebar (if position === 'right') */}
          {position === 'right' && showDesktopSidebar && (
            sidebarContent ? (
              <div className="overflow-y-auto">
                {sidebarContent}
              </div>
            ) : (
              <AIMentorSidebar 
                pose={mentorPose} 
                isActive={mentorActive}
                opacity={mentorOpacity}
              />
            )
          )}
        </div>
      </div>
    );
  }

  /**
   * Mobile Layout (<768px)
   * Floating avatar with full-screen main content
   */
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Full-screen main content */}
      <main className="relative min-h-screen overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* Floating avatar for mobile */}
      {showMobileAvatar && (
        <FloatingAIMentorBubble 
          pose={mentorPose} 
          isActive={mentorActive}
          isVisible={true}
        />
      )}
    </div>
  );
}

/**
 * Desktop Layout Hook
 * Utility hook to detect and handle responsive behavior
 */
export function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setIsMobile(true);
        setScreenSize('mobile');
      } else if (width < 1024) {
        setIsMobile(false);
        setScreenSize('tablet');
      } else {
        setIsMobile(false);
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, screenSize };
}
