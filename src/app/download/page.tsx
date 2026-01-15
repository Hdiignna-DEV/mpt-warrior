import Link from 'next/link';

export default function DownloadPage() {
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
        <section className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-amber-400 mb-6">
            Download MPT Warrior
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Get the official mobile app for iOS and Android. Access your trading dashboard, journal, AI mentor, and analytics on the go.
          </p>
          
          <div className="bg-slate-900/50 border border-amber-500/20 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Android</h3>
            <p className="text-slate-300 mb-4">Download directly from our server:</p>
            <a href="/downloads/mpt-warrior.apk" download className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
              Download APK
            </a>
          </div>

          <div className="bg-slate-900/50 border border-amber-500/20 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">iOS</h3>
            <p className="text-slate-300 mb-4">Coming soon on the App Store</p>
            <button disabled className="px-8 py-3 bg-slate-700 text-slate-400 font-bold rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="mt-8">
            <Link href="/login" className="inline-block px-8 py-3 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg transition">
              Already have an account? Login
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
