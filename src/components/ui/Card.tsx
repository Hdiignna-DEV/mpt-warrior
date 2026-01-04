import React from 'react';
import clsx from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-2xl transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-slate-800 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg',
        elevated:
          'bg-white dark:bg-slate-800 backdrop-blur-lg border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl',
        glass:
          'backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 shadow-lg',
        flat:
          'bg-slate-50 dark:bg-slate-900 backdrop-blur-sm border-0 hover:bg-slate-100 dark:hover:bg-slate-800',
        outline:
          'bg-transparent backdrop-blur-sm border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600',
        bento:
          'relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:-translate-y-1 active:scale-[0.98]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  glow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, glow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          cardVariants({ variant, padding, interactive }),
          glow && 'shadow-glow-primary',
          className
        )}
        {...props}
      >
        {variant === 'bento' && (
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-orange-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        <div className={variant === 'bento' ? 'relative z-10' : ''}>
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx('text-2xl font-bold leading-none tracking-tight text-gray-900 dark:text-zinc-100', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-gray-600 dark:text-zinc-400', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex items-center pt-4', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
