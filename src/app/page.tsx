import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-amber-500/20 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h1 className="text-sm sm:text-xl font-black text-amber-400">MPT COMMUNITY</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center">
        <section className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-amber-400 mb-6">
            MPT Trading HUB
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Professional trading platform for elite warriors. Download the mobile app to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/download">
              <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold px-8 py-3">
                Download App
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 px-8 py-3">
                Member Login
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-4 py-6 text-center text-slate-500">
        <p className="text-sm">© 2026 MPT Trading HUB. All rights reserved.</p>
      </footer>
    </div>
  );
}
