export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 mb-4">
            <span className="text-3xl">🔧</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Maintenance Mode
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-300 mb-8">
          We're currently upgrading our platform to serve you better. We'll be back online shortly.
        </p>

        {/* Status */}
        <div className="bg-slate-900/50 border border-amber-500/20 rounded-lg p-6 mb-8">
          <p className="text-slate-400 text-sm mb-3">Estimated Return</p>
          <p className="text-amber-400 font-bold text-lg">
            We appreciate your patience
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">
            For urgent inquiries, please contact us at:
          </p>
          <p className="text-amber-400 font-semibold mt-2">
            support@mpt-community.com
          </p>
        </div>

        {/* Footer */}
        <p className="text-slate-500 text-xs mt-8">
          © 2026 MPT Trading HUB. All rights reserved.
        </p>
      </div>
    </div>
  );
}
