'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { CommanderArkaPose } from './ChatUIEnhancers';

interface FloatingAIMentorBubbleProps {
  pose?: CommanderArkaPose;
  isActive?: boolean;
  message?: string;
  onClose?: () => void;
  isVisible?: boolean;
}

/**
 * FloatingAIMentorBubble Component
 * Mobile-optimized floating avatar that can be dragged and expanded with speech bubble
 * 
 * Features:
 * - Floating avatar (80x80px) in bottom-right
 * - Draggable to avoid covering important buttons
 * - Click to expand and show speech bubble with mascot half-body
 * - Dynamic opacity (20-30% idle, 100% active)
 * - Pointer-events: none when minimized so clicks pass through
 */
export function FloatingAIMentorBubble({
  pose = 'vision',
  isActive = false,
  message = '',
  onClose,
  isVisible = true
}: FloatingAIMentorBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Initialize position to bottom-right corner (with safe margin)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const margin = 16;
      setPosition({
        x: window.innerWidth - 96 - margin,
        y: window.innerHeight - 96 - margin
      });
    }
  }, []);

  // Handle mouse drag - only when minimized and not expanded
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const margin = 16;
    const newX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 96 - margin));
    const newY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 96 - margin));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch drag (mobile) - improved
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isExpanded) return;
    e.preventDefault();
    touchStartRef.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current.x === 0 && touchStartRef.current.y === 0) return;
    e.preventDefault();

    const margin = 16;
    const newX = Math.max(0, Math.min(e.touches[0].clientX - touchStartRef.current.x, window.innerWidth - 96 - margin));
    const newY = Math.max(0, Math.min(e.touches[0].clientY - touchStartRef.current.y, window.innerHeight - 96 - margin));
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    touchStartRef.current = { x: 0, y: 0 };
  };

  // Close expanded view
  const handleClose = () => {
    setIsExpanded(false);
    if (onClose) onClose();
  };

  // Responsive: Only show on mobile (<768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isVisible || !isMobile) return null;

  // Dynamic opacity system:
  // - Idle (25%): Visible but subtle, doesn't block interactions
  // - Hover (60%): On mouse/touch hover
  // - Active (100%): When expanded or forcefully active
  const getOpacity = () => {
    if (isExpanded) return 'opacity-100';
    if (isActive || isHovering) return 'opacity-100';
    return 'opacity-25'; // Idle state - subtle but visible
  };

  return (
    <>
      {/* Floating Avatar Bubble - Only on mobile */}
      <div
        ref={containerRef}
        className={`fixed z-40 transition-all duration-300 ${getOpacity()} ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isExpanded ? 'pointer-events-auto' : 'pointer-events-auto'} select-none`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '80px',
          height: '80px',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="AI Mentor Bubble"
      >
        {/* Avatar Circle - Click to expand */}
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400 shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative group active:scale-95"
          aria-label="Open AI Mentor"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Mascot Avatar Image - PNG transparent */}
          <div className="relative w-16 h-16">
            <Image
              src={`/images/mascots/commander-arka-${pose}.png`}
              alt="Commander Arka"
              fill
              className="object-contain drop-shadow-sm"
              priority={false}
            />
          </div>
          {/* Active indicator pulse */}
          {isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse" />
          )}
          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
          {/* Drag hint */}
          {!isExpanded && (
            <div className="absolute bottom-0 right-0 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              📍 Drag
            </div>
          )}
        </button>
      </div>

      {/* Expanded Speech Bubble Modal */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all" 
          style={{ pointerEvents: 'auto' }}
          onClick={() => setIsExpanded(false)}
        >
          <div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 max-w-sm md:max-w-md w-full shadow-2xl shadow-blue-500/20 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan avatar dan close button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full bg-blue-500/20 p-2 flex items-center justify-center">
                  <Image
                    src={`/images/mascots/commander-arka-${pose}.png`}
                    alt="Commander Arka"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-bold text-blue-400">Warrior Buddy</p>
                  <p className="text-xs text-slate-400">⚡ Hybrid AI Mentor</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-700/50 rounded-lg flex-shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 mb-4" />

            {/* Message Content dengan markdown support */}
            {message && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
              </div>
            )}

            {/* Empty state message */}
            {!message && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 mb-4 text-center">
                <MessageCircle size={24} className="mx-auto mb-2 text-blue-400" />
                <p className="text-slate-300 text-sm">Siap membantu Anda, Warrior! 💪</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Got It!</span>
                <span>💪</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
