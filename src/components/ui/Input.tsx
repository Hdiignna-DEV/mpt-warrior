import React, { useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, fullWidth, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={clsx(fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200',
              'bg-white dark:bg-slate-800',
              'text-slate-900 dark:text-white',
              'placeholder-slate-400 dark:placeholder-slate-500',
              'focus:outline-none focus:ring-0',
              '[&:-webkit-autofill]:!text-slate-900 [&:-webkit-autofill]:dark:!text-white',
              '[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:dark:!bg-slate-800',
              '[&:-webkit-autofill]:[-webkit-text-fill-color:rgb(15_23_42)] [&:-webkit-autofill]:dark:[-webkit-text-fill-color:rgb(255_255_255)]',
              '[&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:dark:shadow-[0_0_0_1000px_rgb(30_41_59)_inset]',
              icon ? 'pl-10' : '',
              isPassword ? 'pr-10' : '',
              error
                ? 'border-red-500 dark:border-red-500 focus:border-red-600'
                : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-400',
              'disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed',
              className
            )}
            style={{ 
              WebkitTextFillColor: 'currentColor',
              color: 'currentColor',
              opacity: 1 
            }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1.5 font-medium">{error}</p>}
        {hint && !error && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
