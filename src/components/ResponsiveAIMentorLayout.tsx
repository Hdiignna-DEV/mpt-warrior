'use client';

import { ReactNode } from 'react';
import { AIMentorSidebar, AIMentorSidebarLeft } from './AIMentorSidebar';
import { FloatingAIMentorBubble } from './FloatingAIMentor';

export function ResponsiveAIMentorLayout({
  children,
  mentorPose = 'vision',
  mentorActive = false,
}: {
  children: ReactNode;
  mentorPose?: any;
  mentorActive?: boolean;
}) {
  // Responsive: detect screen width
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  return (
    <div className="relative min-h-screen">
      {/* Sidebar for desktop/tablet only */}
      {!isMobile && <AIMentorSidebar pose={mentorPose} isActive={mentorActive} />}

      {/* Main content area should be inside */}
      <div className="lg:ml-0 lg:mr-1/5">
        {children}
      </div>

      {/* Floating bubble for mobile only */}
      {isMobile && <FloatingAIMentorBubble pose={mentorPose} isActive={mentorActive} />}
    </div>
  );
}
