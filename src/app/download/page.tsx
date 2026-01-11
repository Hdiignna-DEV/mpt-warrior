'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, Smartphone, Apple, QrCode, Copy, Check } from 'lucide-react';

type DeviceType = 'android' | 'ios' | 'desktop' | 'unknown';

export default function DownloadPage() {
  const [device, setDevice] = useState<DeviceType>('unknown');
  const [copied, setCopied] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Detect device type
    const ua = navigator.userAgent.toLowerCase();
    
    if (/android/.test(ua)) {
      setDevice('android');
    } else if (/iphone|ipad|ipod/.test(ua)) {
      setDevice('ios');
    } else {
      setDevice('desktop');
    }
  }, []);

  const copyDownloadLink = () => {
    navigator.clipboard.writeText('https://mpt-warrior.vercel.app/apk/mpt-command-center-v1.0.apk');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-amber-400/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/mpt-logo.png" alt="MPT" width={40} height={40} />
            <div>
              <h1 className="text-2xl font-black text-amber-400">MPT Command Center</h1>
              <p className="text-xs text-slate-400">Professional Trading Platform</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Android Users */}
        {device === 'android' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-6">
              <div className="inline-block p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30">
                <Smartphone className="w-16 h-16 text-green-400 mx-auto" />
              </div>
              
              <div>
                <h2 className="text-4xl font-black text-white mb-2">
                  Welcome, Android Warrior! 🚀
                </h2>
                <p className="text-xl text-slate-300">
                  Your Professional Trading Command Center is ready
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-1">
              <a
                href="/apk/mpt-command-center-v1.0.apk"
                download
                className="block bg-slate-950 hover:bg-slate-900 transition-colors rounded-lg p-8 text-center group"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Download className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-black text-white">DOWNLOAD APK</span>
                </div>
                <p className="text-sm text-slate-400">Version 1.0.0 • 85 MB • Direct Download</p>
              </a>
            </div>

            {/* Installation Steps */}
            <div className="grid gap-4">
              <h3 className="text-2xl font-bold text-amber-400">Installation Steps</h3>
              
              {[
                { num: '1', title: 'Download APK', desc: 'Click the button above to download the APK file' },
                { num: '2', title: 'Allow Installation', desc: 'Go to Settings > Security > Enable Unknown Sources' },
                { num: '3', title: 'Open File', desc: 'Find the downloaded file and tap to install' },
                { num: '4', title: 'Grant Permissions', desc: 'Allow necessary permissions when prompted' },
                { num: '5', title: 'Launch App', desc: 'Open "MPT Command Center" from your app drawer' },
              ].map((step) => (
                <div key={step.num} className="flex gap-4 bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-amber-400/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-400/20 border border-amber-400/50 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-amber-400">{step.num}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{step.title}</p>
                    <p className="text-sm text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-amber-400 mb-4">What's Inside</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  '📊 Real-time Trading Dashboard',
                  '📔 Trading Journal & Analysis',
                  '🤖 AI Mentor Guidance',
                  '🧮 Risk Calculator',
                  '🏆 Live Leaderboard',
                  '🎖️ Achievement System',
                  '💬 Community Chat',
                  '📱 Offline Support',
                ].map((feature) => (
                  <div key={feature} className="text-slate-300">{feature}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* iOS Users */}
        {device === 'ios' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-6">
              <div className="inline-block p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30">
                <Apple className="w-16 h-16 text-blue-400 mx-auto" />
              </div>
              
              <div>
                <h2 className="text-4xl font-black text-white mb-2">
                  Welcome, iPhone Warrior! 🎯
                </h2>
                <p className="text-xl text-slate-300">
                  Install as an app for the best experience
                </p>
              </div>
            </div>

            {/* iOS Install Button */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-1">
              <button
                onClick={() => setShowIosGuide(!showIosGuide)}
                className="w-full bg-slate-950 hover:bg-slate-900 transition-colors rounded-lg p-8 text-center group"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Apple className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-black text-white">INSTALL ON iPHONE</span>
                </div>
                <p className="text-sm text-slate-400">Progressive Web App • No App Store • Instant</p>
              </button>
            </div>

            {/* iOS Guide */}
            {showIosGuide && (
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 rounded-xl p-6 border border-blue-500/30 space-y-6">
                <h3 className="text-2xl font-bold text-blue-400">How to Install (3 Steps)</h3>
                
                {[
                  {
                    num: '1',
                    title: 'Tap the Share Button',
                    desc: 'At the bottom of your Safari browser, tap the Share icon (square with arrow)',
                  },
                  {
                    num: '2',
                    title: 'Select "Add to Home Screen"',
                    desc: 'Scroll down and tap "Add to Home Screen" option',
                  },
                  {
                    num: '3',
                    title: 'Confirm & Done',
                    desc: 'Tap "Add" in the top right corner. App will appear on your home screen',
                  },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-400/20 border border-blue-400/50 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-400">{step.num}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white">{step.title}</p>
                      <p className="text-sm text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Features */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-blue-400 mb-4">App Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  '📊 Trading Dashboard',
                  '📔 Trade Journal',
                  '🤖 AI Mentor',
                  '🧮 Risk Calculator',
                  '🏆 Leaderboard',
                  '🎖️ Achievements',
                  '💬 Chat Support',
                  '⚡ Fast & Reliable',
                ].map((feature) => (
                  <div key={feature} className="text-slate-300">{feature}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Users */}
        {device === 'desktop' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-6">
              <div className="inline-block p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30">
                <QrCode className="w-16 h-16 text-purple-400 mx-auto" />
              </div>
              
              <div>
                <h2 className="text-4xl font-black text-white mb-2">
                  Download MPT Command Center 📱
                </h2>
                <p className="text-xl text-slate-300">
                  Scan the QR code with your phone or choose your platform
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-xl">
                  <Image
                    src="/qr-code-download.png"
                    alt="Scan to download"
                    width={300}
                    height={300}
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-center text-slate-400">
                  Scan with your Android or iPhone camera
                </p>
              </div>

              {/* Platform Options */}
              <div className="space-y-4 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-amber-400">Or Select Your Platform</h3>
                
                {/* Android Button */}
                <a
                  href="/apk/mpt-command-center-v1.0.apk"
                  download
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all rounded-lg p-6 text-center font-bold text-lg group"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Smartphone className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Download for Android (APK)</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">Version 1.0.0 • 85 MB</p>
                </a>

                {/* iOS Button */}
                <button
                  onClick={() => setDevice('ios')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all rounded-lg p-6 text-center font-bold text-lg group"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Apple className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Install on iPhone (PWA)</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">No App Store Required</p>
                </button>
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4">Direct Download Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://mpt-warrior.vercel.app/apk/mpt-command-center-v1.0.apk"
                  className="flex-1 bg-slate-800 border border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm"
                />
                <button
                  onClick={copyDownloadLink}
                  className="bg-amber-600 hover:bg-amber-500 transition-colors px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Universal Features Section */}
        {device !== 'unknown' && (
          <div className="mt-16 border-t border-slate-700 pt-12 space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-black text-amber-400 mb-4">Why Choose MPT Command Center?</h3>
              <p className="text-lg text-slate-300">Complete trading platform integrated with our website</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '📊',
                  title: 'Live Dashboard',
                  desc: 'Real-time stats synced with website account',
                },
                {
                  icon: '🔐',
                  title: 'Secure Connection',
                  desc: 'Full integration with website backend',
                },
                {
                  icon: '⚡',
                  title: 'Fast & Smooth',
                  desc: 'Optimized for mobile performance',
                },
                {
                  icon: '🤖',
                  title: 'AI Mentor',
                  desc: 'Get personalized trading guidance',
                },
                {
                  icon: '🏆',
                  title: 'Compete',
                  desc: 'Join the leaderboard, earn achievements',
                },
                {
                  icon: '📱',
                  title: 'Works Offline',
                  desc: 'Access data even without internet',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-amber-400/50 transition-colors"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 border-t border-slate-700 pt-12">
          <h3 className="text-3xl font-black text-amber-400 mb-8 text-center">Frequently Asked Questions</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'Is it safe to download the APK?',
                a: 'Yes! The APK is built directly from our official source code through Expo services. It\'s completely safe and verified.',
              },
              {
                q: 'Will my data sync between web and app?',
                a: 'Yes, the app is fully integrated with our website. Your trading data, journal, and account syncs in real-time.',
              },
              {
                q: 'Do I need an internet connection?',
                a: 'You need internet to login and sync data. However, once loaded, you can view your data offline.',
              },
              {
                q: 'Can I get notifications?',
                a: 'Yes! We send trading alerts, leaderboard updates, and achievement notifications via push notifications.',
              },
              {
                q: 'How do I update the app?',
                a: 'For Android, reinstall the latest APK. For iOS PWA, it updates automatically when you open the app.',
              },
              {
                q: 'What if I have problems?',
                a: 'Contact our support team via the in-app help or visit the website. We\'re here to assist you 24/7.',
              },
            ].map((item) => (
              <div key={item.q} className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-amber-400 mb-2">{item.q}</h4>
                <p className="text-slate-300 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-12 border-t border-slate-700 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to Join?</h3>
          <p className="text-slate-300 mb-6">Download MPT Command Center now and start your professional trading journey</p>
          {device === 'android' && (
            <a
              href="/apk/mpt-command-center-v1.0.apk"
              download
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all px-8 py-4 rounded-lg font-bold text-lg"
            >
              Download for Android
            </a>
          )}
          {device === 'ios' && (
            <button
              onClick={() => setShowIosGuide(true)}
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all px-8 py-4 rounded-lg font-bold text-lg"
            >
              Install on iPhone
            </button>
          )}
          {device === 'desktop' && (
            <p className="text-slate-400">Use the options above to download or scan the QR code</p>
          )}
        </div>
      </main>
    </div>
  );
}
