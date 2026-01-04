import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 
          'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
        secondary: 
          'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
        success: 
          'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        danger: 
          'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
        warning: 
          'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
        info: 
          'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
        neutral:
          'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700',
        gradient:
          'bg-gradient-to-r from-sky-500 to-orange-500 text-white border-0 shadow-md',
      },
      size: {
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
      outlined: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        outlined: true,
        className: 'bg-transparent border-2 border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-400',
      },
      {
        variant: 'success',
        outlined: true,
        className: 'bg-transparent border-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400',
      },
      {
        variant: 'danger',
        outlined: true,
        className: 'bg-transparent border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      outlined: false,
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean;
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, outlined, pulse, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          badgeVariants({ variant, size, outlined }),
          pulse && 'animate-pulse-soft',
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1 flex-shrink-0">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export type { BadgeProps };
