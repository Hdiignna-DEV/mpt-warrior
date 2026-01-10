/**
 * ArkaMascotImage Component
 * WebP image loader with PNG fallback for Commander Arka poses
 * 
 * Features:
 * - Automatic WebP detection and fallback to PNG
 * - Transparent background support
 * - Optimized for Dark Mode
 * - Type-safe pose selection
 * - WCAG accessibility compliant
 */

import Image from 'next/image';
import { CSSProperties } from 'react';

export type CommanderArkaPose = 'empty' | 'onboarding' | 'vision' | 'victory' | 'warning';

interface ArkaMascotImageProps {
  pose: CommanderArkaPose;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: CSSProperties;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
}

/**
 * Get asset URL with WebP support
 * Returns WebP if supported, falls back to PNG
 */
function getArkaAssetUrl(pose: CommanderArkaPose, format: 'webp' | 'png' = 'webp'): string {
  const baseUrl = '/images/mascots';
  return `${baseUrl}/commander-arka-${pose}.${format}`;
}

/**
 * ArkaMascotImage Component
 * Uses native <picture> element for WebP + PNG fallback
 */
export function ArkaMascotImage({
  pose,
  alt = `Commander Arka - ${pose} pose`,
  className = 'w-24 h-36',
  width,
  height,
  priority = false,
  style,
  objectFit = 'contain'
}: ArkaMascotImageProps) {
  return (
    <picture>
      {/* WebP source for modern browsers */}
      <source 
        srcSet={getArkaAssetUrl(pose, 'webp')} 
        type="image/webp"
      />
      
      {/* PNG fallback for older browsers */}
      <img
        src={getArkaAssetUrl(pose, 'png')}
        alt={alt}
        className={`${className} transition-all duration-300`}
        style={{
          background: 'transparent',
          objectFit,
          ...style
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
    </picture>
  );
}

/**
 * Alternative: Next.js Image component with WebP support
 * Use this if you prefer Next.js image optimization
 */
export function ArkaMascotImageNextJS({
  pose,
  alt = `Commander Arka - ${pose} pose`,
  className = '',
  width = 96,
  height = 144,
  priority = false,
  style,
}: ArkaMascotImageProps) {
  return (
    <Image
      src={getArkaAssetUrl(pose, 'webp')}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`${className} transition-all duration-300`}
      style={{
        background: 'transparent',
        ...style
      }}
      onError={(e) => {
        // Fallback to PNG if WebP fails
        const img = e.target as HTMLImageElement;
        img.src = getArkaAssetUrl(pose, 'png');
      }}
    />
  );
}

/**
 * AssetStatusIndicator Component
 * Shows asset loading status and format information (for debugging)
 */
export function AssetStatusIndicator({ pose }: { pose: CommanderArkaPose }) {
  const supportsWebP = typeof window !== 'undefined' 
    ? document.createElement('canvas').toDataURL('image/webp').indexOf('image/webp') === 0
    : true;

  return (
    <div className="text-xs text-slate-500 text-center">
      <span>📦 {pose}</span>
      <span className="ml-2">({supportsWebP ? 'WebP' : 'PNG'})</span>
    </div>
  );
}
