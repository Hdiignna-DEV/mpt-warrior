'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AIMentorSidebar, AIMentorSidebarLeft } from './AIMentorSidebar';
import { FloatingAIMentorBubble } from './FloatingAIMentor';

interface ResponsiveAIMentorLayoutProps {
  children: ReactNode;
  mentorPose?: any;
  mentorActive?: boolean;
  position?: 'right' | 'left';
}

/**
 * ResponsiveAIMentorLayout Component
 * Automatically switches between mobile (floating bubble) and desktop (sidebar) layouts
 * 
 * Mobile (<768px): Floating bubble in bottom-right corner (draggable, dynamic opacity)
 * Tablet/Desktop (≥768px): Fixed sidebar (20% width, smooth hover effects)
 * 
 * Props:
 * - children: Main content
 * - mentorPose: 'onboarding' | 'vision' | 'victory' | 'warning' | 'empty'
 * - mentorActive: Highlight active state with animations
 * - position: 'right' (default) or 'left' for sidebar position
 */
export function ResponsiveAIMentorLayout({
  children,
  mentorPose = 'vision',
  mentorActive = false,
  position = 'right'
}: ResponsiveAIMentorLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration-safe responsive detection
  useEffect(() => {
    setIsHydrated(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch by only rendering after mount
  if (!isHydrated) {
    return <div className="relative min-h-screen">{children}</div>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Sidebar for desktop/tablet only (≥768px) */}
      {!isMobile && position === 'right' && (
        <AIMentorSidebar pose={mentorPose} isActive={mentorActive} />
      )}
      
      {!isMobile && position === 'left' && (
        <AIMentorSidebarLeft pose={mentorPose} isActive={mentorActive} />
      )}

      {/* Main content area with proper spacing */}
      <div className={`relative min-h-screen transition-all duration-300 ${
        !isMobile && position === 'right' ? 'lg:pr-1/5' : ''
      } ${
        !isMobile && position === 'left' ? 'lg:pl-1/5' : ''
      }`}>
        {children}
      </div>

      {/* Floating bubble for mobile only (<768px) */}
      {isMobile && (
        <FloatingAIMentorBubble 
          pose={mentorPose} 
          isActive={mentorActive}
          isVisible={true}
        />
      )}
    </div>
  );
}
