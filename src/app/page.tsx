import Link from 'next/link';

export default function LandingPage() {
  // Check if maintenance mode is enabled
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'false';

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
          {maintenanceMode && (
            <div className="mb-12 space-y-8">
              {/* Maintenance Mode Alert */}
              <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-8 backdrop-blur-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">⚠️ DOKUMEN TEKNIS: MAINTENANCE MODE IMPLEMENTATION</h3>
                    <p className="text-yellow-200/80 text-sm">Status: High Priority | Tujuan: Menutup akses publik untuk migrasi ke PWA, namun mempertahankan akses bagi pengelola</p>
                  </div>
                </div>

                {/* Section 1: Logika Akses */}
                <div className="space-y-4 mb-8 border-t border-yellow-500/30 pt-6">
                  <h4 className="font-bold text-yellow-300 text-lg">1. Logika Akses (Access Control)</h4>
                  <p className="text-yellow-100/80 text-sm">Tim IT harus menerapkan filter pada Middleware atau HOC dengan ketentuan:</p>
                  <ul className="space-y-2 text-yellow-100/70 text-sm ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span><strong className="text-yellow-300">Public/Member:</strong> Redirect otomatis ke halaman /maintenance-migration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span><strong className="text-yellow-300">Role Admin & Super Admin:</strong> Tetap diizinkan mengakses seluruh dashboard, API, dan fitur aplikasi (Bypass redirect)</span>
                    </li>
                  </ul>
                </div>

                {/* Section 2: Implementasi Teknis */}
                <div className="space-y-4 mb-8 border-t border-yellow-500/30 pt-6">
                  <h4 className="font-bold text-yellow-300 text-lg">2. Implementasi Teknis (Next.js)</h4>
                  <p className="text-yellow-100/80 text-sm">Logic di middleware.ts:</p>
                  <div className="bg-slate-900/50 border border-yellow-500/20 rounded-lg p-4 font-mono text-xs text-yellow-200/70 overflow-x-auto space-y-2">
                    <p>✓ Cek user.role dari session/cookie</p>
                    <p>✓ Jika role !== 'admin' DAN role !== 'superadmin', arahkan ke /maintenance</p>
                    <p>✓ API Routes tertentu tetap terbuka untuk Admin pengecekan data</p>
                  </div>
                </div>

                {/* Section 3: Desain Halaman */}
                <div className="space-y-4 mb-8 border-t border-yellow-500/30 pt-6">
                  <h4 className="font-bold text-yellow-300 text-lg">3. Desain Halaman Maintenance (Untuk Publik)</h4>
                  <p className="text-yellow-100/80 text-sm">Halaman harus tampil profesional:</p>
                  <ul className="space-y-2 text-yellow-100/70 text-sm ml-4">
                    <li><strong className="text-yellow-300">Headline:</strong> "MPT IS EVOLVING: MOBILE MIGRATION IN PROGRESS"</li>
                    <li><strong className="text-yellow-300">Copy:</strong> "Kami sedang memindahkan ekosistem MPT ke aplikasi mobile untuk pengalaman lebih stabil"</li>
                    <li><strong className="text-yellow-300">Admin Banner:</strong> "Admin Mode Active - Website is hidden from public" (untuk admin yang login)</li>
                  </ul>
                </div>

                {/* Section 4: Checklist untuk Tim IT */}
                <div className="space-y-4 border-t border-yellow-500/30 pt-6">
                  <h4 className="font-bold text-yellow-300 text-lg">4. Checklist Eksekusi Maintenance Mode</h4>
                  <div className="space-y-3 text-yellow-100/70 text-sm">
                    <div className="flex items-start gap-2 p-3 bg-slate-900/30 rounded">
                      <span className="text-yellow-400 font-bold">□</span>
                      <div>
                        <p className="font-semibold text-yellow-300">Lock Website:</p>
                        <p>Tutup semua akses halaman untuk user biasa (Member)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-slate-900/30 rounded">
                      <span className="text-yellow-400 font-bold">□</span>
                      <div>
                        <p className="font-semibold text-yellow-300">Admin Bypass:</p>
                        <p>Super Admin dan Admin HARUS tetap bisa login & akses dashboard. Jangan sampai terkunci</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-slate-900/30 rounded">
                      <span className="text-yellow-400 font-bold">□</span>
                      <div>
                        <p className="font-semibold text-yellow-300">Migration Page:</p>
                        <p>Buat halaman informatif penjelasan migrasi ke Mobile PWA dengan link panduan instalasi</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-slate-900/30 rounded">
                      <span className="text-yellow-400 font-bold">□</span>
                      <div>
                        <p className="font-semibold text-yellow-300">Session Security:</p>
                        <p>Pastikan tidak ada kebocoran data saat proses migrasi</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-slate-900/30 rounded">
                      <span className="text-yellow-400 font-bold">□</span>
                      <div>
                        <p className="font-semibold text-yellow-300">Status Check:</p>
                        <p>Verifikasi sistem sudah siap dipantau secara internal oleh admin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-yellow-300/60 text-sm mb-4">Maintenance Mode adalah bagian dari strategi migrasi ke PWA</p>
              </div>
            </div>
          )}

          {/* Normal Landing Content */}
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
