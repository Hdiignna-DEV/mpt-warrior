/**
 * Founder Showcase Component
 * Special display section for Founder/Head Educator on Leaderboard
 * Shows founder identity with crown icon, verified badge, and special styling
 */

'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Crown, Shield, Star } from 'lucide-react';

interface FounderShowcaseProps {
  name: string;
  title: string;
  description: string;
  expertise: string[];
  stats: Array<{ label: string; value: string }>;
  showRank?: boolean;
}

export default function FounderShowcase({
  name,
  title,
  description,
  expertise,
  stats,
  showRank = true
}: FounderShowcaseProps) {
  return (
    <div className="mb-8 relative px-2 sm:px-4">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/40 via-yellow-600/20 to-transparent rounded-2xl blur-3xl opacity-60 -z-10 left-2 sm:left-4 right-2 sm:right-4" />
      
      {/* Founder Container */}
      <Card className="relative bg-gradient-to-br from-amber-950/40 via-yellow-900/30 to-orange-950/40 border-2 border-amber-500/50 p-4 sm:p-6 md:p-8 shadow-2xl shadow-yellow-500/20">
        {/* Rank Badge - Top Center */}
        {showRank && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-black text-sm sm:text-lg shadow-lg whitespace-nowrap">
            👑 FOUNDER
          </div>
        )}

        {/* Main Content Grid - Single Column on Mobile */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-8 mt-6">
          {/* Left Column - Info Section */}
          <div className="md:col-span-2 space-y-3 md:space-y-4">
            {/* Name with Crown and Verified Badge */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-amber-300 drop-shadow-lg leading-tight break-words">
                  {name.split('(')[0].trim()}
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-bold text-xs sm:text-sm">
                  ✓ Verified Founder
                </Badge>
              </div>
            </div>

            {/* Title */}
            <div className="min-h-fit">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-300 font-bold italic drop-shadow-lg break-words">
                {title}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-100 leading-relaxed bg-white/5 p-3 md:p-4 rounded-lg border border-amber-500/30 break-words">
              {description}
            </p>

            {/* Expertise Tags */}
            <div>
              <p className="text-amber-300 text-xs sm:text-sm font-bold mb-2 md:mb-3 flex items-center gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" /> Areas of Expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {expertise.map((skill, idx) => (
                  <Badge 
                    key={idx} 
                    className="bg-amber-500/30 text-amber-200 border-amber-500/50 font-semibold text-xs line-clamp-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats Grid - Below Info */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 pt-2">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-amber-600/30 to-yellow-600/20 border border-amber-500/40 rounded-lg p-2 sm:p-3 md:p-4 text-center hover:from-amber-600/40 hover:to-yellow-600/30 transition-all duration-300 min-h-24 sm:min-h-28 flex flex-col justify-center"
                >
                  <p className="text-amber-300 text-xs sm:text-sm font-bold mb-1 md:mb-2 break-words line-clamp-2">{stat.label}</p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-black text-yellow-300 drop-shadow-lg break-words line-clamp-2">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Photo Section (Hidden on Mobile) */}
          <div className="hidden md:flex justify-center items-start md:mt-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shadow-2xl shadow-amber-500/40 border-4 border-amber-400/60 flex-shrink-0">
              <img 
                src="/images/founder-photo.jpg" 
                alt={name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-8xl">👨‍🏫</span>';
                }}
              />
            </div>
          </div>
        </div>

        {/* Photo on Mobile - Below Content */}
        <div className="md:hidden flex justify-center mt-6 pt-6 border-t border-amber-500/30">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shadow-2xl shadow-amber-500/40 border-4 border-amber-400/60 flex-shrink-0">
            <img 
              src="/images/founder-photo.jpg" 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to emoji if image not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-7xl">👨‍🏫</span>';
              }}
            />
          </div>
        </div>

        {/* Bottom Badge Row */}
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-amber-500/30 flex flex-wrap gap-1.5 sm:gap-2 items-center justify-center md:justify-start">
          <Badge className="bg-purple-600 text-white font-bold text-xs sm:text-sm whitespace-nowrap">
            🎓 Head Educator
          </Badge>
          <Badge className="bg-amber-600 text-yellow-50 font-bold text-xs sm:text-sm whitespace-nowrap">
            ⚔️ Founding Member
          </Badge>
          <Badge className="bg-indigo-600 text-white font-bold text-xs sm:text-sm whitespace-nowrap">
            🏆 Lifetime Mentor
          </Badge>
          <Badge className="bg-rose-600 text-white font-bold text-xs sm:text-sm whitespace-nowrap">
            💎 Premium Status
          </Badge>
        </div>
      </Card>

      {/* Subtitle */}
      <div className="text-center mt-4">
        <p className="text-amber-400 font-semibold italic text-xs sm:text-sm break-words">
          The visionary leader and mentor behind MPT Warrior Trading Community
        </p>
      </div>
    </div>
  );
}
