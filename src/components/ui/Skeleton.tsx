import React from 'react';
import clsx from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rounded' | 'circular';
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, ...props }, ref) => {
    const variantStyles = {
      text: 'rounded-md',
      rounded: 'rounded-lg',
      circular: 'rounded-full',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse',
          variantStyles[variant],
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height || '16px',
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };

// Prebuilt Skeleton Components for common use cases
export const ModuleCardSkeleton = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 space-y-3">
        <Skeleton width="25%" height="24px" />
        <Skeleton width="75%" height="32px" />
        <Skeleton width="50%" height="16px" />
      </div>
      <Skeleton variant="circular" width="48px" height="48px" />
    </div>
    <div className="space-y-2 mb-4">
      <Skeleton width="100%" height="12px" />
      <Skeleton width="85%" height="12px" />
      <Skeleton width="70%" height="12px" />
    </div>
    <div className="flex gap-3 mb-4">
      <Skeleton width="80px" height="24px" variant="rounded" />
      <Skeleton width="96px" height="24px" variant="rounded" />
    </div>
    <Skeleton width="100%" height="40px" variant="rounded" />
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
    <div className="flex items-center gap-4">
      <Skeleton variant="rounded" width="48px" height="48px" />
      <div className="flex-1 space-y-2">
        <Skeleton width="64px" height="32px" />
        <Skeleton width="96px" height="12px" />
      </div>
    </div>
  </div>
);

export const EssayCardSkeleton = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex gap-2">
        <Skeleton width="96px" height="24px" variant="rounded" />
        <Skeleton width="80px" height="24px" variant="rounded" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <Skeleton width="33%" height="16px" />
      <Skeleton width="25%" height="12px" />
    </div>
    <div className="bg-slate-700/30 rounded-lg p-4 mb-4 space-y-2">
      <Skeleton width="100%" height="12px" />
      <Skeleton width="85%" height="12px" />
    </div>
    <Skeleton width="160px" height="40px" variant="rounded" />
  </div>
);

export const ListItemSkeleton = () => (
  <div className="flex items-center gap-3 p-3 animate-pulse">
    <Skeleton variant="circular" width="40px" height="40px" />
    <div className="flex-1 space-y-2">
      <Skeleton width="75%" height="16px" />
      <Skeleton width="50%" height="12px" />
    </div>
  </div>
);
