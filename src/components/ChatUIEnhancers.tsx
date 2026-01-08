/**
 * FASE 2.5: Chat UI Enhancements
 * Reusable components for AI Mentor chat
 */

import { ReactNode } from 'react';
import Image from 'next/image';

/**
 * TypingIndicator Component
 * Shows animated typing dots while AI is processing
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

/**
 * FASE 2.5: Commander Arka Avatar States
 * 5 Pose types based on THE PLAN WARRIOR BLUEPRINT
 * - Onboarding (Military Salute) → Welcome screens
 * - Vision (Siaga/Alert) → Chart upload
 * - Victory (Celebration) → TP/Profit hit
 * - Warning (Serious/Risk) → Overtrade warning
 * - Empty (Thinking/Repair) → Error/Empty state
 */
export type CommanderArkaPose = 'onboarding' | 'vision' | 'victory' | 'warning' | 'empty';

export function CommanderArkaAvatar({ 
  pose = 'vision',
  isThinking = false,
  model = 'Warrior Buddy'
}: { 
  pose?: CommanderArkaPose;
  isThinking?: boolean;
  model?: string;
}) {
  // Get color and emoji based on pose
  const getPoseStyle = (): { bg: string; border: string; emoji: string; aura: string } => {
    switch(pose) {
      case 'onboarding':
        return {
          bg: 'bg-gradient-to-br from-amber-500/40 to-amber-600/40',
          border: 'border-amber-500/50',
          emoji: '🫡',
          aura: 'bg-amber-500/20'
        };
      case 'victory':
        return {
          bg: 'bg-gradient-to-br from-green-500/40 to-emerald-600/40',
          border: 'border-green-500/50',
          emoji: '🎖️',
          aura: 'bg-green-500/30 animate-pulse'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-red-500/40 to-red-600/40',
          border: 'border-red-500/50',
          emoji: '⚠️',
          aura: 'bg-red-500/20 animate-bounce'
        };
      case 'empty':
        return {
          bg: 'bg-gradient-to-br from-slate-500/40 to-slate-600/40',
          border: 'border-slate-500/50',
          emoji: '🤔',
          aura: 'bg-slate-500/20'
        };
      case 'vision':
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-500/40 to-blue-600/40',
          border: 'border-blue-500/50',
          emoji: '📸',
          aura: 'bg-blue-500/20'
        };
    }
  };

  const style = getPoseStyle();
  return (
    <div className="flex-shrink-0 pt-0.5 pointer-events-none select-none">
      <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
        {/* Render image only (no background) to preserve PNG transparency */}
        <div className="relative w-full h-full flex items-center justify-center transition-all">
          <Image
            src={`/images/mascots/commander-arka-${pose}.png`}
            alt={`Commander Arka - ${pose}`}
            width={40}
            height={40}
            className="w-full h-full object-contain"
            priority={false}
          />
        </div>

        {/* Status indicator - only for thinking/loading (visual only) */}
        {isThinking && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-slate-900 animate-pulse" />
        )}
      </div>

      {/* Model label with pose info - hidden on very small screens */}
      <div className="hidden sm:block text-[9px] font-mono text-slate-500 text-center mt-1 whitespace-nowrap">
        <div>{model}</div>
        <div className="text-[8px] uppercase tracking-widest text-slate-600">{pose}</div>
      </div>
    </div>
  );
}

/**
 * MessageBubble Component
 * Enhanced message display with animations
 */
export function MessageBubble({ 
  content, 
  isUser = false,
  model,
  isLoading = false
}: { 
  content: ReactNode;
  isUser?: boolean;
  model?: string;
  isLoading?: boolean;
}) {
  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm p-2.5 md:p-4 rounded-lg max-w-[85%] md:max-w-[60%]">
          <div className="text-slate-100 text-sm md:text-base leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 md:gap-3 justify-start animate-fade-in max-w-[95%] md:max-w-[85%]">
      <CommanderArkaAvatar isThinking={isLoading} model={model} />
      <div className="flex-1">
        {isLoading ? (
          <div className="bg-slate-900/40 backdrop-blur-sm border-l-2 md:border-l-4 border-amber-500 p-2.5 md:p-5 rounded-sm flex items-center gap-2">
            <span className="text-slate-400 text-sm">Processing...</span>
            <TypingIndicator />
          </div>
        ) : (
          <div className="relative bg-slate-900/40 backdrop-blur-sm border-l-2 md:border-l-4 border-amber-500 p-2.5 md:p-5 rounded-sm shadow-lg shadow-amber-500/10">
            <div className="text-slate-100 text-sm md:text-base leading-relaxed">
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * StreamingText Component
 * Simulates typing effect for responses
 */
export function StreamingText({ text, speed = 15 }: { text: string; speed?: number }) {
  // For now, just render the text immediately
  // In production, implement actual streaming with useEffect
  return <>{text}</>;
}

/**
 * AIStatus Component
 * Shows which AI systems are active
 */
export function AIStatus({ 
  hasVision = true,
  hasGroq = true,
  isProcessing = false
}: { 
  hasVision?: boolean;
  hasGroq?: boolean;
  isProcessing?: boolean;
}) {
  return (
    <div className="flex gap-2 text-xs font-mono">
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
        hasVision 
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' 
          : 'bg-slate-700/50 text-slate-500 border border-slate-600/40'
      }`}>
        <span className={hasVision ? 'animate-pulse' : ''}>📸</span> Gemini Vision
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
        hasGroq 
          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' 
          : 'bg-slate-700/50 text-slate-500 border border-slate-600/40'
      }`}>
        <span className={hasGroq ? 'animate-pulse' : ''}>⚡</span> Groq Brain
      </div>
      {isProcessing && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40">
          <span className="animate-pulse">🔄</span> Processing
        </div>
      )}
    </div>
  );
}

/**
 * CommanderArkaFullDisplay Component
 * Shows full mascot art for different contexts (welcome, success, error, etc)
 * Replaces emoji with actual image when available
 */
export function CommanderArkaFullDisplay({
  pose = 'vision',
  size = 'medium', // small (80px), medium (160px), large (300px)
  showLabel = true
}: {
  pose?: CommanderArkaPose;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}) {
  const sizeMap = {
    small: 'w-16 h-16 sm:w-20 sm:h-20',
    medium: 'w-24 h-24 sm:w-40 sm:h-40',
    large: 'w-40 h-40 sm:w-80 sm:h-80'
  };

  const getPoseLabel = (): string => {
    switch(pose) {
      case 'onboarding': return 'Welcome Warrior! 🫡';
      case 'vision': return 'Analyzing Chart... 📸';
      case 'victory': return 'Victory! Target Reached! 🎖️';
      case 'warning': return 'Trading Plan Violation ⚠️';
      case 'empty': return 'Maintenance Mode 🤔';
      default: return 'Commander Arka';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pointer-events-none select-none">
      {/* Mascot Container - No background, no border. Allow overflow so art isn't cropped */}
      <div className={`${sizeMap[size]} flex items-center justify-center relative overflow-visible z-0`}>
        {/* Commander Arka Full Display Image */}
        <Image
          src={`/images/mascots/commander-arka-${pose}.png`}
          alt={`Commander Arka - ${pose} mode`}
          fill
          className="object-contain"
          priority={false}
        />
      </div>

      {/* Label - hidden on very small screens to avoid overlap */}
      {showLabel && (
        <div className="hidden sm:block text-center">
          <p className="font-bold text-slate-200">{getPoseLabel()}</p>
          <p className="text-xs text-slate-500 font-mono mt-1">Level 4 - COMMANDER</p>
        </div>
      )}
    </div>
  );
}

/**
 * ResultNotificationModal Component
 * Touchpoint 4: Shows trading results with appropriate mascot pose
 */
export function ResultNotificationModal({
  isOpen,
  result,
  message,
  onClose,
}: {
  isOpen: boolean;
  result: 'WIN' | 'LOSS' | 'OVERTRADE' | null;
  message: string;
  onClose: () => void;
}) {
  if (!isOpen || !result) return null;

  const isProfit = result === 'WIN';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`relative max-w-md w-full rounded-2xl p-8 border-2 ${
        isProfit 
          ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50 shadow-2xl shadow-green-500/20' 
          : 'bg-gradient-to-br from-red-900/40 to-orange-900/40 border-red-500/50 shadow-2xl shadow-red-500/20'
      }`}>
        
        {/* Mascot Display */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28">
            <CommanderArkaFullDisplay 
              pose={isProfit ? 'victory' : 'warning'}
            />
          </div>
        </div>

        {/* Result Text */}
        <div className="text-center space-y-4">
          <p className={`text-3xl font-black ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
            {isProfit ? '🎖️ Kemenangan! 🎖️' : '⚠️ Alert Disiplin ⚠️'}
          </p>
          
          <div className={`p-4 rounded-lg border ${
            isProfit
              ? 'bg-green-500/10 border-green-500/30 text-green-200'
              : 'bg-red-500/10 border-red-500/30 text-red-200'
          }`}>
            <p className="text-sm leading-relaxed font-mono">{message}</p>
          </div>

          {/* Motivational Message */}
          <p className={`text-sm font-bold ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
            {isProfit 
              ? '✨ Kemenangan yang layak! Lanjutkan konsistensi! ✨'
              : '💡 Disiplin adalah kunci kesuksesan. Jangan ulangi kesalahan ini! 💡'
            }
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`w-full mt-6 px-4 py-3 rounded-lg font-bold transition-colors ${
            isProfit
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          Lanjutkan Trading
        </button>
      </div>
    </div>
  );
}

