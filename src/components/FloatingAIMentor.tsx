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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Initialize position to bottom-right corner
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100
      });
    }
  }, []);

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return; // Don't drag when expanded
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 100));
    const newY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 100));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch drag (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isExpanded) return;
    touchStartRef.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current.x === 0 && touchStartRef.current.y === 0) return;

    const newX = Math.max(0, Math.min(e.touches[0].clientX - touchStartRef.current.x, window.innerWidth - 100));
    const newY = Math.max(0, Math.min(e.touches[0].clientY - touchStartRef.current.y, window.innerHeight - 100));
    
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

  // Idle opacity (20-30%) - doesn't block interactions
  const idleOpacity = isActive ? 'opacity-100' : 'opacity-30';
  // Active opacity (100%) - when expanded
  const activeOpacity = isExpanded ? 'opacity-100' : idleOpacity;

  return (
    <>
      {/* Floating Avatar Bubble - Only on mobile */}
      <div
        ref={containerRef}
        className={`fixed z-40 transition-all duration-300 ${activeOpacity} ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${!isExpanded ? 'pointer-events-auto' : 'pointer-events-none'} select-none`}
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="AI Mentor Bubble"
      >
        {/* Avatar Circle */}
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center relative group"
          aria-label="Open AI Mentor"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Mascot Avatar Image - PNG transparan */}
          <div className="relative w-16 h-16">
            <Image
              src={`/images/mascots/commander-arka-${pose}.png`}
              alt="Commander Arka"
              fill
              className="object-contain"
              priority={false}
            />
          </div>
          {/* Pulse indicator when active */}
          {isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse" />
          )}
          {/* Hover indicator */}
          <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors" />
        </button>
      </div>

      {/* Expanded Speech Bubble Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ pointerEvents: 'auto' }}>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 max-w-sm md:max-w-md w-full shadow-2xl shadow-blue-500/20 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
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
                className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Message Content */}
            {message && (
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-4">
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Got It! 💪
              </button>
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
