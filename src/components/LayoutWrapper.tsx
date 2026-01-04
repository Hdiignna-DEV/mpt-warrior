'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import PanicButton from './PanicButton';
import TradingViewCalendar from './TradingViewCalendar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Landing page routes tanpa dashboard layout
  const isLandingPage = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/pending-approval';
  
  // Render landing page tanpa sidebar/header/footer
  if (isLandingPage) {
    return <>{children}</>;
  }
  
  // Render dashboard layout untuk semua route lain
  return (
    <>
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content with Footer */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden w-full transition-all duration-300">
          <div className="flex-1 pb-8">
            {children}
          </div>
          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Global Floating Components */}
      <PanicButton />
      <TradingViewCalendar />
    </>
  );
}
