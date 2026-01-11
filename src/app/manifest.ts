import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MPT Command Center',
    short_name: 'MPT Center',
    description: 'MPT Command Center - Platform Trading Profesional untuk Warrior Indonesia. Dashboard trading, journal, AI mentor, risk calculator, leaderboard, dan achievement system.',
    start_url: '/?utm_source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#b45309',
    orientation: 'portrait-primary',
    categories: ['finance', 'productivity', 'business'],
    icons: [
      {
        src: 'https://mpt-community.vercel.app/mpt-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://mpt-community.vercel.app/mpt-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://mpt-community.vercel.app/mpt-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: 'https://mpt-community.vercel.app/images/screenshot-mobile.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: 'https://mpt-community.vercel.app/images/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Trading Journal',
        short_name: 'Journal',
        description: 'Log your trades quickly',
        url: '/journal?utm_source=shortcut',
        icons: [{ src: 'https://mpt-community.vercel.app/mpt-logo.png', sizes: '96x96' }],
      },
      {
        name: 'Risk Calculator',
        short_name: 'Calculator',
        description: 'Calculate position size',
        url: '/calculator?utm_source=shortcut',
        icons: [{ src: 'https://mpt-community.vercel.app/mpt-logo.png', sizes: '96x96' }],
      },
      {
        name: 'AI Mentor',
        short_name: 'AI',
        description: 'Get trading guidance',
        url: '/ai-mentor?utm_source=shortcut',
        icons: [{ src: 'https://mpt-community.vercel.app/mpt-logo.png', sizes: '96x96' }],
      },
    ],
    prefer_related_applications: false,
  }
}
