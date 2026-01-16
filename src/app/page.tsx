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
            <Link href="/login" className="px-4 py-2 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg transition">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold rounded-lg transition">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center">
        <section className="max-w-3xl mx-auto px-4">
          {/* Landing Content */}
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-amber-400 mb-6">
              MPT Trading HUB
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Professional trading platform for elite warriors. Download the mobile app to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download" className="inline-block px-8 py-3 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold rounded-lg transition">
                Download App
              </Link>
              <Link href="/login" className="inline-block px-8 py-3 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg transition">
                Member Login
              </Link>
            </div>
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
