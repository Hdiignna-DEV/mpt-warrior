/**
 * MPT Warrior - Modern Color System 2026
 * Optimized for Dark/Light modes with accessibility
 */

export const colors = {
  // Brand Colors - Trading Theme
  brand: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    accent: {
      50: '#fef3c7',
      100: '#fde68a',
      200: '#fcd34d',
      300: '#fbbf24',
      400: '#f59e0b',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
  },

  // Semantic Colors
  success: {
    light: {
      bg: '#d1fae5',
      text: '#065f46',
      border: '#6ee7b7',
      hover: '#a7f3d0',
    },
    dark: {
      bg: '#064e3b',
      text: '#6ee7b7',
      border: '#047857',
      hover: '#065f46',
    },
  },
  error: {
    light: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fca5a5',
      hover: '#fecaca',
    },
    dark: {
      bg: '#7f1d1d',
      text: '#fca5a5',
      border: '#b91c1c',
      hover: '#991b1b',
    },
  },
  warning: {
    light: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fcd34d',
      hover: '#fde68a',
    },
    dark: {
      bg: '#78350f',
      text: '#fcd34d',
      border: '#b45309',
      hover: '#92400e',
    },
  },
  info: {
    light: {
      bg: '#dbeafe',
      text: '#1e40af',
      border: '#93c5fd',
      hover: '#bfdbfe',
    },
    dark: {
      bg: '#1e3a8a',
      text: '#93c5fd',
      border: '#2563eb',
      hover: '#1e40af',
    },
  },

  // Neutral Palette - Enhanced for both modes
  neutral: {
    light: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    dark: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },

  // Glass Effects
  glass: {
    light: {
      bg: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(0, 0, 0, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.05)',
    },
    dark: {
      bg: 'rgba(15, 23, 42, 0.7)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
  },

  // Gradient Presets
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    accent: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)',
    fire: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    emerald: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
} as const;

export type ColorTheme = typeof colors;
