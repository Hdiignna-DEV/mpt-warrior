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
    <div className="mb-8 relative">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/40 via-yellow-600/20 to-transparent rounded-2xl blur-3xl opacity-60 -z-10" />
      
      {/* Founder Container */}
      <Card className="relative bg-gradient-to-br from-amber-950/40 via-yellow-900/30 to-orange-950/40 border-2 border-amber-500/50 p-8 shadow-2xl shadow-yellow-500/20">
        {/* Rank Badge - Top Center */}
        {showRank && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 px-6 py-2 rounded-full font-black text-lg shadow-lg">
            👑 FOUNDER
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {/* Left Column - Info Section */}
          <div className="md:col-span-2 space-y-4">
            {/* Name with Crown and Verified Badge */}
            <div className="space-y-2">
              <div className="flex items-start gap-3 flex-wrap">
                <h2 className="text-4xl md:text-5xl font-black text-amber-300 drop-shadow-lg leading-tight">
                  {name.split('(')[0].trim()}
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-bold">
                  ✓ Verified Founder
                </Badge>
              </div>
            </div>

            {/* Title */}
            <div>
              <p className="text-xl md:text-2xl text-yellow-300 font-bold italic drop-shadow-lg">
                {title}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-100 leading-relaxed bg-white/5 p-4 rounded-lg border border-amber-500/30 text-base md:text-lg">
              {description}
            </p>

            {/* Expertise Tags */}
            <div>
              <p className="text-amber-300 text-sm font-bold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> Areas of Expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {expertise.map((skill, idx) => (
                  <Badge 
                    key={idx} 
                    className="bg-amber-500/30 text-amber-200 border-amber-500/50 font-semibold text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats Grid - Below Info */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-amber-600/30 to-yellow-600/20 border border-amber-500/40 rounded-lg p-4 text-center hover:from-amber-600/40 hover:to-yellow-600/30 transition-all duration-300"
                >
                  <p className="text-amber-300 text-xs md:text-sm font-bold mb-2">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-black text-yellow-300 drop-shadow-lg">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Photo Section */}
          <div className="flex justify-center items-start md:mt-0 mt-4">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shadow-2xl shadow-amber-500/40 border-4 border-amber-400/60 flex-shrink-0">
              <img 
                src="/images/founder-photo.jpg" 
                alt={name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-9xl">👨‍🏫</span>';
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Badge Row */}
        <div className="mt-6 pt-6 border-t border-amber-500/30 flex flex-wrap gap-2 items-center">
          <Badge className="bg-purple-600 text-white font-bold">
            🎓 Head Educator
          </Badge>
          <Badge className="bg-amber-600 text-yellow-50 font-bold">
            ⚔️ Founding Member
          </Badge>
          <Badge className="bg-indigo-600 text-white font-bold">
            🏆 Lifetime Mentor
          </Badge>
          <Badge className="bg-rose-600 text-white font-bold">
            💎 Premium Status
          </Badge>
        </div>
      </Card>

      {/* Subtitle */}
      <div className="text-center mt-4">
        <p className="text-amber-400 font-semibold italic">
          The visionary leader and mentor behind MPT Warrior Trading Community
        </p>
      </div>
    </div>
  );
}
